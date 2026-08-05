const UIController = {
    // 🌟 화면의 숫자들과 이미지를 최신 상태로 새로고침하는 함수
    updateStatus() {
        // 날짜 갱신
        document.getElementById('day-display').innerText = `DAY ${GameState.day}`;
        
        // 스탯 갱신
        document.getElementById('stat-health').innerText = GameState.stats.health;
        document.getElementById('stat-hunger').innerText = GameState.stats.hunger;
        document.getElementById('stat-thirst').innerText = GameState.stats.thirst;
        document.getElementById('stat-sanity').innerText = GameState.stats.sanity;
        document.getElementById('stat-temp').innerText = GameState.stats.temp.toFixed(1);

        // 인벤토리 갱신
        document.getElementById('inv-food').innerText = GameState.inventory.food;
        document.getElementById('inv-water').innerText = GameState.inventory.water;
        document.getElementById('inv-wood').innerText = GameState.inventory.wood;
        
        // 남은 턴 수 표시
        const turnsLeft = GameState.maxActions - GameState.actionCount;
        document.getElementById('turn-left').innerText = turnsLeft;

        // 👇 추가된 부분: 상태에 맞춰 이미지 변경하기 호출
        this.updateVisuals();
    },

    // 🌟 상황에 맞춰 배경과 주인공 이미지를 바꿔주는 로직
    updateVisuals() {
        const bgImage = document.getElementById('bg-image');
        const playerImage = document.getElementById('player-image');
        if (!bgImage || !playerImage) return;

        // 1. 배경 이미지 변경 (지역에 따라 다르게)
        if (GameState.currentLocation === "숲") {
            bgImage.src = 'assets/bg/forest.png';
        } else {
            bgImage.src = 'assets/bg/beach_day.png'; // 기본은 해변
        }

        // 2. 주인공 이미지 변경 (체력이 30 이하이거나 배고픔/갈증이 바닥이면 다친 이미지로)
        if (GameState.stats.health <= 30 || GameState.stats.hunger <= 0 || GameState.stats.thirst <= 0) {
            playerImage.src = 'assets/characters/player_hurt.png';
        } else {
            playerImage.src = 'assets/characters/player_normal.png';
        }
    },

    // 🌟 이벤트 모달창 띄우기
    showEventModal(title, desc, choicesHtml) {
        document.getElementById('event-title').innerText = title;
        document.getElementById('event-desc').innerText = desc;
        document.getElementById('event-choices').innerHTML = choicesHtml;
        document.getElementById('event-modal').style.display = 'flex';
    },

    // 🌟 이벤트 모달창 닫기
    hideEventModal() {
        document.getElementById('event-modal').style.display = 'none';
    }
};