import { 
    newQuokkaBtn, loveBtn, personalityFilter, 
    tabVoting, tabBreeds, tabUpload, tabMypage, 
    uploadArea, fileInput, uploadBtn, previewImg, uploadIcon, uploadText
} from './modules/dom.js';

import { fetchRandomQuokka, filterQuokkas, toggleLove } from './modules/quokka.js';
import { handleUpload } from './modules/upload.js';
import { switchTab } from './modules/ui.js';
import { checkSession, initAuthEvents } from './modules/auth.js';

console.log("The Quokka API v5.0 (Modularized) Started...");

// 1. 이벤트 리스너 연결
newQuokkaBtn.addEventListener("click", fetchRandomQuokka);
loveBtn.addEventListener("click", toggleLove);
personalityFilter.addEventListener("change", filterQuokkas);

// 2. 탭 전환 이벤트
tabVoting.addEventListener("click", () => switchTab('voting'));
tabBreeds.addEventListener("click", () => switchTab('breeds'));
tabUpload.addEventListener("click", () => switchTab('upload'));
tabMypage.addEventListener("click", () => switchTab('mypage')); // My Page 연결 추가!

// 3. 업로드 관련 이벤트
uploadArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadText.textContent = `선택된 파일: ${file.name}`;
        
        // 이미지 미리보기 FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            uploadIcon.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else {
        uploadText.textContent = "클릭해서 쿼카 사진을 선택하세요!";
        previewImg.style.display = "none";
        previewImg.src = "";
        uploadIcon.style.display = "block";
    }
});

uploadBtn.addEventListener("click", handleUpload);

// 4. 인증 관련 이벤트 초기화 (로그인, 모달 등)
initAuthEvents();

// 5. 앱 시작!
checkSession();      // 로그인 상태 확인
fetchRandomQuokka(); // 첫 쿼카 불러오기
