# gh.ggang.cloud 배포

이미지 빌드 없이 git-sync가 `https://github.com/ggingggang/gh.git`의 `main`을 30초 주기로 가져오고, nginx가 `/git/current/public`만 제공합니다. Markdown을 수정한 뒤 `npm run check`로 생성한 `public/`도 함께 push합니다.

## 환경 값

| 항목 | 값 / 설정 위치 |
| --- | --- |
| 리소스 이름 | `eu-ai-act` |
| 앱 네임스페이스 | `app` · `deploy/kustomization.yaml` |
| Git URL · 브랜치 | `gh.git` · `main` · `deploy/base/deployment.yaml` |
| 외부 주소 | `gh.ggang.cloud` · `deploy/base/httproute.yaml` |
| Gateway | `istio-system/public-gateway`, listener `https-wildcard` |
| ArgoCD | `cicd` · `argocd/application.yaml` |

`app` 네임스페이스, Gateway API CRD, 위 Gateway/listener와 wildcard TLS가 준비되어 있어야 합니다. 해당 listener는 `app`의 HTTPRoute를 허용해야 합니다. 외부 DNS는 기존 external-dns 설정 또는 직접 레코드 설정이 필요합니다. Gateway는 이 저장소가 생성하지 않습니다.

## 최초 배포

프로젝트 전체를 `gh.git` 저장소 루트에 push합니다. ArgoCD와 git-sync가 모두 같은 저장소의 `main`을 사용합니다.

```bash
# 로컬 검사와 생성
npm ci
npm run check
kubectl kustomize deploy

# 수동 설치
kubectl apply -k deploy

# 또는 ArgoCD Application 등록
kubectl apply -f argocd/application.yaml
```

ArgoCD는 `deploy/`를 동기화합니다. Application은 `CreateNamespace=false`이며, 기존 `app` 네임스페이스를 사용합니다. nginx ConfigMap은 Kustomize 해시를 사용하므로 설정 변경 시 Pod 템플릿에도 새 이름이 반영됩니다.

## 실행 상태 확인

```bash
kubectl -n app rollout status deployment/eu-ai-act
kubectl -n app get pods -l app.kubernetes.io/name=eu-ai-act
kubectl -n app logs deployment/eu-ai-act -c git-sync --tail=30
kubectl -n app describe httproute eu-ai-act
kubectl -n app port-forward service/eu-ai-act 8080:80
```

포트 포워딩 후 `http://127.0.0.1:8080/`, `/docs/`, `/A/`, `/B/`, `/C/`, `/D/`, `/F/`를 확인합니다. HTTPRoute 상태의 `Accepted`·`ResolvedRefs`, DNS와 TLS가 준비되면 `https://gh.ggang.cloud`로 접속할 수 있습니다.

## 기동과 장애 처리

- nginx 프로세스의 startup/liveness는 `/healthz`로 확인합니다.
- nginx readiness는 실제 `/index.html`을 요청합니다. 최초 clone 전에는 트래픽을 받지 않습니다.
- git-sync의 `:2020/`는 startup/readiness에 사용합니다. 최초 sync 이후의 상태이며 콘텐츠가 항상 최신이라는 보장은 아닙니다.
- GitHub에 일시적으로 연결되지 않아도 마지막 정상 checkout을 제공하며 git-sync는 재시도합니다.
- git-sync와 nginx의 `/tmp`는 서로 다른 `emptyDir`입니다. 두 컨테이너는 non-root, 읽기 전용 rootFS, 권한 상승 금지, 모든 capability 제거를 사용합니다.
- nginx는 없는 파일에 404를 반환합니다. 원문 파일이나 잘못된 문서 주소를 학습 첫 화면으로 숨기지 않습니다.

## 비공개 gh 저장소

기본 설정은 인증 없이 읽을 수 있는 저장소용입니다. 비공개 저장소는 최소 읽기 권한의 저장소 인증을 준비하고 `app`에 `eu-ai-act-git-auth` Secret을 만듭니다. 값은 Git에 저장하지 않습니다.

```bash
# username.txt와 token.txt에는 각각 값 하나만 저장하며 줄바꿈을 넣지 않습니다.
kubectl -n app create secret generic eu-ai-act-git-auth \
  --from-file=username=/secure/path/username.txt \
  --from-file=password=/secure/path/token.txt

kubectl kustomize deploy/private
kubectl apply -k deploy/private
```

인증 파일은 git-sync 컨테이너에만 읽기 전용으로 마운트합니다. nginx에는 마운트하지 않습니다. ArgoCD는 별도의 저장소 자격증명이 필요하므로 ArgoCD의 repository credential 기능으로 `gh.git`을 등록하고 Application의 `spec.source.path`를 `deploy/private`로 바꿉니다. 토큰 실값이나 Secret YAML은 저장소에 커밋하지 않습니다.

## Gateway 없이 내부에서만 확인

`deploy/base`에도 HTTPRoute가 들어 있습니다. Gateway API가 없는 클러스터에서 내부 Service만 필요하면 별도의 overlay에서 HTTPRoute를 삭제하는 패치를 추가한 뒤 적용하세요. 현재 기본 배포는 사용자가 지정한 `gh.ggang.cloud`의 Gateway 경로를 포함합니다.

## 선택 사항인 이미지 패키징

git-sync 대신 이미지를 운영할 때는 제공된 Dockerfile을 사용할 수 있습니다.

```bash
docker build -t eu-ai-act:local .
docker run --rm -p 8080:8080 eu-ai-act:local
```

이 Dockerfile은 Node 빌드 단계에서 문서를 생성하고 런타임에는 `public/`만 복사합니다. Kubernetes 기본 매니페스트는 계속 git-sync 방식이므로 이미지 방식으로 전환하려면 Deployment를 별도로 바꿔야 합니다.

## 참고한 공식 문서

- [git-sync v4.4.0 옵션과 symlink 계약](https://github.com/kubernetes/git-sync/blob/v4.4.0/README.md)
- [nginx-unprivileged 이미지와 임시 디렉터리](https://github.com/nginx/docker-nginx-unprivileged)
- [nginx root와 try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)
- [Kubernetes startup·readiness·liveness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

클러스터에 접속해 적용하지 않았으므로 실제 Gateway/DNS/TLS 및 Git 인증은 배포 단계에서 확인합니다.
