
// 1. 확장된 가짜 데이터베이스 (Mock Database)
const quokkaDatabase = [
  {
    id: "qk_001",
    url: "images/Quokka.jpg",
    alt: "활짝 웃는 쿼카",
    name: "Happy Quokka",
    personality: "명랑함",
    location: "Rottnest Island - Main Settlement",
    likes: ["셀카 찍기", "관광객 구경하기"]
  },
  {
    id: "qk_002",
    url: "images/Quokka2.jpg",
    alt: "나뭇잎을 먹는 쿼카",
    name: "Hungry Quokka",
    personality: "먹보",
    location: "Rottnest Island - West End",
    likes: ["신선한 유칼립투스 잎", "낮잠"]
  },
  {
    id: "qk_003",
    url: "images/Quokka3.jpg",
    alt: "호기심 가득한 쿼카",
    name: "Curious Quokka",
    personality: "호기심 대장",
    location: "Rottnest Island - Pinky Beach",
    likes: ["카메라 렌즈", "새로운 친구"]
  }
];

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

// 3. 탭 전환 기능
function switchTab(tabName) {
    if (tabName === 'voting') {
        voteSection.style.display = 'block';
        breedsSection.style.display = 'none';
        tabVoting.classList.add('active');
        tabBreeds.classList.remove('active');
    } else if (tabName === 'breeds') {
        voteSection.style.display = 'none';
        breedsSection.style.display = 'block';
        tabVoting.classList.remove('active');
        tabBreeds.classList.add('active');
        
        // 브리드 탭 처음 열 때 목록 갱신
        filterQuokkas(); 
    }
}

// 4. 랜덤 쿼카 가져오기 (Voting)
function fetchRandomQuokka() {
  quokkaImg.style.opacity = 0;
  nameEl.style.opacity = 0.5;

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * quokkaDatabase.length);
    const quokka = quokkaDatabase[randomIndex];

    quokkaImg.src = quokka.url;
    quokkaImg.alt = quokka.alt;
    quokkaImg.style.opacity = 1;

    nameEl.textContent = quokka.name;
    nameEl.style.opacity = 1;
    locEl.textContent = quokka.location;

    tagsContainer.innerHTML = "";
    
    // 성격 태그
    tagsContainer.appendChild(createTag(quokka.personality, "personality"));
    
    // 좋아하는 것 태그 (최대 2개)
    quokka.likes.slice(0, 2).forEach(like => {
        tagsContainer.appendChild(createTag(like, "like"));
    });
    
    resetLoveBtn();
  }, 200);
}

// 5. 쿼카 검색 필터링 (Breeds)
function filterQuokkas() {
    const selectedPersonality = personalityFilter.value;
    searchResults.innerHTML = ""; // 기존 결과 초기화

    // 필터링
    const filtered = quokkaDatabase.filter(q => {
        if (selectedPersonality === "all") return true;
        return q.personality === selectedPersonality;
    });

    if (filtered.length === 0) {
        searchResults.innerHTML = `<div style="text-align:center; padding: 2rem; color: #888;">검색 결과가 없습니다.</div>`;
        return;
    }

    // 결과 렌더링
    filtered.forEach(quokka => {
        const item = document.createElement("div");
        item.className = "search-item"; // CSS 추가 필요
        item.style.cssText = "display: flex; align-items: center; gap: 1rem; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #fff;";

        item.innerHTML = `
            <img src="${quokka.url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
            <div>
                <div style="font-weight: bold; font-size: 0.95rem;">${quokka.name}</div>
                <div style="font-size: 0.8rem; color: #666;">${quokka.personality} · ${quokka.location}</div>
            </div>
        `;
        searchResults.appendChild(item);
    });
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

function toggleLove() {
  const icon = loveBtn.querySelector("i");
  const isLoved = icon.classList.contains("fa-solid");

  if (isLoved) {
    icon.classList.remove("fa-solid", "text-red-500");
    icon.classList.add("fa-regular");
    loveBtn.style.color = "#aaa";
  } else {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    loveBtn.style.color = "#ff6b6b"; 
  }
}

// 7. 이벤트 리스너 연결
newQuokkaBtn.addEventListener("click", fetchRandomQuokka);
loveBtn.addEventListener("click", toggleLove);
personalityFilter.addEventListener("change", filterQuokkas);

// 전역 함수로 등록 (HTML onclick에서 쓰기 위함)
window.switchTab = switchTab;

console.log("The Quokka API v2.0 Started...");
