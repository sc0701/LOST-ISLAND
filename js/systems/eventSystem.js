// js/systems/eventSystem.js
const EventSystem = {
    _pendingEvent: null,

    // 게임 시작 시(1일차 아침) 안내성 이벤트. 실제 이벤트 풀이 없다면 조용히 넘어갑니다.
    triggerDailyEvent() {
        // 필요하다면 여기서 인트로 메시지를 모달로 띄울 수 있습니다.
        // 지금은 별도 처리 없이 넘어갑니다.
    },

    // 가중치(weight) 기반으로 이벤트 풀에서 하나를 뽑습니다.
    pickEvent(locationType) {
        const pool = EventData[locationType];
        if (!pool || pool.length === 0) return null;

        const totalWeight = pool.reduce((sum, e) => sum + (e.weight || 1), 0);
        let roll = Math.random() * totalWeight;
        for (const ev of pool) {
            roll -= (ev.weight || 1);
            if (roll <= 0) return ev;
        }
        return pool[pool.length - 1];
    },

    // 탐색 행동에서 호출됨: 이벤트를 뽑아 모달로 보여줍니다.
    triggerLocationEvent(locationType) {
        const ev = this.pickEvent(locationType);
        if (!ev) return false;

        this._pendingEvent = ev;

        const choicesHtml = ev.choices.map((choice, idx) => {
            const label = choice.successRate
                ? `${choice.text} (성공확률 ${choice.successRate}%)`
                : choice.text;
            return `<button onclick="EventSystem.resolveChoice(${idx})">${label}</button>`;
        }).join("");

        UIController.showEventModal(ev.title, ev.description, choicesHtml);
        return true;
    },

    // 선택지를 골랐을 때 처리
    resolveChoice(choiceIndex) {
        const ev = this._pendingEvent;
        if (!ev) return;
        const choice = ev.choices[choiceIndex];

        let resultMsg = choice.msg || "";

        if (choice.combat) {
            const result = CombatSystem.fight(choice.rewards || []);
            resultMsg = result.msg;
        } else if (choice.successRate !== undefined) {
            const roll = Math.random() * 100;
            if (roll < choice.successRate) {
                this.applyEffects(choice.success);
                resultMsg = "✅ 성공! " + resultMsg;
            } else {
                this.applyEffects(choice.fail);
                resultMsg = "❌ 실패... " + resultMsg;
            }
        } else {
            this.applyEffects(choice.effects);
        }

        this._pendingEvent = null;
        UIController.hideEventModal();
        GameEngine.capStats();
        GameEngine.checkGameOver();
        UIController.updateStatus();
        UIController.renderActionButtons();

        if (resultMsg) UIController.toast(resultMsg);
    },

    // effects 객체({stats:{...}, items:{...}})를 GameState에 반영
    applyEffects(effects) {
        if (!effects) return;
        if (effects.stats) {
            for (const key in effects.stats) {
                if (GameState.stats[key] !== undefined) {
                    GameState.stats[key] += effects.stats[key];
                }
            }
        }
        if (effects.items) {
            for (const key in effects.items) {
                if (GameState.inventory[key] === undefined) GameState.inventory[key] = 0;
                GameState.inventory[key] += effects.items[key];
            }
        }
    }
};