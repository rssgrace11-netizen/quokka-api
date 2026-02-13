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
├── 📁 css/                # 스타일 파일 저장소
│   └── style.css          # 웹사이트 전체 디자인 (CSS)
├── 📁 js/                 # 스크립트 파일 저장소
│   └── script.js          # 동적 기능 (Supabase 연동 로직)
└── 📁 images/             # 쿼카 사진 저장소
    ├── Quokka.jpg
    ├── Quokka2.jpg
    └── Quokka3.jpg
```

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
3. **실제 데이터베이스 연동 (New!)**:
   - **Supabase**를 사용하여 클라우드 DB에서 실시간으로 데이터를 가져옵니다.
   - 더 이상 가짜 데이터(Mock Data)를 사용하지 않습니다.
4. **반응형 웹 디자인**: 데스크탑, 태블릿, 모바일 환경 완벽 지원

---

## � 현재 상태 & 로드맵 (Status & Roadmap)

이 프로젝트는 현재 **v2.0** 단계에 있습니다.

### ✅ 완료된 작업 (Completed)

- [x] **기획 & UI 디자인**: "The Cat API" 벤치마킹 및 퍼블리싱 (HTML/CSS)
- [x] **기능 구현**: 랜덤 이미지 로더, 탭 전환 기능 (JS)
- [x] **배포**: GitHub Pages를 통한 웹 호스팅
- [x] **DB 연동**: 가짜 데이터 제거 및 **Supabase** 연동 완료

### 🔜 앞으로의 계획 (Todo)

- [ ] **이미지 업로드 기능**: 사용자가 직접 찍은 쿼카 사진 업로드 (Supabase Storage)
- [ ] **좋아요(Like) 실시간 반영**: 내가 누른 좋아요가 서버에 저장되어 다른 사람에게도 보이도록 구현
- [ ] **로그인 기능**: 회원가입 후 나만의 즐겨찾기 목록 만들기

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend (DB)**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages

---

Designed with 💚 by **The Quokka API Team**.
