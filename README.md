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
├── 📄 pricing.html        # 가격 정책 페이지 (New!)
├── 📄 business.html       # 기업용 안내 페이지 (New!)
├── 📄 quokkas.html        # 쿼카 갤러리 및 소개 페이지 (New!)
├── 📄 documentation.html  # API 사용법 안내 문서 페이지
├── 📁 css/                # 스타일 파일 저장소
│   ├── style.css          # 웹사이트 전체 기본 디자인 (CSS)
│   └── style_patch.css    # 귀여운 UI 및 애니메이션 추가 (New!)
├── 📁 js/                 # 스크립트 파일 저장소
│   ├── script.js          # 모듈을 통합하는 메인 진입점 (EntryPoint)
│   └── 📁 modules/        # 기능별로 분리된 ES6 모듈 파일들 (auth.js, dom.js 등)
└── 📁 images/             # 쿼카 사진 저장소
    ├── Quokka.jpg
    └── ...
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
2. **인터랙티브 & 큐트 UI (New!)**:
   - 하트 아이콘(❤️) 클릭 시 활성화/비활성화 통통 튀는 바운스 토글
   - 폴라로이드 스타일의 사진 꾸미기와 둥둥 떠다니는 애니메이션 효과
3. **실제 데이터베이스 연동**:
   - **Supabase**를 사용하여 클라우드 DB에서 실시간으로 데이터를 가져옵니다.
4. **회원가입 및 로그인 모달 (New!)**: 안전한 Supabase Auth 연동 및 친절한 확인창
5. **나만의 쿼카 (My Page) 탭 (New!)**: 내가 좋아요를 누른 쿼카 사진들을 한곳에 모아보는 기능
6. **반응형 웹 디자인**: 데스크탑, 태블릿, 모바일 환경 완벽 지원

---

## � 현재 상태 & 로드맵 (Status & Roadmap)

이 프로젝트는 현재 **v5.0 (모듈화 및 UI 고도화)** 단계에 있습니다.

### ✅ 완료된 작업 (Completed)

- [x] **기획 & UI 디자인**: "The Cat API" 벤치마킹 및 반응형 퍼블리싱
- [x] **DB 연동**: 가짜 데이터 제거 및 Supabase Database 연동
- [x] **이미지 업로드 기능**: 사용자가 직접 찍은 쿼카 사진 업로드 (Supabase Storage)
- [x] **로그인 기능 & My Page**: 회원가입 후 나만의 즐겨찾기 목록(My Page) 모아보기 추가
- [x] **JS 모듈화 리팩토링**: 거대해진 `script.js`를 역할별(`.js`) 모듈로 분리하여 유지보수성 극대화
- [x] **페이지 확장 및 큐트 UI 완성**: Pricing, Business, Quokkas 메뉴 추가 및 폴라로이드 감성 CSS 애니메이션 적용

### 🔜 앞으로의 계획 (Todo)

- [ ] **소셜 로그인 기능**: 구글, 깃허브 계정 등을 통한 간편 1초 로그인 도입
- [ ] **다크 모드 (Dark Mode) 지원**: 밤에도 눈부심 없이 쿼카를 볼 수 있는 테마 추가
- [ ] **쿼카 월드컵 기능**: 랜덤으로 나오는 2마리의 쿼카 중 더 귀여운 쿼카를 고르는 미니게임 추가
- [ ] **API 응답 속도 최적화**: 로딩 스피너 및 이미지 캐싱 전략 도입으로 속도 개선

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend (DB)**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages

---

Designed with 💚 by **The Quokka API Team**.
