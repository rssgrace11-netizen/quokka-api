import { 
    newQuokkaBtn, loveBtn, personalityFilter, tabVoting, tabBreeds, tabUpload, 
    uploadArea, fileInput, uploadBtn 
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

// 3. 업로드 관련 이벤트
uploadArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        uploadArea.querySelector("p").textContent = `선택된 파일: ${e.target.files[0].name}`;
    }
});

uploadBtn.addEventListener("click", handleUpload);

// 4. 인증 관련 이벤트 초기화 (로그인, 모달 등)
initAuthEvents();

// 5. 앱 시작!
checkSession();      // 로그인 상태 확인
fetchRandomQuokka(); // 첫 쿼카 불러오기
