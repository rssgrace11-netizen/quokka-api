
// 1. Supabase 설정 (🚨여기에 복사한 키를 넣으세요!)
const PROJECT_URL = 'https://ugrvxaixtxaohjlxffbp.supabase.co'; // 예: https://abcdefg.supabase.co
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnZ4YWl4dHhhb2hqbHhmZmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDUxOTQsImV4cCI6MjA4NjUyMTE5NH0.kwknHwv7FOpay4gPZqgDUyXDBRo84UTBkRryB2RJJ5w'; // 예: eyJhbGciOiJIUzI1NiIs... (anon key)

// Supabase 클라이언트 생성
const { createClient } = supabase;
const _supabase = createClient(PROJECT_URL, API_KEY);

// 현재 보고 있는 쿼카 정보를 저장할 변수
let currentQuokka = null;

// 2. 요소 선택: Voting 섹션
const voteSection = document.getElementById("vote-section");
const breedsSection = document.getElementById("breeds-section");
const tabVoting = document.getElementById("tab-voting");
const tabBreeds = document.getElementById("tab-breeds");

const quokkaImg = document.getElementById("quokka-img");
const newQuokkaBtn = document.getElementById("new-quokka-btn");
const loveBtn = document.getElementById("love-btn");
const nameEl = document.getElementById("quokka-name");
const locEl = document.getElementById("quokka-location");
const tagsContainer = document.querySelector(".quokka-tags");

// 2-1. 요소 선택: Breeds 섹션 (검색)
const personalityFilter = document.getElementById("personality-filter");
const searchResults = document.getElementById("search-results");

// 2-2. 요소 선택: Upload 섹션
const uploadSection = document.getElementById("upload-section");
const tabUpload = document.getElementById("tab-upload");
const fileInput = document.getElementById("file-input");
const uploadArea = document.querySelector(".upload-area");
const uploadBtn = document.getElementById("upload-btn");
const uploadName = document.getElementById("upload-name");
const uploadPersonality = document.getElementById("upload-personality");
const uploadStatus = document.getElementById("upload-status");

// 2-3. 요소 선택: Auth (로그인)
const accountLink = document.getElementById("account-link");
const loginModal = document.getElementById("login-modal");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const btnSignIn = document.getElementById("btn-signin");
const btnSignUp = document.getElementById("btn-signup");
const btnCloseModal = document.getElementById("btn-close-modal");

// 현재 로그인한 사용자 정보
let currentUser = null;

// 3. 탭 전환 기능
function switchTab(tabName) {
    // 모든 탭 비활성화
    voteSection.style.display = 'none';
    breedsSection.style.display = 'none';
    uploadSection.style.display = 'none';
    
    tabVoting.classList.remove('active');
    tabBreeds.classList.remove('active');
    tabUpload.classList.remove('active');

    if (tabName === 'voting') {
        voteSection.style.display = 'block';
        tabVoting.classList.add('active');
    } else if (tabName === 'breeds') {
        breedsSection.style.display = 'block';
        tabBreeds.classList.add('active');
        filterQuokkas();
    } else if (tabName === 'upload') {
        uploadSection.style.display = 'block';
        tabUpload.classList.add('active');
    }
}

// 4. 진짜 DB에서 랜덤 쿼카 가져오기 (Voting)
async function fetchRandomQuokka() {
  quokkaImg.style.opacity = 0;
  nameEl.style.opacity = 0.5;

  try {
      // Supabase에서 데이터 가져오기 (랜덤 정렬은 아니지만, 일단 전체 목록 가져옴)
      // *실제 서비스에서는 랜덤 함수(RPC)를 쓰는 게 좋지만 여기선 간단하게 구현
      const { data, error } = await _supabase
        .from('quokkas')
        .select('*');

      if (error) throw error;
      
      // 클라이언트에서 랜덤 선택
      const randomIndex = Math.floor(Math.random() * data.length);
      const quokka = data[randomIndex];

      // 현재 쿼카 저장
      currentQuokka = quokka;

      // UI 업데이트
      updateQuokkaUI(quokka);

  } catch (err) {
      console.error("데이터 가져오기 실패:", err);
      alert("쿼카를 불러오지 못했습니다 ㅠㅠ");
  }
}

function updateQuokkaUI(quokka) {
    quokkaImg.src = quokka.image_url;
    quokkaImg.style.opacity = 1;

    nameEl.textContent = quokka.name;
    nameEl.style.opacity = 1;
    locEl.textContent = quokka.location;

    tagsContainer.innerHTML = "";
    
    // 성격 태그
    tagsContainer.appendChild(createTag(quokka.personality, "personality"));
    
    // 좋아요 수 태그 (likes는 배열이 아니라 숫자이므로 다르게 처리)
    if (quokka.likes > 0) {
        tagsContainer.appendChild(createTag(`❤️ ${quokka.likes}`, "like"));
    }
    
    resetLoveBtn();
}


// 5. 진짜 DB에서 쿼카 검색 필터링 (Breeds)
async function filterQuokkas() {
    const selectedPersonality = personalityFilter.value;
    searchResults.innerHTML = '<div style="text-align:center; padding: 2rem;">로딩 중...</div>';

    try {
        let query = _supabase.from('quokkas').select('*');

        if (selectedPersonality !== "all") {
            query = query.eq('personality', selectedPersonality);
        }

        const { data: filtered, error } = await query;
        if (error) throw error;

        searchResults.innerHTML = ""; // 초기화

        if (!filtered || filtered.length === 0) {
            searchResults.innerHTML = `<div style="text-align:center; padding: 2rem; color: #888;">검색 결과가 없습니다.</div>`;
            return;
        }

        // 결과 렌더링
        filtered.forEach(quokka => {
            const item = document.createElement("div");
            item.className = "search-item";
            item.style.cssText = "display: flex; align-items: center; gap: 1rem; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #fff;";

            item.innerHTML = `
                <img src="${quokka.image_url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                <div>
                    <div style="font-weight: bold; font-size: 0.95rem;">${quokka.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${quokka.personality} · ${quokka.location}</div>
                </div>
            `;
            searchResults.appendChild(item);
        });

    } catch (err) {
        console.error("검색 실패:", err);
        searchResults.innerHTML = `<div style="text-align:center; color: red;">오류가 발생했습니다.</div>`;
    }
}

// 6. 헬퍼 함수들
function createTag(text, type) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = text;
    if (type === "like") {
        span.style.backgroundColor = "#e1bee7"; 
        span.style.color = "#7b1fa2";
    }
    return span;
}

function resetLoveBtn() {
    loveBtn.querySelector("i").classList.remove("fa-solid");
    loveBtn.querySelector("i").classList.add("fa-regular");
    loveBtn.style.color = "#aaa";
}

async function toggleLove() {
  if (!currentQuokka) return; // 쿼카 정보가 없으면 실행 안 함

  const icon = loveBtn.querySelector("i");
  const isLoved = icon.classList.contains("fa-solid");

  if (isLoved) {
    // 이미 좋아요를 누른 상태라면 취소 (선택 사항: 여기서는 취소 기능은 뺄 수도 있음)
    alert("이미 좋아요를 누르셨습니다! ❤️");
    return;
  }

  // UI 먼저 업데이트 (반응 속도 빠르게 하기 위해)
  icon.classList.remove("fa-regular");
  icon.classList.add("fa-solid");
  loveBtn.style.color = "#ff6b6b"; 
  
  // 좋아요 숫자 1 증가시키기
  const newLikes = (currentQuokka.likes || 0) + 1;

  try {
      // Supabase에 업데이트 요청 보내기
      const { error } = await _supabase
        .from('quokkas')
        .update({ likes: newLikes })
        .eq('id', currentQuokka.id);

      if (error) throw error;

      // 성공하면 현재 데이터도 업데이트
      currentQuokka.likes = newLikes;
      
      // 태그 업데이트 (숫자 반영)
      updateLikeTag(newLikes);
      
      console.log("좋아요 반영 완료! 현재:", newLikes);

  } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 반영에 실패했습니다 ㅠㅠ");
      
      // UI 원상복구
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      loveBtn.style.color = "#aaa";
  }
}

// 좋아요 태그만 쏙 업데이트하는 함수
function updateLikeTag(count) {
    // 기존 좋아요 태그 찾기
    const tags = tagsContainer.querySelectorAll(".tag");
    let likeTag = null;
    
    tags.forEach(tag => {
        if (tag.textContent.includes("❤️")) {
            likeTag = tag;
        }
    });

    if (likeTag) {
        likeTag.textContent = `❤️ ${count}`;
    } else {
        tagsContainer.appendChild(createTag(`❤️ ${count}`, "like"));
    }
}

// 7. 이벤트 리스너 연결
newQuokkaBtn.addEventListener("click", fetchRandomQuokka);
loveBtn.addEventListener("click", toggleLove);
personalityFilter.addEventListener("change", filterQuokkas);

// 탭 클릭 이벤트 연결 (HTML onclick 대신 사용)
tabVoting.addEventListener("click", () => switchTab('voting'));
tabBreeds.addEventListener("click", () => switchTab('breeds'));
tabUpload.addEventListener("click", () => switchTab('upload'));

// 전역 함수 등록 제거 (이제 필요 없음)
// window.switchTab = switchTab;

// 초기 데이터 로드 (첫 화면용)
fetchRandomQuokka();

// 8. 이미지 업로드 처리
async function handleUpload() {
    const file = fileInput.files[0];
    const name = uploadName.value;
    const personality = uploadPersonality.value;

    if (!file || !name) {
        alert("사진과 이름을 모두 입력해주세요!");
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = "UPLOADING...";
    uploadStatus.textContent = "이미지를 업로드 중입니다...";

    try {
        // 1. Storage에 이미지 업로드
        // 파일 이름을 유니크하게 만들기 (시간_파일이름)
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('quokka_images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. 이미지 URL 가져오기
        const { data: { publicUrl } } = _supabase.storage
            .from('quokka_images')
            .getPublicUrl(fileName);

        // 3. Database에 정보 저장
        const { error: dbError } = await _supabase
            .from('quokkas')
            .insert({
                name: name,
                personality: personality,
                image_url: publicUrl,
                location: 'User Uploaded', // 사용자가 올린 건 위치를 이렇게 고정
                likes: 0
            });

        if (dbError) throw dbError;

        // 성공 처리
        alert("쿼카 등록 성공! 🎉");
        uploadStatus.textContent = "업로드 완료!";
        
        // 입력창 초기화
        fileInput.value = "";
        uploadName.value = "";
        uploadArea.querySelector("p").textContent = "클릭해서 쿼카 사진을 선택하세요!";
        
        // Voting 탭으로 이동해서 내 쿼카 확인해보기
        switchTab('voting');
        fetchRandomQuokka(); // 목록 갱신

    } catch (err) {
        console.error("업로드 실패:", err);
        alert("업로드 중 오류가 발생했습니다 ㅠㅠ");
        uploadStatus.textContent = "오류 발생";
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "UPLOAD QUOKKA";
    }
}

// 업로드 영역 클릭 시 파일 파일 선택창 열기
uploadArea.addEventListener("click", () => fileInput.click());

// 파일 선택 시 미리보기 텍스트 변경
fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        uploadArea.querySelector("p").textContent = `선택된 파일: ${e.target.files[0].name}`;
    }
});

uploadBtn.addEventListener("click", handleUpload);

// 9. 로그인/회원가입 관련 기능
// 모달 열기/닫기
accountLink.addEventListener("click", (e) => {
    e.preventDefault(); // 링크 이동 방지
    
    // 만약 이미 로그인된 상태라면? -> 로그아웃 확인
    if (currentUser) {
        if(confirm("로그아웃 하시겠습니까?")) {
            handleSignOut();
        }
        return;
    }

    loginModal.style.display = "flex";
});

btnCloseModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// 회원가입 처리
async function handleSignUp() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
    }

    try {
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        alert("회원가입 성공! 🎉\n이제 로그인 버튼을 눌러주세요.");
        
    } catch (err) {
        console.error("회원가입 에러:", err);
        alert("회원가입 실패: " + err.message);
    }
}

// 로그인 처리
async function handleSignIn() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // 로그인 성공 시
        currentUser = data.user;
        updateAccountUI(); // UI 업데이트
        loginModal.style.display = "none"; // 모달 닫기
        alert(`환영합니다! ${email.split('@')[0]}님 👋`);
        
        // 입력창 초기화
        loginEmail.value = "";
        loginPassword.value = "";

    } catch (err) {
        console.error("로그인 에러:", err);
        alert("로그인 실패: 이메일이나 비밀번호를 확인해주세요.");
    }
}

// 로그아웃 처리
async function handleSignOut() {
    try {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;

        currentUser = null;
        updateAccountUI();
        alert("로그아웃 되었습니다.");

    } catch (err) {
        console.error("로그아웃 에러:", err);
    }
}

// UI 업데이트 (로그인 상태에 따라 메뉴 이름 변경)
function updateAccountUI() {
    if (currentUser) {
        accountLink.textContent = "LOGOUT (" + currentUser.email.split('@')[0] + ")";
        accountLink.style.color = "#ff6b6b"; // 로그인하면 색깔 다르게
    } else {
        accountLink.textContent = "ACCOUNT";
        accountLink.style.color = ""; // 원래 색으로
    }
}

// 버튼 이벤트 연결
btnSignUp.addEventListener("click", handleSignUp);
btnSignIn.addEventListener("click", handleSignIn);

// 페이지 로드 시 로그인 상태 체크 (자동 로그인)
async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        updateAccountUI();
    }
}

// 앱 시작 시 세션 체크 실행
checkSession();

console.log("The Quokka API v4.0 (Auth Added) Started...");
