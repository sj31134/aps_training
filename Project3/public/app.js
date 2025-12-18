/**
 * Project3 - 프론트엔드 JavaScript
 * Google JavaScript Style Guide 준수
 */

// 전역 변수 선언
const API_ENDPOINT = '/api/message';

/**
 * 백엔드 API에서 크리스마스 메시지 가져오기
 * @return {Promise<Object>} 메시지 데이터
 */
async function fetchChristmasMessage() {
  try {
    console.log('백엔드 API 호출 시작:', API_ENDPOINT);

    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const data = await response.json();
    console.log('백엔드 API 응답 받음:', data);

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error('응답 데이터 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 메시지를 화면에 표시 (모던한 디자인)
 * @param {string} message - 표시할 메시지
 * @param {string} emoji - 이모지
 * @param {string} timestamp - 타임스탬프 (선택사항)
 */
function displayMessage(message, emoji, timestamp) {
  try {
    console.log('메시지 표시:', message);

    const messageContainer = document.getElementById('messageContainer');

    if (!messageContainer) {
      console.error('메시지 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    // 기존 내용 제거
    messageContainer.innerHTML = '';

    // 모던한 메시지 카드 생성
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';

    // 이모지 컨테이너
    const emojiContainer = document.createElement('div');
    emojiContainer.className = 'message-emoji';
    emojiContainer.textContent = emoji;

    // 메시지 텍스트 컨테이너
    const textContainer = document.createElement('div');
    textContainer.className = 'message-text';
    textContainer.textContent = message;

    // 타임스탬프 (있는 경우)
    if (timestamp) {
      const timeElement = document.createElement('div');
      timeElement.className = 'message-time';
      const date = new Date(timestamp);
      timeElement.textContent = date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      messageCard.appendChild(timeElement);
    }

    // 요소 조립
    messageCard.appendChild(emojiContainer);
    messageCard.appendChild(textContainer);

    messageContainer.appendChild(messageCard);

    console.log('메시지 표시 완료');
  } catch (error) {
    console.error('메시지 표시 중 오류 발생:', error);
  }
}

/**
 * 에러 메시지 표시 (모던한 디자인)
 * @param {string} errorMessage - 에러 메시지
 */
function displayError(errorMessage) {
  try {
    console.error('에러 메시지 표시:', errorMessage);

    const messageContainer = document.getElementById('messageContainer');

    if (!messageContainer) {
      console.error('메시지 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    const errorCard = document.createElement('div');
    errorCard.className = 'error-card';

    const errorIcon = document.createElement('div');
    errorIcon.className = 'error-icon';
    errorIcon.textContent = '⚠️';

    const errorText = document.createElement('div');
    errorText.className = 'error-text';
    errorText.textContent = `오류: ${errorMessage}`;

    errorCard.appendChild(errorIcon);
    errorCard.appendChild(errorText);

    messageContainer.innerHTML = '';
    messageContainer.appendChild(errorCard);
  } catch (error) {
    console.error('에러 메시지 표시 중 오류 발생:', error);
  }
}

/**
 * 로딩 상태 표시 (모던한 디자인)
 */
function displayLoading() {
  try {
    const messageContainer = document.getElementById('messageContainer');

    if (!messageContainer) {
      console.error('메시지 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    const loadingCard = document.createElement('div');
    loadingCard.className = 'loading-card';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = '메시지를 가져오는 중...';

    loadingCard.appendChild(spinner);
    loadingCard.appendChild(loadingText);

    messageContainer.innerHTML = '';
    messageContainer.appendChild(loadingCard);
  } catch (error) {
    console.error('로딩 상태 표시 중 오류 발생:', error);
  }
}

/**
 * 버튼 클릭 이벤트 핸들러
 */
async function handleButtonClick() {
  try {
    console.log('버튼 클릭 이벤트 발생');

    const button = document.getElementById('messageButton');

    if (!button) {
      console.error('버튼 요소를 찾을 수 없습니다.');
      return;
    }

    // 버튼 비활성화
    button.disabled = true;
    button.textContent = '⏳ 로딩 중...';

    // 로딩 상태 표시
    displayLoading();

    // 백엔드 API 호출
    const messageData = await fetchChristmasMessage();

    // 메시지 표시 (타임스탬프 포함)
    displayMessage(
        messageData.message,
        messageData.emoji,
        messageData.timestamp
    );

    // 버튼 다시 활성화
    button.disabled = false;
    button.textContent = '🎁 메시지 받기 🎁';

    console.log('버튼 클릭 처리 완료');
  } catch (error) {
    console.error('버튼 클릭 처리 중 오류 발생:', error);

    // 에러 메시지 표시
    displayError(error.message || '메시지를 가져오는 중 오류가 발생했습니다.');

    // 버튼 다시 활성화
    const button = document.getElementById('messageButton');
    if (button) {
      button.disabled = false;
      button.textContent = '🎁 메시지 받기 🎁';
    }
  }
}

/**
 * DOM 로드 완료 시 이벤트 리스너 등록
 */
function initializeApp() {
  console.log('Project3 앱이 초기화됩니다.');

  try {
    const button = document.getElementById('messageButton');

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

