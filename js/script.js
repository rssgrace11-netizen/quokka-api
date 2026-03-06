import { 
    newQuokkaBtn, loveBtn, dlBtn, personalityFilter, 
    tabVoting, tabBreeds, tabUpload, tabMypage, 
    uploadArea, fileInput, uploadBtn, previewImg, uploadIcon, uploadText,
    prevBtn, nextBtn
} from './modules/dom.js';

import { initQuokkas, showNextQuokka, showPrevQuokka, filterQuokkas, toggleLove } from './modules/quokka.js';
import { handleUpload } from './modules/upload.js';
import { switchTab } from './modules/ui.js';
import { checkSession, initAuthEvents } from './modules/auth.js';
import { initI18n } from './modules/i18n.js';

console.log("The Quokka API v5.0 (Modularized) Started...");

// 0. 다국어 설정 초기화
initI18n();

// 1. 이벤트 리스너 연결
newQuokkaBtn.addEventListener("click", showNextQuokka);
prevBtn.addEventListener("click", showPrevQuokka);
nextBtn.addEventListener("click", showNextQuokka);
loveBtn.addEventListener("click", toggleLove);
personalityFilter.addEventListener("change", filterQuokkas);

// 다운로드 기능
dlBtn.addEventListener("click", async () => {
    const quokkaImg = document.getElementById("quokka-img");
    if (!quokkaImg || !quokkaImg.src) return;

    try {
        const response = await fetch(quokkaImg.src);
        const blob = await response.blob();
        
        // 원본 이미지를 위한 다운로드 링크 생성
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quokka_${Date.now()}.jpg`; // 다운로드 파일명 지정
        document.body.appendChild(a);
        a.click();
        
        // 정리
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        import('./modules/ui.js').then(({ showToast }) => {
            showToast("원본 사진이 다운로드되었습니다! 📥", "success");
        });
    } catch (err) {
        console.error("다운로드 에러:", err);
        import('./modules/ui.js').then(({ showToast }) => {
            showToast("다운로드에 실패했습니다.", "error");
        });
    }
});

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
initQuokkas();       // 첫 쿼카 목록 불러오기
