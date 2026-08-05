const GameEngine = {
    // 🌟 1. 버튼을 눌렀을 때 실행되는 핵심 행동 로직
    performAction(actionName) {
        // 어떤 행동을 했는지에 따라 스탯과 자원 변경
        if (actionName === '식량 구하기') {
            GameState.inventory.food += 2;
            GameState.stats.health -= 5;
            GameState.stats.thirst -= 5;
        } 
        else if (actionName === '물 찾기') {
            GameState.inventory.water += 2;
            GameState.stats.health -= 5;
            GameState.stats.hunger -= 5;
        } 
        else if (actionName === '휴식') {
            GameState.stats.health += 15;
            GameState.stats.sanity += 10;
            GameState.stats.hunger -= 10;
            GameState.stats.thirst -= 10;
        }

        // 체력 등 스탯이 100을 넘지 않도록 묶어두기
        this.capStats();

        // 턴(시간) 경과
        GameState.actionCount++;
        
        // 하루가 끝났는지(2번 다 행동했는지) 체크
        if (GameState.actionCount >= GameState.maxActions) {
            this.processNight();
        } else {
            // 아직 낮이라면 화면만 갱신
            UIController.updateStatus();
        }
    },

    // 🌟 2. 스탯 최대치(100) 고정 함수
    capStats() {
        for (let key in GameState.stats) {
            if (key !== 'temp' && GameState.stats[key] > 100) {
                GameState.stats[key] = 100;
            }
        }
    },

    // 🌟 3. 밤이 되어 스탯이 깎이고 다음 날로 넘어가는 로직
    processNight() {
        // 캠프 레벨에 따라 밤사이 체온 감소량 조절
        const tempDrop = GameState.campLevel === 0 ? 1.5 : 0.5;
        
        // 하룻밤 지날 때마다 기본 스탯 깎임
        GameState.stats.hunger -= 15;
        GameState.stats.thirst -= 20;
        GameState.stats.temp -= tempDrop;
        GameState.stats.sanity -= 5;
        
        // 사망 조건 체크 (하나라도 바닥나면 게임 오버)
        if (GameState.stats.health <= 0 || GameState.stats.hunger <= 0 || GameState.stats.thirst <= 0 || GameState.stats.temp <= 30) {
            // 엔딩 화면에 '사망'했다는 정보를 넘겨줌
            localStorage.setItem("endReason", "사망"); 
            window.location.href = 'ending.html';
            return;
        }

        // 다음 날 준비
        GameState.day++;
        GameState.actionCount = 0;
        
        // 30일 생존 성공 체크!
        if (GameState.day > 30) {
            // 엔딩 화면에 '구조'되었다는 정보를 넘겨줌
            localStorage.setItem("endReason", "구조"); 
            window.location.href = 'ending.html';
            return;
        }

        // 밤 배경으로 변경하는 연출을 넣거나 알림을 띄우고 다음 날 아침 이벤트 발생
        UIController.updateStatus();
        EventSystem.triggerDailyEvent();
    }
};