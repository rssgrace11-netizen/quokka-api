import { _supabase } from './config.js';
import { currentUser, setState } from './state.js';
import { 
    accountLink, loginModal, loginEmail, loginPassword, btnSignIn, btnSignUp, btnCloseModal,
    logoutModal, btnConfirmLogout, btnCancelLogout
} from './dom.js';

// 모달 열기/닫기
export const initAuthEvents = () => {
    accountLink.addEventListener("click", async (e) => {
        e.preventDefault(); 
        console.log("ACCOUNT/LOGOUT 클릭됨!");

        if (currentUser) {
            logoutModal.style.display = "flex";
            logoutModal.style.zIndex = "99999";
            return;
        }

        loginModal.style.display = "flex";
        loginModal.style.zIndex = "99999";
    });

    btnCloseModal.addEventListener("click", () => {
        loginModal.style.display = "none";
        const msgEl = document.getElementById("auth-message");
        if (msgEl) msgEl.textContent = "";
    });

    // 로그아웃 모달 이벤트
    btnCancelLogout.addEventListener("click", () => {
        logoutModal.style.display = "none";
    });

    btnConfirmLogout.addEventListener("click", async () => {
        logoutModal.style.display = "none";
        await handleSignOut();
    });

    btnSignUp.addEventListener("click", handleSignUp);
    btnSignIn.addEventListener("click", handleSignIn);
    
    // 모바일 로그인 버튼도 있으면 연결
    const mobileLoginBtn = document.getElementById("mobile-login-btn");
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener("click", async () => {
            if (currentUser) {
                logoutModal.style.display = "flex";
                logoutModal.style.zIndex = "99999";
                return;
            }
            loginModal.style.display = "flex";
            loginModal.style.zIndex = "99999";
        });
    }
};

// UI 업데이트 (로그인 상태에 따라 메뉴 이름 변경)
export function updateAccountUI() {
    if (currentUser) {
        accountLink.textContent = "LOGOUT (" + currentUser.email.split('@')[0] + ")";
        accountLink.style.color = "#ff6b6b"; 
    } else {
        accountLink.textContent = "ACCOUNT";
        accountLink.style.color = ""; 
    }
}

// 회원가입 처리
async function handleSignUp() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    const msgEl = document.getElementById("auth-message");

    if (!email || !password) {
        if (msgEl) { msgEl.style.color = "#ff6b6b"; msgEl.textContent = "이메일과 비밀번호를 입력해주세요."; }
        return;
    }

    try {
        if (msgEl) { msgEl.style.color = "#666"; msgEl.textContent = "가입 중..."; }
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        if (msgEl) { msgEl.style.color = "#4caf50"; msgEl.textContent = "회원가입 성공! 🎉 이제 로그인 버튼을 눌러주세요."; }
        
    } catch (err) {
        console.error("회원가입 에러:", err);
        if (msgEl) { msgEl.style.color = "#ff6b6b"; msgEl.textContent = "가입 실패: " + (err.message === "User already registered" ? "이미 가입된 이메일입니다." : err.message); }
    }
}

// 로그인 처리
async function handleSignIn() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    const msgEl = document.getElementById("auth-message");

    if (!email || !password) {
        if (msgEl) { msgEl.style.color = "#ff6b6b"; msgEl.textContent = "이메일과 비밀번호를 입력해주세요."; }
        return;
    }

    try {
        if (msgEl) { msgEl.style.color = "#666"; msgEl.textContent = "로그인 중..."; }
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // 로그인 성공 시
        setState('currentUser', data.user);
        updateAccountUI(); 
        loginModal.style.display = "none"; 
        
        if (msgEl) msgEl.textContent = "";
        loginEmail.value = "";
        loginPassword.value = "";

    } catch (err) {
        console.error("로그인 에러:", err);
        if (msgEl) { msgEl.style.color = "#ff6b6b"; msgEl.textContent = "로그인 실패: 이메일이나 비밀번호를 확인해주세요."; }
    }
}

// 로그아웃 처리
async function handleSignOut() {
    try {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;

        setState('currentUser', null);
        updateAccountUI();
        alert("로그아웃 되었습니다.");

    } catch (err) {
        console.error("로그아웃 에러:", err);
    }
}

// 페이지 로드 시 로그인 상태 체크 (자동 로그인)
export async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        setState('currentUser', session.user);
        updateAccountUI();
    }
}
