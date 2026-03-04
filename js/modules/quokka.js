import { _supabase } from './config.js';


import { currentQuokka, currentUser, setState } from './state.js'; // currentUser 추가


import { createTag, resetLoveBtn } from './utils.js';


import { 


    quokkaImg, loadingSpinner, nameEl, locEl, tagsContainer, loveBtn, searchResults, personalityFilter, myQuokkaList


} from './dom.js';











export async function fetchRandomQuokka() {
  quokkaImg.style.opacity = 0;
  nameEl.style.opacity = 0.5;
  loadingSpinner.style.display = 'flex'; // API 호출 전 스피너 표시

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
      loadingSpinner.style.display = 'none'; // 에러 발생 시 스피너 숨김
  }
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


      alert("로그인해야 '나만의 쿼카'로 저장할 수 있어요! 🐹");


      document.getElementById("login-modal").style.display = "flex";


      return;


  }





  const icon = loveBtn.querySelector("i");


  const isLoved = icon.classList.contains("fa-solid");





  if (isLoved) {


    alert("이미 내 컬렉션에 추가된 쿼카입니다! 📔");


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


              alert("이미 저장된 쿼카입니다!");


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


      


      console.log("내 도감에 저장 완료! ❤️");





  } catch (err) {


      console.error("좋아요 실패:", err);


      alert("저장하지 못했습니다 ㅠㅠ");


      


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


                <div style="text-align: center; color: #ff6b6b;">


                    <i class="fa-solid fa-heart"></i>


                    <div style="font-size: 0.8rem; font-weight: bold;">${quokka.likes}</div>


                </div>


            `;


            myQuokkaList.appendChild(card);


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


