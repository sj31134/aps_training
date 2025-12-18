/**
 * Project1 - 간단한 버튼 앱 JavaScript
 * Google JavaScript Style Guide 준수
 */

// 전역 변수 선언
let clickCount = 0;

/**
 * 버튼 클릭 이벤트 핸들러
 */
function handleButtonClick() {
    console.log('버튼이 클릭되었습니다.');

    try {
        clickCount++;
        console.log(`클릭 횟수: ${clickCount}`);

        // 버튼 요소 가져오기
        const button = document.getElementById('myButton');

        if (!button) {
            console.error('버튼 요소를 찾을 수 없습니다.');
            return;
        }

        // 클릭 효과 추가
        button.classList.add('clicked');
        console.log('버튼 클릭 효과가 적용되었습니다.');

        // 3초 후 효과 제거
        setTimeout(() => {
            button.classList.remove('clicked');
            console.log('버튼 클릭 효과가 제거되었습니다.');
        }, 3000);

        // 클릭 횟수가 5번 이상이면 경고
        if (clickCount >= 5) {
            console.warn(`경고: 버튼이 ${clickCount}번 클릭되었습니다.`);
        }

    } catch (error) {
        console.error('버튼 클릭 처리 중 오류 발생:', error);
    }
}

/**
 * DOM 로드 완료 시 이벤트 리스너 등록
 */
function initializeApp() {
    console.log('Project1 앱이 초기화됩니다.');

    try {
        const button = document.getElementById('myButton');

        if (button) {
            button.addEventListener('click', handleButtonClick);
            console.log('버튼 클릭 이벤트 리스너가 등록되었습니다.');
        } else {
            console.error('초기화 실패: 버튼 요소를 찾을 수 없습니다.');
        }

    } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error);
    }
}

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', initializeApp);
