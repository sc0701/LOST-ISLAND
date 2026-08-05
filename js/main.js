// js/main.js
window.onload = () => {
    console.log("Lost Island 게임 로드 완료!");
    
    // 1. 화면에 초기 스탯 세팅
    UIController.updateStatus();
    
    // 2. 1일 차 아침 이벤트 발생!
    EventSystem.triggerDailyEvent();
};