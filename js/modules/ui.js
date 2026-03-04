import { 
    voteSection, breedsSection, uploadSection, mypageSection,
    tabVoting, tabBreeds, tabUpload, tabMypage 
} from './dom.js';
import { filterQuokkas, loadMyQuokkas } from './quokka.js';

// 3. 탭 전환 기능
export function switchTab(tabName) {
    // 모든 탭 비활성화
    voteSection.style.display = 'none';
    breedsSection.style.display = 'none';
    uploadSection.style.display = 'none';
    mypageSection.style.display = 'none';
    
    tabVoting.classList.remove('active');
    tabBreeds.classList.remove('active');
    tabUpload.classList.remove('active');
    tabMypage.classList.remove('active');

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
    } else if (tabName === 'mypage') {
        mypageSection.style.display = 'block';
        tabMypage.classList.add('active');
        loadMyQuokkas(); // 내 쿼카 목록 불러오기 (곧 만들 예정)
    }
}

// 4. Toast 알림 띄우기
export function showToast(message, type = 'info') {
    import('./dom.js').then(({ toastContainer }) => {
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = `toast-msg ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // 3초 후 자동 제거
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 3000);
    });
}
