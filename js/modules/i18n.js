export const translations = {
    en: {
        // Navigation
        'nav.pricing': 'PRICING',
        'nav.business': 'BUSINESS',
        'nav.docs': 'DOCUMENTATION',
        'nav.quokkas': 'QUOKKAS',
        'nav.account': 'ACCOUNT',
        
        // Hero Section
        'hero.tagline': 'Because everyday is a Quokkadat.',
        'hero.title.base': 'The Quokka API<br><span class="highlight">Quokkas</span> as a service.',
        'hero.subdesc': 'An API all about Quokka.<br>10k+ Images. Breeds. Facts.',
        'hero.btn.key': 'GET YOUR API KEY',
        'hero.btn.guides': 'READ OUR GUIDES',
        
        // Tabs
        'tab.voting': 'Voting',
        'tab.breeds': 'Breeds',
        'tab.upload': 'Upload',
        'tab.mypage': 'My Page',
        
        // Voting Section
        'vote.quokka.name': 'Happy Quokka',
        'vote.quokka.loc': 'Rottnest Island',
        'vote.quokka.tag': 'Cheerful',
        
        // Breeds Section
        'breeds.title': 'Search Quokkas',
        'breeds.filter.all': 'View All Personalities',
        'breeds.filter.cheerful': 'Cheerful',
        'breeds.filter.glutton': 'Glutton',
        'breeds.filter.curious': 'Curiosity King',
        'breeds.empty': 'Select a personality to find quokkas!',
        
        // Upload Section
        'upload.title': 'Upload a Quokka',
        'upload.desc': 'Click to select Quokka photo!',
        'upload.label.name': 'Name',
        'upload.input.name': 'e.g., Cutie',
        'upload.label.personality': 'Personality',
        'upload.btn': 'UPLOAD QUOKKA',
        
        // My Page Section
        'mypage.title': 'My Collection 📔',
        'mypage.empty': 'Log in and click "Like" to collect!'
    },
    ko: {
        // Navigation
        'nav.pricing': '요금 안내',
        'nav.business': '기업용 안내',
        'nav.docs': '개발자 문서',
        'nav.quokkas': '쿼카 소개',
        'nav.account': '내 계정',
        
        // Hero Section
        'hero.tagline': '매일매일이 귀여운 쿼카 데이.',
        'hero.title.base': 'The Quokka API<br><span style="white-space: nowrap;"><span class="highlight">쿼카</span>를 서비스로 만나다.</span>',
        'hero.subdesc': '쿼카에 대한 모든 API 서비스.<br>1만장 이상의 고화질 이미지와 정보를 제공합니다.',
        'hero.btn.key': 'API 키 발급받기',
        'hero.btn.guides': '사용 가이드 읽기',
        
        // Tabs
        'tab.voting': '투표하기',
        'tab.breeds': '성격 탐색',
        'tab.upload': '사진 업로드',
        'tab.mypage': '나의 쿼카',
        
        // Voting Section
        'vote.quokka.name': '행복한 쿼카',
        'vote.quokka.loc': '로트네스트 섬',
        'vote.quokka.tag': '명랑함',
        
        // Breeds Section
        'breeds.title': '쿼카 검색하기',
        'breeds.filter.all': '모든 성격 보기',
        'breeds.filter.cheerful': '명랑함',
        'breeds.filter.glutton': '먹보',
        'breeds.filter.curious': '호기심 대장',
        'breeds.empty': '성격을 선택하여 쿼카를 찾아보세요!',
        
        // Upload Section
        'upload.title': '나만의 쿼카 등록하기',
        'upload.desc': '클릭해서 쿼카 사진을 선택하세요!',
        'upload.label.name': '이름 (Name)',
        'upload.input.name': '예: 귀염둥이',
        'upload.label.personality': '성격 (Personality)',
        'upload.btn': '사진 올리기',
        
        // My Page Section
        'mypage.title': '내 쿼카 모음 📔',
        'mypage.empty': '로그인 후 좋아요를 눌러보세요!'
    }
};

let currentLang = localStorage.getItem('appLang') || 'en';

export function initI18n() {
    const langSelector = document.querySelector('.lang-selector span');
    
    // Set initial UI state
    applyTranslations(currentLang);
    if (langSelector) {
        langSelector.textContent = currentLang.toUpperCase();
    }
    
    // Bind toggle click event
    const langSelectorContainer = document.querySelector('.lang-selector');
    if (langSelectorContainer) {
        langSelectorContainer.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ko' : 'en';
            localStorage.setItem('appLang', currentLang);
            
            // Update UI selector text
            langSelector.textContent = currentLang.toUpperCase();
            
            // Apply translations to DOM
            applyTranslations(currentLang);
            updateSelectPlaceholders(currentLang);
        });
    }
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    const dict = translations[lang];
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            // Handle placeholders differently
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = dict[key];
            } else {
                el.innerHTML = dict[key]; // Allow HTML parsing for things like hero title
            }
        }
    });
}

function updateSelectPlaceholders(lang) {
    const dict = translations[lang];
    // Update specific options safely without redefining whole selects
    const pFilter = document.getElementById('personality-filter');
    if(pFilter) {
        pFilter.options[0].text = dict['breeds.filter.all'];
        pFilter.options[1].text = dict['breeds.filter.cheerful'];
        pFilter.options[2].text = dict['breeds.filter.glutton'];
        pFilter.options[3].text = dict['breeds.filter.curious'];
    }
    
    const uFilter = document.getElementById('upload-personality');
    if(uFilter) {
        uFilter.options[0].text = dict['breeds.filter.cheerful'];
        uFilter.options[1].text = dict['breeds.filter.glutton'];
        uFilter.options[2].text = dict['breeds.filter.curious'];
    }
}
