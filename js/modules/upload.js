import { _supabase } from './config.js';
import { 
    fileInput, uploadName, uploadPersonality, uploadBtn, uploadStatus, uploadArea
} from './dom.js';
import { fetchRandomQuokka } from './quokka.js';
import { switchTab } from './ui.js'; // UI 모듈은 아직 안 만들었지만 곧 만들 겁니다.

// 8. 이미지 업로드 처리
export async function handleUpload() {
    const file = fileInput.files[0];
    const name = uploadName.value;
    const personality = uploadPersonality.value;

    if (!file || !name) {
        alert("사진과 이름을 모두 입력해주세요!");
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = "UPLOADING...";
    uploadStatus.textContent = "이미지를 업로드 중입니다...";

    try {
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('quokka_images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = _supabase.storage
            .from('quokka_images')
            .getPublicUrl(fileName);

        const { error: dbError } = await _supabase
            .from('quokkas')
            .insert({
                name: name,
                personality: personality,
                image_url: publicUrl,
                location: 'User Uploaded', 
                likes: 0
            });

        if (dbError) throw dbError;

        alert("쿼카 등록 성공! 🎉");
        uploadStatus.textContent = "업로드 완료!";
        
        fileInput.value = "";
        uploadName.value = "";
        uploadArea.querySelector("p").textContent = "클릭해서 쿼카 사진을 선택하세요!";
        
        switchTab('voting');
        fetchRandomQuokka(); 

    } catch (err) {
        console.error("업로드 실패:", err);
        alert("업로드 중 오류가 발생했습니다 ㅠㅠ");
        uploadStatus.textContent = "오류 발생";
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "UPLOAD QUOKKA";
    }
}
