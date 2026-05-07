# 작업물 사진 추가 워크플로우

## 카테고리 코드표

| 구글 드라이브 폴더      | 파일명 코드 | 사이트 표시명         |
|------------------------|------------|----------------------|
| Everyday Carry (EDC)   | edc        | Everyday Carry       |
| Gaming                 | gaming     | Gaming               |
| Tool & Industrial      | tool       | Tool & Industrial    |
| Figure & Art           | figure     | Figure & Art         |
| Stand & Holder         | stand      | Stand & Holder       |

---

## 파일명 규칙

```
[카테고리코드]_[작업물이름]_[순서].jpg
```

예시:
- `edc_전자담배본체_01.jpg`
- `gaming_닌텐도스위치그립_01.jpg`
- `tool_드릴공구_01.jpg`
- `figure_피규어_01.jpg`
- `stand_거치대_01.jpg`

파일명 앞에 카테고리 코드를 붙이면 스크립트가 자동으로 올바른 폴더에 저장한다.
카테고리 코드가 없는 파일은 `uncategorized/` 폴더로 이동된다.

---

## 전체 흐름

### 1단계 — 사진 준비
구글 드라이브에서 사진을 다운로드해 `_incoming/` 폴더에 넣는다.
- 지원 형식: jpg, jpeg, png, webp
- 파일명 규칙 준수: `[카테고리코드]_[이름]_[순서].확장자`

### 2단계 — 이미지 처리 실행
```
node process-images.js
```
- `_incoming/` 폴더 안의 이미지를 자동으로 두 가지 크기로 크롭
  - `{파일명}_cover.jpg` — 800×600px (카드 썸네일용)
  - `{파일명}_detail.jpg` — 800×800px (모달 상세 이미지용)
- 출력 위치: `images/works/[카테고리]/`
- 처리 완료된 원본은 `_incoming/_done/` 으로 자동 이동

### 3단계 — 결과물 확인
`images/works/` 하위 카테고리 폴더에서 생성된 파일을 확인한다.

### 4단계 — Claude Code에게 업데이트 요청
아래 형식으로 Claude Code에게 요청한다:

```
_incoming에 [작업물 이름] 사진 [n]장 처리했어.
index.html에서 id:[번호] 작업물 이미지 경로를 실제 파일로 업데이트해줘.
```

예시:
```
_incoming에 전자담배 본체 사진 3장 처리했어.
index.html에서 id:1 작업물 이미지 경로를 실제 파일로 업데이트해줘.
```

### 5단계 — Git 커밋 및 배포
```
git add .
git commit -m "작업물 사진 추가: [작업물 이름]"
git push
```
푸시 후 Vercel이 자동으로 배포한다.

---

## 폴더 구조
```
studio-won/
├── _incoming/              ← 구글 드라이브에서 받은 원본 사진
│   └── _done/              ← 처리 완료된 원본 (자동 이동, git 추적 안 함)
├── images/
│   └── works/
│       ├── edc/            ← Everyday Carry
│       ├── gaming/         ← Gaming
│       ├── tool/           ← Tool & Industrial
│       ├── figure/         ← Figure & Art
│       ├── stand/          ← Stand & Holder
│       └── uncategorized/  ← 코드 없는 파일
├── process-images.js       ← 이미지 처리 스크립트
└── index.html.html         ← 포트폴리오 메인 파일
```
