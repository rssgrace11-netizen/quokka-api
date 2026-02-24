import { _supabase } from './config.js';
import { currentQuokka, setState } from './state.js';
import { createTag, resetLoveBtn } from './utils.js';
import { 
    quokkaImg, nameEl, locEl, tagsContainer, loveBtn, searchResults, personalityFilter
} from './dom.js';

// 4. 진짜 DB에서 랜덤 쿼카 가져오기 (Voting)
export async function fetchRandomQuokka() {
  quokkaImg.style.opacity = 0;
  nameEl.style.opacity = 0.5;

  try {
      const { data, error } = await _supabase
        .from('quokkas')
        .select('*');

      if (error) throw error;
      
      const randomIndex = Math.floor(Math.random() * data.length);
      const quokka = data[randomIndex];

      setState('currentQuokka', quokka); // 현재 쿼카 저장

      updateQuokkaUI(quokka);

  } catch (err) {
      console.error("데이터 가져오기 실패:", err);
      // alert("기본 쿼카를 불러옵니다..."); 
      // (기본 이미지는 HTML에 있으므로 굳이 alert 필요 없을 수도)
  }
}

function updateQuokkaUI(quokka) {
    quokkaImg.src = quokka.image_url;
    quokkaImg.style.opacity = 1;

    nameEl.textContent = quokka.name;
    nameEl.style.opacity = 1;
    locEl.textContent = quokka.location;

    tagsContainer.innerHTML = "";
    
    tagsContainer.appendChild(createTag(quokka.personality, "personality"));
    
    if (quokka.likes > 0) {
        tagsContainer.appendChild(createTag(`❤️ ${quokka.likes}`, "like"));
    }
    
    resetLoveBtn(loveBtn);
}

// 5. 진짜 DB에서 쿼카 검색 필터링 (Breeds)
export async function filterQuokkas() {
    const selectedPersonality = personalityFilter.value;
    searchResults.innerHTML = '<div style="text-align:center; padding: 2rem;">로딩 중...</div>';

    try {
        let query = _supabase.from('quokkas').select('*');

        if (selectedPersonality !== "all") {
            query = query.eq('personality', selectedPersonality);
        }

        const { data: filtered, error } = await query;
        if (error) throw error;

        searchResults.innerHTML = ""; 

        if (!filtered || filtered.length === 0) {
            searchResults.innerHTML = `<div style="text-align:center; padding: 2rem; color: #888;">검색 결과가 없습니다.</div>`;
            return;
        }

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

export async function toggleLove() {
  if (!currentQuokka) return; 

  const icon = loveBtn.querySelector("i");
  const isLoved = icon.classList.contains("fa-solid");

  if (isLoved) {
    alert("이미 좋아요를 누르셨습니다! ❤️");
    return;
  }

  icon.classList.remove("fa-regular");
  icon.classList.add("fa-solid");
  loveBtn.style.color = "#ff6b6b"; 
  
  const newLikes = (currentQuokka.likes || 0) + 1;

  try {
      const { error } = await _supabase
        .from('quokkas')
        .update({ likes: newLikes })
        .eq('id', currentQuokka.id);

      if (error) throw error;

      currentQuokka.likes = newLikes;
      setState('currentQuokka', currentQuokka);
      
      updateLikeTag(newLikes);
      
      console.log("좋아요 반영 완료! 현재:", newLikes);

  } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 반영에 실패했습니다 ㅠㅠ");
      
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      loveBtn.style.color = "#aaa";
  }
}

function updateLikeTag(count) {
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
