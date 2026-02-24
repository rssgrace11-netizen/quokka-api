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
