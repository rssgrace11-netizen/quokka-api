import { _supabase } from './config.js';


import { currentQuokka, currentUser, quokkaList, currentIdx, setState } from './state.js'; 


import { createTag, resetLoveBtn } from './utils.js';


import { 


    quokkaImg, loadingSpinner, nameEl, locEl, tagsContainer, loveBtn, searchResults, personalityFilter, myQuokkaList


} from './dom.js';

import { showToast } from './ui.js';








export async function initQuokkas() {
  quokkaImg.style.opacity = 0;
  nameEl.style.opacity = 0.5;
  loadingSpinner.style.display = 'flex'; // API 호출 전 스피너 표시

  try {
      const { data, error } = await _supabase
        .from('quokkas')
        .select('*');

      if (error) throw error;
      
      // 배열 무작위로 섞기 (Shuffle)
      const shuffled = data.sort(() => Math.random() - 0.5);
      
      setState('quokkaList', shuffled);
      setState('currentIdx', 0);

      const quokka = shuffled[0];
      setState('currentQuokka', quokka); // 현재 쿼카 저장

      updateQuokkaUI(quokka);

  } catch (err) {
      console.error("데이터 가져오기 실패:", err);
      loadingSpinner.style.display = 'none'; // 에러 발생 시 스피너 숨김
      showToast("데이터를 불러오지 못했습니다.", "error");
  }
}

export function showNextQuokka() {
    if (!quokkaList || quokkaList.length === 0) return;
    
    quokkaImg.style.opacity = 0;
    loadingSpinner.style.display = 'flex';
    
    let nextIdx = currentIdx + 1;
    if (nextIdx >= quokkaList.length) nextIdx = 0; // 끝에 도달하면 처음으로
    
    setState('currentIdx', nextIdx);
    const quokka = quokkaList[nextIdx];
    setState('currentQuokka', quokka);
    updateQuokkaUI(quokka);
}

export function showPrevQuokka() {
    if (!quokkaList || quokkaList.length === 0) return;
    
    quokkaImg.style.opacity = 0;
    loadingSpinner.style.display = 'flex';
    
    let prevIdx = currentIdx - 1;
    if (prevIdx < 0) prevIdx = quokkaList.length - 1; // 처음에 도달하면 끝으로
    
    setState('currentIdx', prevIdx);
    const quokka = quokkaList[prevIdx];
    setState('currentQuokka', quokka);
    updateQuokkaUI(quokka);
}

function updateQuokkaUI(quokka) {
    // 이미지 로드가 "완전히" 끝났을 때 스피너를 숨기고 이미지를 보여줌
    quokkaImg.onload = () => {
        loadingSpinner.style.display = 'none';
        quokkaImg.style.opacity = 1;
    };
    quokkaImg.src = quokka.image_url;

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

// [좋아요 기능 수정]


export async function toggleLove() {


  if (!currentQuokka) return; 





  // 로그인이 안 되어 있다면? -> 로그인 유도


  if (!currentUser) {
      showToast("로그인해야 '나만의 쿼카'로 저장/취소 할 수 있어요! 🐹", "info");
      document.getElementById("login-modal").style.display = "flex";
      return;
  }





  const icon = loveBtn.querySelector("i");


  const isLoved = icon.classList.contains("fa-solid");





  if (isLoved) {
      // 1-1. 좋아요 취소(Unlike) 로직
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      loveBtn.style.color = "#aaa"; 

      const newLikes = Math.max(0, (currentQuokka.likes || 0) - 1);

      try {
          const { error: deleteError } = await _supabase
            .from('likes')
            .delete()
            .match({ user_id: currentUser.id, quokka_id: currentQuokka.id });

          if (deleteError) throw deleteError;

          const { error } = await _supabase
            .from('quokkas')
            .update({ likes: newLikes })
            .eq('id', currentQuokka.id);

          if (error) throw error;

          currentQuokka.likes = newLikes;
          setState('currentQuokka', currentQuokka);
          updateLikeTag(newLikes);
          showToast("내 도감에서 삭제되었습니다. �", "info");

      } catch (err) {
          console.error("좋아요 취소 실패:", err);
          showToast("취소하지 못했습니다 ㅠㅠ", "error");
          
          // UI 롤백
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          loveBtn.style.color = "#ff6b6b";
      }
      return;
  }





  // 1. UI 먼저 업데이트 (반응 속도 빠르게)


  icon.classList.remove("fa-regular");


  icon.classList.add("fa-solid");


  loveBtn.style.color = "#ff6b6b"; 


  


  const newLikes = (currentQuokka.likes || 0) + 1;





  try {


      // 2. 'likes' 테이블에 기록 (내 도감에 추가)


      const { error: likeError } = await _supabase


        .from('likes')


        .insert({ 


            user_id: currentUser.id, 


            quokka_id: currentQuokka.id 


        });





      if (likeError) {


          // 이미 추가된 경우 (중복 방지)


          if (likeError.code === '23505') { // Postgres Unique Violation Code
              showToast("이미 내 도감에 저장된 쿼카입니다! 📔", "error");
              return;
          }


          throw likeError;


      }





      // 3. 'quokkas' 테이블 숫자 업데이트


      const { error } = await _supabase


        .from('quokkas')


        .update({ likes: newLikes })


        .eq('id', currentQuokka.id);





      if (error) throw error;





      currentQuokka.likes = newLikes;


      setState('currentQuokka', currentQuokka);


      


      updateLikeTag(newLikes);


      


      showToast("내 도감에 저장 완료! ❤️", "success");





  } catch (err) {


      console.error("좋아요 실패:", err);


      showToast("저장하지 못했습니다 ㅠㅠ", "error");


      


      // 실패 시 UI 원상복구


      icon.classList.remove("fa-solid");


      icon.classList.add("fa-regular");


      loveBtn.style.color = "#aaa";


  }


}





// [내 쿼카 목록 불러오기]


export async function loadMyQuokkas() {


    if (!currentUser) {


        myQuokkaList.innerHTML = `


            <div style="text-align: center; color: #888; margin-top: 50px;">


                <i class="fa-solid fa-lock" style="font-size: 3rem; margin-bottom: 10px;"></i>


                <p>로그인이 필요한 기능입니다.</p>


            </div>`;


        return;


    }





    myQuokkaList.innerHTML = '<div style="text-align:center; padding: 2rem;">도감을 불러오는 중... 📖</div>';





    try {


        // 1. 내가 좋아요 누른 쿼카 ID들 가져오기


        // (Supabase의 관계형 쿼리 사용: likes 테이블을 거쳐서 quokkas 정보를 가져옴)


        const { data, error } = await _supabase


            .from('likes')


            .select(`


                created_at,


                quokkas (


                    id, name, image_url, personality, location, likes


                )


            `)


            .eq('user_id', currentUser.id)


            .order('created_at', { ascending: false }); // 최신순 정렬





        if (error) throw error;





        myQuokkaList.innerHTML = ""; // 초기화





        if (!data || data.length === 0) {


            myQuokkaList.innerHTML = `


                <div style="text-align: center; color: #888; margin-top: 50px;">


                    <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 10px;"></i>


                    <p>아직 찜한 쿼카가 없어요!<br>Voting 탭에서 하트를 눌러보세요 ❤️</p>


                </div>`;


            return;


        }





        // 2. 목록 렌더링


        data.forEach(item => {


            const quokka = item.quokkas; // Join된 데이터


            if (!quokka) return;





            const card = document.createElement("div");


            card.className = "my-quokka-card";


            card.style.cssText = "display: flex; align-items: center; gap: 1rem; padding: 15px; border: 1px solid #eee; border-radius: 12px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";





            card.innerHTML = `


                <img src="${quokka.image_url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">


                <div style="flex: 1;">


                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 4px;">${quokka.name}</div>


                    <div style="font-size: 0.85rem; color: #666;">


                        <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${quokka.personality}</span>


                        · ${quokka.location}


                    </div>


                </div>


                <div class="unlike-btn" data-id="${quokka.id}" data-likes="${quokka.likes}" style="text-align: center; color: #ff6b6b; cursor: pointer; transition: transform 0.2s;">
                    <i class="fa-solid fa-heart"></i>
                    <div style="font-size: 0.8rem; font-weight: bold;">${quokka.likes}</div>
                </div>
            `;


            myQuokkaList.appendChild(card);
        });

        // 3. 각 카드에 '좋아요 취소' 이벤트 리스너 연결
        const unlikeBtns = myQuokkaList.querySelectorAll('.unlike-btn');
        unlikeBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const quokkaId = btn.dataset.id;
                const likes = parseInt(btn.dataset.likes, 10);
                const newLikes = Math.max(0, likes - 1);

                const card = btn.closest('.my-quokka-card');
                card.style.opacity = 0.5;

                try {
                    const { error: deleteError } = await _supabase
                        .from('likes')
                        .delete()
                        .match({ user_id: currentUser.id, quokka_id: quokkaId });

                    if (deleteError) throw deleteError;

                    const { error } = await _supabase
                        .from('quokkas')
                        .update({ likes: newLikes })
                        .eq('id', quokkaId);

                    if (error) throw error;

                    card.remove();
                    showToast("도감에서 삭제되었습니다. 💔", "info");

                    // 현재 투표화면에 띄워져 있는 쿼카면 UI 동기화
                    if (currentQuokka && currentQuokka.id == quokkaId) {
                        currentQuokka.likes = newLikes;
                        setState('currentQuokka', currentQuokka);
                        updateLikeTag(newLikes);
                        const mainIcon = loveBtn.querySelector("i");
                        mainIcon.classList.remove("fa-solid");
                        mainIcon.classList.add("fa-regular");
                        loveBtn.style.color = "#aaa";
                    }

                    if (myQuokkaList.children.length === 0) {
                        myQuokkaList.innerHTML = `<div style="text-align: center; color: #888; margin-top: 50px;"><i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 10px;"></i><p>도감이 비었습니다!</p></div>`;
                    }

                } catch (err) {
                    console.error("좋아요 취소 에러:", err);
                    showToast("오류가 발생했습니다.", "error");
                    card.style.opacity = 1;
                }
            });
        });





    } catch (err) {


        console.error("내 도감 불러오기 실패:", err);


        myQuokkaList.innerHTML = `<div style="text-align:center; color: red;">오류가 발생했습니다.</div>`;


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


