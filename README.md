# EU AI Act 협상 학습 사이트

조원들이 EU AI Act의 GPAI 규제 협상을 이해할 수 있도록 만든 스크롤 학습 페이지와 A·B·C·D·F 문서실입니다.

- 저장소: `https://github.com/ggingggang/gh.git`, 브랜치 `main`
- 배포 도메인: `https://gh.ggang.cloud`
- Kubernetes: `app` 네임스페이스의 `eu-ai-act`
- 제공 방식: `git-sync → public/ → nginx → Service → HTTPRoute`

## 사이트 구성

| 주소 | 내용 |
| --- | --- |
| `/` | 스크롤 학습, 행위자 비교, 윈셋 모형, 용어 사전, 퀴즈 |
| `/docs/` | 문서실과 제목·본문 검색 |
| `/A/` | 입법 배경과 필요성 · 4개 문서 |
| `/B/` | 읽기 안내·외부 이해관계와 협상 요구·근거자료 · 6개 문서 |
| `/C/` | 읽기 안내·내부 이해관계자·입법 흐름·협상 5요소·출처대장 · 5개 문서 |
| `/D/` | 읽기 안내·협상 국면 분석·종합 결론 · 3개 문서 |
| `/F/` | 발표 구성안 · 2개 문서 |
| `/sources/` | 자료 포함 범위와 제외한 파일 안내 |

F는 앞서 발표 개요를 저장할 때 지정한 폴더명입니다. 기존 문서 경로를 유지하고 화면에는 **발표 구성안**으로 표시합니다.

## 1차 자료 제외

B·C·D의 최종 자료는 **각 폴더 안에서 `archive`나 `private` 경로에 속하지 않는 모든 `.md` 파일**입니다. 하위 폴더도 탐색하며 읽기 안내·README·출처대장·분석 본문을 모두 원본 그대로 복사합니다. 제목이나 파일명으로 추가 선별하지 않습니다. 현재 B·C·D 14개와 기존 A·F 6개, 총 20개를 제공합니다.

`archive`·`private`의 문서와 Markdown이 아닌 파일은 가져오지 않습니다. 1차 자료 PDF, 보관 HTML, 발췌 TXT, 검증 이미지, JSON 수집 기록은 배포에 포함하지 않습니다. 자료 내용에 따른 임의의 문서 제외나 본문 편집은 하지 않습니다.

문서 간 링크는 정적 HTML로 연결하고, 제외된 로컬 출처는 **파일 미포함**으로 표시합니다. 공식 사이트 등 외부 출처 링크는 유지합니다. nginx의 문서 루트는 저장소 전체가 아닌 `public/`입니다. 저장소 설정·원본 Markdown·Secret 경로는 웹으로 제공하지 않습니다.

## 로컬에서 보기

Node.js 24와 npm을 사용합니다. 전체 검증에는 kubectl 클라이언트도 필요합니다.

```bash
npm ci
npm run check
npm run preview
```

`http://127.0.0.1:4173`에서 확인합니다. 문서실의 절대 경로와 검색 파일을 사용하므로 `public/index.html` 더블클릭보다 위 HTTP 미리보기를 이용하세요.

## 내용을 수정하고 반영하기

1. 아래 가져오기 명령으로 B·C·D의 최종 Markdown을 갱신합니다. `archive`·`private` 밖의 `.md`가 자동으로 반영됩니다.
2. 스크롤 학습은 `site/index.html`, `site/app.js`, `site/styles.css`를 수정합니다.
3. `npm run check`로 정적 사이트를 재생성하고 검사합니다.
4. 수정한 소스와 **`public/` 결과물을 함께 커밋**하여 `main`에 push합니다.
5. git-sync가 30초 주기로 새 커밋을 가져오면 nginx가 새 결과물을 제공합니다.

문서실 제목·목록·목차·검색 인덱스는 배포용 Markdown에서 자동 생성됩니다. 브라우저에서 Mermaid 구조도도 로컬 번들로 표시합니다. `public/`는 직접 수정하지 않습니다.

기존 자료 폴더에서 Markdown만 다시 가져오려면:

```powershell
npm run import:content -- "C:\Users\kgh_4\Desktop\국제협상론"
npm run check
```

가져오기 도구의 기본 대상은 B·C·D입니다. 해당 폴더의 공개 Markdown을 모두 읽은 뒤 복사하고, 원본에서 이름이 바뀌거나 이동·삭제된 문서의 이전 배포용 사본을 제거합니다. 원본 자료 폴더는 수정하지 않습니다. 필요한 경우 명령 마지막에 `A B C D F`처럼 갱신할 폴더를 지정할 수 있습니다.

## Kubernetes 배포

[배포 안내](deploy/README.md)에 public/private 저장소 인증, Gateway 조건, 설치와 확인 명령을 정리했습니다.

```bash
kubectl kustomize deploy
kubectl apply -k deploy
```

ArgoCD를 사용한다면:

```bash
kubectl apply -f argocd/application.yaml
```

설정은 기존 환경의 `app`, `cicd`, `istio-system/public-gateway`, `https-wildcard`를 기준으로 합니다. `gh.git`의 저장소 루트에 이 프로젝트 전체가 들어가는 구조입니다.

## 파일 구조

```text
A/ B/ C/ D/ F/          분석 문서 원본 Markdown
site/                   학습 페이지와 문서실 UI 소스
scripts/                가져오기·정적 생성·로컬 미리보기
public/                 nginx가 제공하는 결과물 (Git에 포함)
tests/                  문서·링크·기능·Kustomize 검증
deploy/base/            git-sync + nginx + Service + HTTPRoute
deploy/private/         비공개 Git 저장소 인증 패치
argocd/application.yaml  gh.git / main / deploy
Dockerfile              선택 사항: 이미지로 패키징할 때 사용
.github/workflows/      소스·결과물 일치와 nginx 설정 검사
```

## 검증

`npm run check`는 문서 누락·1차 자료 제외, 내부 링크·앵커, 문서 검색, 학습 상호작용, Mermaid 번들, public/private Kustomize 구성을 검사합니다. GitHub Actions는 같은 검사와 `public/` 갱신 여부, 런타임 이미지의 `nginx -t`를 확인합니다.

실제 클러스터 적용·원격 push는 이 준비 작업에서 수행하지 않았습니다. 로컬 Docker 엔진이 실행 중이지 않아 컨테이너 실행 검증은 CI 또는 배포 환경에서 확인해야 합니다.
