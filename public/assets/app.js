"use strict";

const actors = {
  providers: {
    category: "모델 개발과 공급",
    title: "모델 단계의 부담을<br>어디까지 져야 할까?",
    names: "Aleph Alpha · Mistral AI",
    goal: "Aleph Alpha는 정량 기준의 2단계 규제에 반대하고 감독을 받는 의무적 자율규제를 지지했습니다. Mistral은 응용 중심 책임을 강조했습니다.",
    reason:
      "여러 용도로 쓰일 모델에 폭넓은 의무를 부과하면 개발 부담과 경쟁력 문제가 생길 수 있다는 입장입니다.",
    route:
      "독일 정부에 의견서·이메일 전달, 경영진의 공개 인터뷰, 프랑스 정부의 자문 참여 경로가 확인됩니다.",
    tension:
      "두 회사의 입장은 유사한 방향을 보이지만 모든 요구가 동일한 것은 아닙니다. 접근 경로가 곧 법문에 대한 결정력은 아닙니다.",
  },
  downstream: {
    category: "모델을 이용하는 기업",
    title: "공급자의 부담을 줄이면,<br>우리에게 넘어오지 않을까?",
    names: "European DIGITAL SME Alliance",
    goal: "소규모 업체의 부담 완화와 지배적 모델 공급자에 대한 규제를 함께 요구했습니다.",
    reason:
      "모델의 정보와 통제력을 가진 공급자에게 의무가 없으면, 이를 활용하는 후속 중소기업이 준수 책임을 떠안을 수 있습니다.",
    route: "EU 의사결정자를 대상으로 공개 입장문을 발표했습니다.",
    tension:
      "모델 개발사의 규제 부담 완화가 모든 기업에 같은 이익을 주는 것은 아닙니다. 가치사슬 안에서 책임이 이동할 수 있습니다.",
  },
  rights: {
    category: "학습자료와 창작자의 권리",
    title: "무엇을 학습했는지 알아야<br>권리를 보호할 수 있다.",
    names: "European Writers’ Council · 독일 문화·창작·미디어·노동 단체",
    goal: "EWC는 기반모델·생성형 AI 규제와 저작권 보호를 요구했습니다. 독일 단체들은 타협안 승인과 창작자 보호 유지를 촉구했습니다.",
    reason:
      "투명성은 이용허락과 보상, 권리 행사에 필요한 조건으로 제시됐습니다.",
    route:
      "EWC는 2023년 11월 삼자협상 의사결정자에게, 독일 단체들은 2024년 1월 총리·관계 장관에게 공개서한을 보냈습니다.",
    tension:
      "2024년 1월 서한은 합의 이후의 승인 압력입니다. 이를 2023년 12월 타협을 만든 원인으로 소급해서는 안 됩니다.",
  },
  open: {
    category: "공개 개발과 비례적 의무",
    title: "개발자의 책임과<br>공개 개발의 특성을 함께.",
    names: "Mozilla · Hugging Face 등 오픈소스 연합 · Ada Lovelace Institute",
    goal: "Mozilla는 원개발자 의무와 정보공유를, 오픈소스 연합은 개발·연구의 특성에 맞는 비례적 의무를 요구했습니다. Ada Lovelace Institute는 개발자 책임과 독립 평가를 제안했습니다.",
    reason:
      "책임을 유지하면서도 개발 방식과 규모의 차이를 반영하려는 입장입니다.",
    route:
      "의회 협상 담당자에 대한 서한, 삼자협상 관련 공동 의견서·정책 브리핑 등으로 요구를 전달했습니다.",
    tension:
      "오픈소스 보호 요구는 모든 법적 의무의 면제 요구와 같지 않습니다. 여러 단체를 하나의 동일한 입장으로 묶지 않습니다.",
  },
  industry: {
    category: "국경을 넘는 산업계의 접근",
    title: "규제 완화 요구 안에도<br>정보 제공 의무는 남았다.",
    names:
      "DIGITALEUROPE 등 33개 산업 대표 · European Round Table for Industry",
    goal: "DIGITALEUROPE 공동성명은 모델 규제를 투명성 중심으로 제한하는 움직임을 지지했습니다. ERT는 강화된 모델 규제에 반대하면서도 후속 기업에 대한 정보 제공은 의무화해야 한다고 주장했습니다.",
    reason:
      "산업적 활용을 촉진하면서 후속 기업이 준수에 필요한 정보를 확보하려는 복합적인 이해입니다.",
    route:
      "공동성명과 집행위원회 부위원장에게 보낸 서한 등 EU 기관에 직접 접근했습니다.",
    tension:
      "DIGITALEUROPE와 DIGITAL SME는 이름이 비슷하지만 다른 단체입니다. 산업계의 모든 규제 완화 주장을 의무의 전면 폐지로 읽을 수는 없습니다.",
  },
  civil: {
    category: "전체 법안의 기본권 쟁점",
    title: "혁신의 규칙에<br>권리의 경계를 묻다.",
    names: "EDRi · Access Now · Amnesty International 등 시민사회",
    goal: "경찰·이민 분야 AI, 생체감시, 국가안보 예외 등에 대한 권리 보호를 요구했습니다.",
    reason:
      "AI의 도입이 감시와 차별, 기본권 침해로 이어질 수 있다는 우려를 제기했습니다.",
    route: "2023년 12월 협상대표들에게 공개서한으로 요구를 전달했습니다.",
    tension:
      "이들의 직접 쟁점은 GPAI 산업정책 갈등과 다릅니다. 전체 협상의 기본권 압력으로 읽되, GPAI 타협을 직접 바꿨다고 단정하지 않습니다.",
  },
};

const issues = {
  responsibility: {
    beforeLabel: "의회와 프독이의 공개 입장",
    beforeTitle: "모델 단계에도 책임을 둘 것인가",
    before:
      "의회는 기반모델 공급자에게 직접 의무를 제안했습니다. 프독이 공동 문서는 응용 단계의 위험과 의무적 자율규제를 강조했습니다.",
    afterTitle: "GPAI 공급자의 법적 의무 유지",
    after:
      "최종법에는 기술문서, 후속 공급자 정보 제공, 저작권 준수 정책, 학습 내용 요약 등 모델 공급자 의무가 남았습니다.",
    reading:
      "프독이의 응용 중심 접근만으로 귀결되지 않았습니다. 책임을 모델 공급자에게도 배분하는 구조가 유지됐습니다.",
  },
  tier: {
    beforeLabel: "프독이 11월 문서 · 의회 6월안",
    beforeTitle: "같은 ‘차등’도 기준은 달랐다",
    before:
      "프독이는 모델의 2단계 접근에 반대했습니다. 의회 6월안은 기반모델 의무에 생성형 AI의 추가 의무를 제안했습니다.",
    afterTitle: "시스템적 위험에 따른 추가 의무",
    after:
      "GPAI 기본 의무에 더해 시스템적 위험 모델에는 평가·위험 완화·사고 보고·보안 등의 추가 의무를 둡니다.",
    reading:
      "의회 6월안의 기반모델·생성형 AI 구분과 최종법의 시스템적 위험 구분은 동일하지 않습니다. 의무가 재배치·차등화됐습니다.",
  },
  threshold: {
    beforeLabel: "이사회 전체의 후반 협상 위임",
    beforeTitle: "10²⁶ FLOPs",
    before:
      "공식 이사회 사후 분석에 나오는 후반 위임의 기준입니다. 프독이 공동 Non-paper의 숫자로 바꾸어 설명하면 안 됩니다.",
    afterTitle: "10²⁵ FLOPs 초과",
    after:
      "타협의 고영향 역량 추정 기준입니다. 이사회 분석은 의회 요구보다 높고 이사회 위임보다 낮은 값이라고 설명합니다.",
    reading:
      "학습에 사용한 누적 연산량 기준입니다. 국적 기준이나 ‘이하이면 자동 면제’ 기준이 아닙니다. 반박 절차와 별도 지정 경로가 있고, 숫자의 차이를 정치적 양보량으로 환산할 수는 없습니다.",
  },
  practice: {
    beforeLabel: "프독이 공동 Non-paper",
    beforeTitle: "모델카드와 의무적 자율규제",
    before: "행동규범·모델카드를 통한 접근과 초기 제재 유보를 제안했습니다.",
    afterTitle: "법적 의무 + 준수 입증 수단",
    after:
      "법률상 의무를 두고 행동강령을 그 의무의 준수를 입증하는 수단으로 활용합니다.",
    reading:
      "‘행동강령’이라는 형식이 남았다고 해서 자율규제안이 그대로 채택된 것은 아닙니다. 의무의 법적 성격과 이행 수단을 따로 봐야 합니다.",
  },
};

const glossary = [
  [
    "GPAI",
    "범용 인공지능. 다양한 과제를 수행하고 여러 시스템에 통합될 수 있는 모델을 이 학습의 중심 대상으로 봅니다. 구체적인 용도별 시스템의 위험 규제와 구분합니다.",
  ],
  [
    "기반모델",
    "Foundation model 또는 파운데이션 모델. 2023년 의회안 등에서 사용한 용어입니다. 최종법의 GPAI 모델과 시점·법적 정의의 차이를 구분해 읽습니다.",
  ],
  [
    "Level I",
    "대표 사이의 교섭입니다. 이 페이지에서는 이사회 의장국과 유럽의회 협상팀의 기관 간 교섭을 주된 관찰 대상으로 삼습니다. 집행위원회도 삼자협상에 참여합니다.",
  ],
  [
    "Level II",
    "대표를 위임하고 합의를 수용하는 내부의 조율과 의사결정입니다. 최종 표결뿐 아니라 사전 협의와 협상 중 지지 확인도 포함합니다.",
  ],
  [
    "윈셋",
    "Win-set. 내부에서 수용될 수 있는 Level I 합의안들의 집합입니다. 공개 최초 요구나 최종 합의 하나만으로 전체 범위를 알 수는 없습니다.",
  ],
  [
    "삼자협상",
    "Trilogue. 유럽의회·이사회·집행위원회가 참여하는 입법 타협 협상입니다. 잠정 합의 뒤에도 의회와 이사회의 정식 채택이 남습니다.",
  ],
  [
    "협상 위임",
    "Negotiating mandate. 대표가 교섭할 때 따르는 내부의 입장과 지침입니다. AI Act 협상에서는 COREPER가 의장국에 수정 위임을 부여한 기록이 확인됩니다.",
  ],
  [
    "COREPER",
    "회원국 상주대표들이 이사회 업무를 준비·조율하는 기구입니다. 위임과 타협안 검토에 관여하지만 그 지지 확인 자체가 최종 법률 채택은 아닙니다.",
  ],
  [
    "공동 비공식 문서",
    "Joint Non-paper. 공식 법률안과 구분되는 공동 입장·설계 대안 문서입니다. 프독이는 이를 통해 의무적 자율규제·모델카드를 제안했습니다.",
  ],
  [
    "BATNA",
    "협상이 결렬될 때 선택할 수 있는 최선의 대안입니다. 협상에서 얻고 싶은 조건과 구분하며, 대안의 실행 가능성과 비용을 확인해야 합니다.",
  ],
  [
    "FLOPs",
    "부동소수점 연산 횟수. 이 사례에서는 모델 학습에 사용한 누적 연산량입니다. 초당 처리 성능이나 기업 규모·국적을 뜻하지 않습니다.",
  ],
  [
    "시스템적 위험",
    "고영향 역량을 가진 GPAI 모델과 관련되어 큰 규모로 확산될 수 있는 위험을 다루는 범주입니다. 고위험 AI 시스템의 용도별 분류와 구별합니다.",
  ],
  [
    "행동강령",
    "Code of Practice. 최종 GPAI 규율에서는 법적 의무의 준수를 입증하는 수단입니다. 행동강령이 있다는 사실만으로 의무가 자발적인 것으로 바뀌지는 않습니다.",
  ],
  [
    "AI Office",
    "유럽 집행위원회 내 AI 사무국입니다. GPAI 감독·이행을 지원하는 체계에 놓이며, 독립 과학패널은 과학적 평가와 경보 등의 역할로 이를 지원합니다.",
  ],
  [
    "로그롤링",
    "서로 우선순위가 다른 쟁점에서 양보를 교환하는 방식입니다. 법안 전체에 대한 승인만으로 특정 쟁점 사이의 직접 맞교환을 입증할 수는 없습니다.",
  ],
];

const sourceGroups = {
  background: {
    title: "왜 별도의 입법이 필요했는가",
    description:
      "2021년 제안 이유의 기본권·안전, 혁신과 법적 확실성, 단일시장 목표를 출발점으로 삼습니다. 2022년 이사회안도 사전학습 모델을 고려했다는 점을 포함합니다.",
    links: [
      [
        "A · AI Act 핵심과 입법 필요성",
        "/A/01_AI_Act_핵심과_입법_필요성.html",
        "조원 자료 · 목적과 규율 구조",
      ],
      [
        "A · 입법 흐름과 검증",
        "/A/03_입법_흐름과_검증.html",
        "조원 자료 · 2020~2024 연표와 문안 비교",
      ],
      [
        "집행위원회 2021년 제안문",
        "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206",
        "1차 자료 · 제안 이유 1.1절·2.2절",
      ],
    ],
  },
  actors: {
    title: "요구와 전달 경로를 확인하기",
    description:
      "의견서·공개서한·접촉 기록은 요구와 접근 경로의 증거입니다. 특정 요구가 법문을 결정했다는 인과와 구분합니다.",
    links: [
      [
        "B · 외부 이해관계자",
        "/B/01_외부_이해관계자.html",
        "조원 자료 · 11개 행위자·연합의 요구",
      ],
      [
        "B · 근거자료와 검증 한계",
        "/B/04_근거자료와_검증한계.html",
        "원문 출처 목록 · S01~S30 등",
      ],
      [
        "C · 내부 이해관계자",
        "/C/C_역할과_내부이해관계자.html",
        "정부·기관 접근 경로와 승인권의 구분",
      ],
    ],
  },
  theory: {
    title: "퍼트남을 EU 입법협상에 적용하기",
    description:
      "윈셋, 사전 조율과 반복적 내부 수용, EU 기관과 회원국의 분석 수준을 구분합니다. 이 페이지의 모형은 이론 설명용이며 실제 윈셋의 추정값이 아닙니다.",
    links: [
      [
        "Putnam 1988 · Diplomacy and domestic politics",
        "https://www.cambridge.org/core/journals/international-organization/article/abs/diplomacy-and-domestic-politics-the-logic-of-twolevel-games/B2E11FB757C4465C4097015BD421035F",
        "원논문 · International Organization 42(3)",
      ],
      [
        "Putnam 원논문 서지",
        "https://doi.org/10.1017/S0020818300027697",
        "인쇄면 436~438쪽·441~442쪽",
      ],
      [
        "B · 퍼트남 양면게임 분석",
        "/B/02_퍼트남_양면게임_분석.html",
        "이 사례의 분석 단위와 해석 범위",
      ],
    ],
  },
  process: {
    title: "내부 조율과 교섭의 절차를 따라가기",
    description:
      "정부의 공동 문서 전달 설명, COREPER 수정 위임, 잠정 합의, 기관별 승인 기록을 연결합니다. 시간순서만으로 개별 요구의 법문 반영을 단정하지 않습니다.",
    links: [
      [
        "C · 입법 흐름 검증보고서",
        "/C/입법흐름_검증보고서.html",
        "조원 자료 · 절차와 승인 검증",
      ],
      [
        "C · 내부 이해관계자",
        "/C/C_역할과_내부이해관계자.html",
        "국가별 요구·전달·수용의 확인 범위",
      ],
      [
        "이사회 최종 타협 분석 ST 5662/24",
        "https://data.consilium.europa.eu/doc/document/ST-5662-2024-INIT/en/pdf",
        "1차 자료 · 1~2쪽 협상·위임, 5~6쪽 GPAI",
      ],
      [
        "이사회 실제 표결 기록",
        "https://data.consilium.europa.eu/doc/document/ST-10199-2024-INIT/en/pdf",
        "1차 자료 · 2024년 5월 21일 표결, 문서 발행 5월 22일",
      ],
    ],
  },
  compromise: {
    title: "어떤 출발점과 비교하는가",
    description:
      "의회 6월 수정안, 프독이 11월 공동 문서, 이사회 후반 위임, 2024년 최종법을 구분합니다. 이 페이지는 2024년 원법의 입법 결과를 설명합니다.",
    links: [
      [
        "B · 최초 요구와 타협 검증표",
        "/B/07_최초요구와_타협_검증표.html",
        "비교 기준과 법문 해석의 주의점",
      ],
      [
        "프독이 공동 Non-paper",
        "https://cdn.table.media/assets/wp-content/uploads/2023/11/20231118_Non-Paper-on-FM_GPAI-DE-F-IT.pdf",
        "1차 자료 · 2023년 11월 공동 요구",
      ],
      [
        "이사회 최종 타협 분석 ST 5662/24",
        "https://data.consilium.europa.eu/doc/document/ST-5662-2024-INIT/en/pdf",
        "1차 자료 · 5~6쪽의 위임·타협 비교",
      ],
      [
        "2024년 AI Act 공포법",
        "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
        "1차 자료 · 제51~56조, 제64·68조 등",
      ],
    ],
  },
  conclusion: {
    title: "결론의 근거와 설명 범위",
    description:
      "입증된 요구·위임·타협·승인을 바탕으로 양면게임을 설명합니다. 특정 기업의 결정력, 윈셋의 정확한 변화, 직접 로그롤링은 별도 증거가 필요한 주장입니다.",
    links: [
      [
        "D · 종합 결론",
        "/D/02_종합결론.html",
        "타협 결과·승인·이론의 설명 범위",
      ],
      [
        "F · 기존 20분 발표 개요",
        "/F/01_20분_발표개요.html",
        "발표 준비가 필요할 때 참고",
      ],
      [
        "F · 슬라이드 구성과 시간 배분",
        "/F/02_슬라이드_구성과_시간배분.html",
        "발표용 별도 구성안",
      ],
    ],
  },
};

const quizzes = [
  {
    q: "B 자료에 등장하는 Aleph Alpha는 어디에 놓일까요?",
    options: [
      "B가 외부 자료이므로 언제나 Level I이다.",
      "독일 정부를 기준으로 보면 내부 요구를 전달하는 행위자다.",
      "최종 입법 채택권을 가진 EU 기관이다.",
    ],
    answer: 1,
    why: "분석 수준은 폴더 이름이 아니라 누구를 협상대표로 보는지에 따라 정해집니다. B의 외부는 공식 대표 밖이라는 뜻입니다.",
  },
  {
    q: "산업계가 한목소리였다고 보기 어려운 이유는?",
    options: [
      "모든 기업이 공급자 의무의 전면 폐지를 원했다.",
      "모든 기업이 동일한 규제 강화를 원했다.",
      "개발사의 부담 완화와 후속 기업의 책임 전가 방지가 충돌했다.",
    ],
    answer: 2,
    why: "일부 모델 개발사는 부담 완화를 주장했지만, DIGITAL SME는 그 부담이 후속 중소기업에 넘어갈 수 있다고 우려했습니다.",
  },
  {
    q: "최초 요구와 다른 최종안을 승인했다면 무엇을 확인할 수 있을까요?",
    options: [
      "승인 시점에 그 합의가 제도적 수용 조건을 충족했다.",
      "협상 도중 윈셋이 반드시 넓어졌다.",
      "최초 공개 요구가 실제 최저 수용선이었다.",
    ],
    answer: 0,
    why: "최종안이 처음부터 실제 수용 범위 안에 있었을 가능성도 있습니다. 승인 사실만으로 윈셋의 크기나 변화를 알 수는 없습니다.",
  },
  {
    q: "10²⁶ → 10²⁵ FLOPs는 무엇과 무엇의 비교일까요?",
    options: [
      "프독이 공동 문서의 숫자와 최종 숫자.",
      "이사회 후반 위임의 기준과 기관 간 타협의 기준.",
      "EU 기업과 미국 기업에 적용되는 다른 기준.",
    ],
    answer: 1,
    why: "공식 이사회 분석은 타협 기준이 이사회 위임보다 낮고 의회의 요구보다 높았다고 설명합니다. 프독이 공동 요구와 이사회 전체 위임은 구별해야 합니다.",
  },
  {
    q: "이사회에서 27개국이 모두 찬성했다는 사실의 의미는?",
    options: [
      "만장일치가 법적 의결 요건이었다.",
      "모든 국가가 GPAI의 모든 조항에 만족했다.",
      "일부 우려가 남아 있어도 법안 전체에 찬성할 수 있었다.",
    ],
    answer: 2,
    why: "해당 안건은 가중다수결 대상이었습니다. 프랑스와 오스트리아는 선호나 우려를 남기면서도 전체 법안에 찬성했습니다.",
  },
];

function renderActor(key) {
  const item = actors[key];
  document.getElementById("actor-panel").innerHTML =
    `<span class="actor-category">${item.category}</span><h3>${item.title}</h3><p class="actor-names">${item.names}</p><dl class="actor-facts"><div><dt>요구</dt><dd>${item.goal}</dd></div><div><dt>이유</dt><dd>${item.reason}</dd></div><div><dt>경로</dt><dd>${item.route}</dd></div></dl><p class="actor-tension">${item.tension}</p><button class="source-link" data-source="actors">이 입장의 근거 읽기 ↗</button>`;
  document.querySelectorAll("[data-actor]").forEach((button) => {
    const active = button.dataset.actor === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function renderIssue(key) {
  const item = issues[key];
  document.getElementById("comparison-panel").innerHTML =
    `<div class="comparison-grid"><div class="comparison-side"><p class="eyebrow">출발점 · ${item.beforeLabel}</p><h3>${item.beforeTitle}</h3><p>${item.before}</p></div><div class="comparison-side after"><p class="eyebrow">타협 · 2024년 원법의 구조</p><h3>${item.afterTitle}</h3><p>${item.after}</p></div></div><div class="comparison-reading"><span>어떻게 읽나</span><p>${item.reading}</p></div>`;
  document.querySelectorAll("[data-issue]").forEach((button) => {
    const active = button.dataset.issue === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
renderActor("providers");
renderIssue("responsibility");

const glossaryDialog = document.getElementById("glossary-dialog");
const sourceDialog = document.getElementById("source-dialog");
const glossarySearch = document.getElementById("glossary-search");
let modalOpener = null;
function openModal(dialog, opener) {
  modalOpener = opener;
  dialog.showModal();
  document.body.classList.add("modal-open");
}
function renderGlossary(query = "") {
  const normalized = query.trim().toLocaleLowerCase();
  const results = glossary.filter(([name, text]) =>
    (name + text).toLocaleLowerCase().includes(normalized),
  );
  const container = document.getElementById("glossary-list");
  container.innerHTML = "";
  if (!results.length) {
    container.innerHTML =
      '<p class="glossary-empty">일치하는 용어가 없습니다. 다른 단어로 찾아보세요.</p>';
    return;
  }
  for (const [name, text] of results) {
    const item = document.createElement("article");
    item.className = "glossary-entry";
    const heading = document.createElement("h3");
    heading.textContent = name;
    const body = document.createElement("p");
    body.textContent = text;
    item.append(heading, body);
    container.append(item);
  }
}
function openSources(key, opener) {
  const group = sourceGroups[key];
  document.getElementById("source-content").innerHTML =
    `<h2>${group.title}</h2><p>${group.description}</p><ul class="source-items">${group.links.map(([title, link, detail]) => `<li><a href="${link}" target="_blank" rel="noopener">${title} ↗</a><small>${detail}</small></li>`).join("")}</ul><p class="source-dialog-note">A~F 문서는 이 사이트에서 읽을 수 있습니다. 1차 자료 파일은 배포하지 않으며, 외부 원문 링크는 원래 제공 사이트로 연결됩니다.</p>`;
  openModal(sourceDialog, opener);
}
document.addEventListener("click", (event) => {
  const actor = event.target.closest("[data-actor]");
  if (actor) renderActor(actor.dataset.actor);
  const issue = event.target.closest("[data-issue]");
  if (issue) renderIssue(issue.dataset.issue);
  const source = event.target.closest("[data-source]");
  if (source) openSources(source.dataset.source, source);
  const glossaryButton = event.target.closest(".glossary-open, [data-term]");
  if (glossaryButton) {
    glossarySearch.value = glossaryButton.dataset.term || "";
    renderGlossary(glossarySearch.value);
    openModal(glossaryDialog, glossaryButton);
    glossarySearch.focus();
  }
  const close = event.target.closest(".dialog-close");
  if (close) close.closest("dialog").close();
});
glossarySearch.addEventListener("input", () =>
  renderGlossary(glossarySearch.value),
);
for (const dialog of [glossaryDialog, sourceDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus({ preventScroll: true });
  });
}

function updateWinsets() {
  const widthA = Number(document.getElementById("council-range").value);
  const widthB = Number(document.getElementById("parliament-range").value);
  const a = [34 - widthA / 2, 34 + widthA / 2];
  const b = [66 - widthB / 2, 66 + widthB / 2];
  const start = Math.max(a[0], b[0]);
  const end = Math.min(a[1], b[1]);
  const overlap = Math.max(0, end - start);
  const barA = document.getElementById("range-council");
  const barB = document.getElementById("range-parliament");
  const barOverlap = document.getElementById("overlap-bar");
  barA.style.left = a[0] + "%";
  barA.style.width = widthA + "%";
  barB.style.left = b[0] + "%";
  barB.style.width = widthB + "%";
  barOverlap.style.left = start + "%";
  barOverlap.style.width = overlap + "%";
  const output = document.getElementById("lab-result");
  output.classList.toggle("no-overlap", overlap === 0);
  output.textContent =
    overlap > 0
      ? "연한 초록색 구간은 두 쪽 모두 수용할 수 있는 조건입니다. 겹침은 합의 가능성을 뜻하며, 실제 합의가 자동으로 성립한다는 뜻은 아닙니다."
      : "지금 모형에서는 두 범위가 겹치지 않습니다. 합의를 찾으려면 조건을 바꾸거나 내부 조율을 통해 수용 가능한 대안을 다시 탐색해야 합니다.";
}
document
  .querySelectorAll(".range-control input")
  .forEach((input) => input.addEventListener("input", updateWinsets));
document.getElementById("reset-lab").addEventListener("click", () => {
  document.getElementById("council-range").value = 58;
  document.getElementById("parliament-range").value = 52;
  updateWinsets();
});
updateWinsets();

const stage = document.getElementById("story-stage");
const storySteps = [...document.querySelectorAll(".story-step")];
const stageCaptions = [
  "내부 입장을 마련한 대표들이 기관 간 교섭을 시작합니다.",
  "요구는 정부와 EU 기관에 전달됩니다. 기업 접촉과 법문 결정은 구분합니다.",
  "회원국 조율과 COREPER 수정 위임은 진행 중인 교섭의 조건을 다시 정합니다.",
  "대표들은 의무의 범위·강도·이행 방식을 조정해 잠정 합의를 마련합니다.",
  "합의는 내부의 평가를 거쳐 공식 승인을 받습니다. 남은 우려와 찬성은 공존할 수 있습니다.",
];
let activeStep = -1;
let scrollScheduled = false;
const chapters = [...document.querySelectorAll("[data-chapter]")];
function updateScroll() {
  scrollScheduled = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("read-progress").style.width =
    (scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0) +
    "%";
  const isMobile = window.innerWidth <= 640;
  const trigger = isMobile
    ? Math.min(window.innerHeight * 0.76, 490)
    : window.innerHeight * 0.5;
  let current = 0;
  storySteps.forEach((step, index) => {
    if (step.getBoundingClientRect().top < trigger) current = index;
  });
  if (current !== activeStep) {
    activeStep = current;
    stage.dataset.state = String(current);
    document.getElementById("stage-counter").textContent =
      `0${current + 1} / 05`;
    document.getElementById("stage-caption").textContent =
      stageCaptions[current];
    storySteps.forEach((step, index) =>
      step.classList.toggle("active", index === current),
    );
    document.querySelectorAll(".stage-dots a").forEach((link, index) => {
      link.classList.toggle("active", index === current);
      if (index === current) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }
  let chapter = "";
  chapters.forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight * 0.4)
      chapter = section.id;
  });
  document.querySelectorAll(".chapter-nav a").forEach((link) => {
    const active = link.getAttribute("href") === "#" + chapter;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
function scheduleScroll() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateScroll);
  }
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
window.addEventListener("load", updateScroll);
updateScroll();

const quizAnswers = new Map();
function renderQuizzes() {
  document.getElementById("quiz-container").innerHTML = quizzes
    .map(
      (quiz, index) =>
        `<article class="quiz-question" data-question="${index}"><h4 id="question-${index}"><span>0${index + 1}</span>${quiz.q}</h4><div class="quiz-options" role="group" aria-labelledby="question-${index}">${quiz.options.map((option, answer) => `<button class="quiz-option" data-quiz="${index}" data-answer="${answer}" aria-pressed="false"><span>${String.fromCharCode(65 + answer)}</span>${option}</button>`).join("")}</div><div class="quiz-feedback" id="feedback-${index}" hidden aria-live="polite"></div></article>`,
    )
    .join("");
}
document.getElementById("quiz-container").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quiz]");
  if (!button) return;
  const index = Number(button.dataset.quiz);
  const answer = Number(button.dataset.answer);
  const quiz = quizzes[index];
  quizAnswers.set(index, answer);
  document.querySelectorAll(`[data-quiz="${index}"]`).forEach((option) => {
    const value = Number(option.dataset.answer);
    option.classList.toggle("correct", value === quiz.answer);
    option.classList.toggle(
      "incorrect",
      value === answer && value !== quiz.answer,
    );
    option.setAttribute("aria-pressed", String(value === answer));
  });
  const feedback = document.getElementById("feedback-" + index);
  feedback.hidden = false;
  feedback.innerHTML = `<strong>${answer === quiz.answer ? "맞습니다." : `정답은 ${String.fromCharCode(65 + quiz.answer)}입니다.`}</strong>${quiz.why}`;
  document.getElementById("quiz-count").textContent =
    `${quizAnswers.size} / ${quizzes.length} 완료`;
  if (quizAnswers.size === quizzes.length) {
    const score = [...quizAnswers].filter(
      ([key, value]) => quizzes[key].answer === value,
    ).length;
    document.getElementById("quiz-summary").textContent =
      `다섯 질문을 모두 살펴봤습니다. 현재 선택 ${score}/5 정답. 해설을 읽고 선택을 바꿔도 좋습니다.`;
  }
});
document.getElementById("quiz-reset").addEventListener("click", () => {
  quizAnswers.clear();
  renderQuizzes();
  document.getElementById("quiz-count").textContent = "0 / 5 완료";
  document.getElementById("quiz-summary").textContent =
    "정답보다, 그렇게 판단한 이유가 중요합니다.";
});
renderQuizzes();
document.getElementById("country-dots").innerHTML = "<i></i>".repeat(27);
document
  .getElementById("print-page")
  .addEventListener("click", () => window.print());

let detailsBeforePrint = [];
window.addEventListener("beforeprint", () => {
  if (document.body.classList.contains("printing")) return;
  document.body.classList.add("printing");
  detailsBeforePrint = [...document.querySelectorAll("details")].map(
    (detail) => [detail, detail.open],
  );
  detailsBeforePrint.forEach(([detail]) => {
    detail.open = true;
  });
  const actorPrint = document.createElement("div");
  actorPrint.className = "print-expanded";
  actorPrint.innerHTML = Object.values(actors)
    .map(
      (item) =>
        `<article><h3>${item.names}</h3><dl><dt>요구</dt><dd>${item.goal}</dd><dt>이유</dt><dd>${item.reason}</dd><dt>경로</dt><dd>${item.route}</dd></dl><p>${item.tension}</p></article>`,
    )
    .join("");
  document.querySelector(".actor-explorer").after(actorPrint);
  const issuePrint = document.createElement("div");
  issuePrint.className = "print-expanded";
  issuePrint.innerHTML = Object.values(issues)
    .map(
      (item) =>
        `<article><h3>${item.beforeTitle} → ${item.afterTitle}</h3><p>출발점: ${item.before}</p><p>타협: ${item.after}</p><p>${item.reading}</p></article>`,
    )
    .join("");
  document.getElementById("comparison-panel").after(issuePrint);
});
window.addEventListener("afterprint", () => {
  detailsBeforePrint.forEach(([detail, open]) => {
    detail.open = open;
  });
  document
    .querySelectorAll(".print-expanded")
    .forEach((element) => element.remove());
  document.body.classList.remove("printing");
});
