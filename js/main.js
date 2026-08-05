// js/main.js
window.onload = () => {
    console.log("Lost Island 게임 로드 완료!");

    UIController.updateStatus();
    UIController.renderActionButtons();
    EventSystem.triggerDailyEvent();
};
