# 🐻 The Quokka API (쿼카 API)

> **"Quokkas as a Service."**
> 세상에서 가장 행복한 동물, 쿼카를 만나볼 수 있는 가상의 API 서비스 웹사이트입니다.

![Project Preview](images/Quokka.jpg)

## 📖 프로젝트 소개 (About)

이 프로젝트는 **REST API 서비스의 랜딩 페이지**를 모방하여 만든 웹사이트입니다.  
사용자는 버튼을 클릭하여 랜덤한 쿼카 사진과 프로필(이름, 성격, 서식지 등)을 확인할 수 있으며, 마치 실제 API를 호출하는 듯한 경험을 할 수 있습니다.

"The Cat API" 사이트 레이아웃을 벤치마킹하여 깔끔하고 전문적인 UI/UX를 구현했습니다.

---

## 📂 파일 및 폴더 구조 (Project Structure)

이 프로젝트는 다음과 같은 구조로 이루어져 있습니다.

```bash
quokka-api/
├── 📄 index.html          # 메인 랜딩 페이지 (홈 화면)
├── 📄 documentation.html  # API 사용법 안내 문서 페이지
├── 🎨 style.css           # 웹사이트 전체 디자인 (CSS)
├── ⚡ script.js           # 동적 기능 (가짜 DB, 랜덤 이미지 로직)
└── 📁 images/             # 쿼카 사진 저장소
    ├── Quokka.jpg
    ├── Quokka2.jpg
    └── Quokka3.jpg
```

### 📝 상세 설명

- **`index.html`**: 웹사이트의 얼굴입니다. 내비게이션 바, 메인 슬로건, 그리고 **API 데모 카드**(이미지 뷰어)가 포함되어 있습니다.
- **`documentation.html`**: 개발자를 위한 문서 페이지입니다. 엔드포인트(`GET /images/search`) 설명과 인증 방법 등이 적혀 있습니다.
- **`style.css`**: 따뜻한 베이지색(`#fdfcf5`)과 갈색, 녹색 포인트를 사용하여 쿼카와 어울리는 친환경적인 디자인을 구현했습니다. 반응형 디자인이 적용되어 모바일에서도 잘 보입니다.
- **`script.js`**:
  - **Mock Database (가짜 데이터베이스)**: 쿼카들의 정보(ID, 이름, 성격, 위치)가 JSON 형태의 배열로 저장되어 있습니다.
  - **Event Handling**: "새로운 쿼카 보기" 버튼 클릭 시 랜덤하게 데이터를 가져와 화면에 뿌려주는 역할을 합니다.

---

## 🚀 실행 방법 (How to Run)

이 프로젝트는 별도의 서버 설치 없이 웹 브라우저만 있으면 바로 실행 가능합니다.

1. 이 저장소를 다운로드하거나 `git clone` 합니다.
2. `index.html` 파일을 더블 클릭하여 실행합니다.
3. (추천) VS Code를 사용하신다면 **Live Server** 확장 프로그램을 통해 더 편하게 보실 수 있습니다.

---

## ✨ 주요 기능 (Features)

1. **랜덤 쿼카 생성기**: 버튼을 누를 때마다 새로운 쿼카 사진과 정보가 나타납니다.
2. **인터랙티브 UI**:
   - 하트 아이콘(❤️) 클릭 시 활성화/비활성화 토글
   - 마우스 호버 시 부드러운 애니메이션 효과
3. **가짜 API 응답 시각화**:
   - 주소창에 `api.thequokka.com/v1/images/..` 와 같은 가짜 URL 표시
   - 로딩 딜레이(0.2초)를 주어 실제 네트워크 통신 느낌 구현
4. **반응형 웹 디자인**: 데스크탑, 태블릿, 모바일 환경 완벽 지원

---

## 🛠️ 기술 스택 (Tech Stack)

- **HTML5**: 시맨틱 태그 사용
- **CSS3**: Flexbox, CSS Variables, 반응형 미디어 쿼리
- **JavaScript (ES6+)**: DOM 조작, 배열 메서드 활용
- **FontAwesome**: 아이콘 라이브러리 사용

---

Designed with 💚 by **The Quokka API Team**.
