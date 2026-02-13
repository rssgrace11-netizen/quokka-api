
// 1. Supabase 설정 (🚨여기에 복사한 키를 넣으세요!)
const PROJECT_URL = 'https://ugrvxaixtxaohjlxffbp.supabase.co'; // 예: https://abcdefg.supabase.co
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnZ4YWl4dHhhb2hqbHhmZmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDUxOTQsImV4cCI6MjA4NjUyMTE5NH0.kwknHwv7FOpay4gPZqgDUyXDBRo84UTBkRryB2RJJ5w'; // 예: eyJhbGciOiJIUzI1NiIs... (anon key)

// Supabase 클라이언트 생성
const { createClient } = supabase;
const _supabase = createClient(PROJECT_URL, API_KEY);

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

// 전역 함수로 등록
window.switchTab = switchTab;

// 초기 데이터 로드 (첫 화면용)
fetchRandomQuokka();

console.log("The Quokka API v3.0 (Supabase Connected) Started...");
