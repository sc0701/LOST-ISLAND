// js/game.js
// ------------------------------------------------------------------
// 게임의 핵심 로직을 담당하는 GameEngine.
// - 시간(하루 24시간)과 체온 시스템
// - 지도 이동
// - 지역별 행동(탐색/사냥/자원캐기/휴식/요리)
// - 승리/패배 판정
// ------------------------------------------------------------------

const NIGHT_START = 19; // 19시부터
const NIGHT_END = 6;    // 6시 이전까지가 밤

// 행동별 소요 시간(시간)과 스태미나 소모량
const ActionCost = {
    "탐색하기": { time: 2, stamina: 10 },
    "사냥하기": { time: 4, stamina: 25 },
    "자원캐기": { time: 3, stamina: 20 },
    "휴식":     { time: 4, stamina: 0 },
    "요리":     { time: 1, stamina: 5 }
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function itemName(id) {
    const base = id.startsWith("cooked_") ? id.replace("cooked_", "") : id;
    const prefix = id.startsWith("cooked_") ? "구운 " : "";
    if (FoodData[base]) return prefix + FoodData[base].name;
    if (ResourceInfo[base]) return ResourceInfo[base].name;
    return id;
}

const GameEngine = {
    // ---------------- 시간 & 체온 ----------------
    passTime(hours) {
        for (let i = 0; i < hours; i++) {
            GameState.hour += 1;

            const isNight = GameState.hour >= NIGHT_START || GameState.hour < NIGHT_END;
            if (isNight) {
                // 밤에만 체온이 떨어집니다. 모닥불 옆(거점)이면 훨씬 덜 떨어집니다.
                let dropRate = 0.4;
                if (GameState.currentLocation === "거점" && GameState.campFacilities.campfire) {
                    dropRate = 0.1;
                } else if (GameState.campLevel >= 1) {
                    dropRate = 0.3;
                }
                GameState.stats.temp -= dropRate;
            } else {
                // 낮에는 체온이 떨어지지 않고, 오히려 정상 체온으로 서서히 회복됩니다.
                if (GameState.stats.temp < GameState.stats.normalTemp) {
                    GameState.stats.temp = Math.min(
                        GameState.stats.normalTemp,
                        GameState.stats.temp + 0.15
                    );
                }
            }

            if (GameState.hour >= 24) {
                GameState.hour -= 24;
                this.processNight();
                if (GameState.gameOver) return;
            }
        }
    },

    // 자정에 실행되는 하루 정산
    processNight() {
        GameState.day += 1;
        GameState.stats.hunger -= 15;
        GameState.stats.thirst -= 20;
        GameState.stats.sanity -= 3;

        if (GameState.stats.hunger <= 0) GameState.stats.health -= 10;
        if (GameState.stats.thirst <= 0) GameState.stats.health -= 15;
        if (GameState.stats.temp < 30) GameState.stats.health -= 10;

        this.processWeather();
        this.capStats();
        this.checkGameOver();

        if (!GameState.gameOver && GameState.day > GameState.maxDay) {
            this.endGame(true, "30일 동안 버텨낸 끝에, 수평선 너머로 구조선이 나타났다.");
        }
    },

    // 기상 이변 시작/지속/종료 처리
    processWeather() {
        if (GameState.activeWeather) {
            const w = WeatherData[GameState.activeWeather.type];
            const mitigated = isCampFortified();
            w.nightlyEffect(mitigated);
            GameState.activeWeather.daysLeft -= 1;
            if (GameState.activeWeather.daysLeft <= 0) {
                UIController.toast(w.endMsg);
                GameState.activeWeather = null;
            } else if (mitigated) {
                UIController.toast(`🏠 튼튼한 쉼터 덕분에 ${w.name}의 피해를 줄였다.`);
            }
        } else if (Math.random() < 0.13) {
            const keys = Object.keys(WeatherData);
            const totalWeight = keys.reduce((s, k) => s + WeatherData[k].weight, 0);
            let roll = Math.random() * totalWeight;
            let picked = keys[0];
            for (const k of keys) {
                roll -= WeatherData[k].weight;
                if (roll <= 0) { picked = k; break; }
            }
            const w = WeatherData[picked];
            const days = randInt(w.minDays, w.maxDays);
            GameState.activeWeather = { type: picked, daysLeft: days };
            UIController.toast(w.startMsg);
        }
    },

    // ---------------- 이동 ----------------
    moveTo(locationName) {
        if (GameState.gameOver) return;
        GameState.currentLocation = locationName;
        UIController.toast(`📍 ${LocationData[locationName].label}(으)로 이동했다.`);
        UIController.updateStatus();
        UIController.renderActionButtons();
        UIController.renderMap();
    },

    // ---------------- 행동 ----------------
    performAction(actionType) {
        if (GameState.gameOver) return;

        const loc = GameState.currentLocation;
        const locInfo = LocationData[loc];
        const cost = ActionCost[actionType];
        if (!cost) return;

        if (actionType === "요리" && !GameState.campFacilities.campfire) {
            UIController.toast("🔥 모닥불이 없어 요리를 할 수 없습니다. 먼저 모닥불을 만드세요.");
            return;
        }
        if (GameState.stats.stamina < cost.stamina) {
            UIController.toast("😮‍💨 스태미나가 부족하여 행동할 수 없습니다!");
            return;
        }

        GameState.stats.stamina -= cost.stamina;
        this.passTime(cost.time);
        if (GameState.gameOver) return;

        switch (actionType) {
            case "휴식":     this.doRest(locInfo); break;
            case "요리":     UIController.renderCookMenu(); break;
            case "탐색하기": this.doExplore(locInfo); break;
            case "사냥하기": this.doHunt(locInfo); break;
            case "자원캐기": this.doGather(locInfo); break;
        }

        this.capStats();
        this.checkGameOver();
        UIController.updateStatus();
        UIController.renderActionButtons();
    },

    doRest(locInfo) {
        GameState.stats.health += 10;
        GameState.stats.stamina += 40;
        if (locInfo.type === "camp" && GameState.campFacilities.campfire) {
            GameState.stats.temp += 1.5;
            UIController.toast("🔥🛌 모닥불 옆에서 몸을 녹이며 휴식을 취했다.");
        } else if (locInfo.type === "camp") {
            GameState.stats.temp += 0.5;
            UIController.toast("🛌 거점에서 휴식을 취해 체력을 회복했다.");
        } else {
            UIController.toast("🛌 잠시 앉아 쉬며 체력을 회복했다.");
        }
    },

    doExplore(locInfo) {
        // 60% 확률로 이야기 이벤트, 나머지는 잡화 획득 시도
        if (Math.random() < 0.6) {
            const triggered = EventSystem.triggerLocationEvent(locInfo.type);
            if (triggered) return;
        }
        const table = ExploreFindTable[locInfo.type] || [];
        const found = [];
        table.forEach(entry => {
            if (Math.random() < entry.chance) {
                const amt = randInt(entry.min, entry.max);
                GameState.inventory[entry.id] = (GameState.inventory[entry.id] || 0) + amt;
                found.push(`${itemName(entry.id)} x${amt}`);
            }
        });
        UIController.toast(found.length
            ? `🔍 탐색 결과: ${found.join(", ")} 획득!`
            : "🔍 별다른 것을 찾지 못했다.");
    },

    doHunt(locInfo) {
        const table = HuntTable[locInfo.type] || [];
        const bonus = GameState.tools.stone_spear ? 0.15 : 0;
        const results = [];
        table.forEach(entry => {
            let chance = entry.chance + bonus;
            if (entry.id === "fish" && GameState.tools.fishing_rod) chance += 0.25;
            if (Math.random() < chance) {
                GameState.inventory[entry.id] = (GameState.inventory[entry.id] || 0) + 1;
                results.push(itemName(entry.id));
            }
        });
        UIController.toast(results.length
            ? `🏹 사냥 성공! ${results.join(", ")} 획득!`
            : "🏹 사냥에 나섰지만 아무것도 잡지 못했다...");
    },

    doGather(locInfo) {
        const table = GatherTable[locInfo.type] || [];
        const bonus = GameState.tools.stone_axe ? 0.15 : 0;
        const results = [];
        table.forEach(entry => {
            if (Math.random() < entry.chance + bonus) {
                const amt = randInt(entry.min, entry.max);
                GameState.inventory[entry.id] = (GameState.inventory[entry.id] || 0) + amt;
                results.push(`${itemName(entry.id)} x${amt}`);
            }
        });
        UIController.toast(results.length
            ? `⛏️ 자원 채집 성공: ${results.join(", ")}`
            : "⛏️ 채집했지만 쓸만한 것이 없었다.");
    },

    // ---------------- 요리 & 식사 ----------------
    cookFood(foodId) {
        const data = FoodData[foodId];
        if (!data || !data.needsCook) {
            UIController.toast("조리가 필요 없는 재료입니다.");
            return;
        }
        if ((GameState.inventory[foodId] || 0) < 1) {
            UIController.toast("재료가 부족합니다.");
            return;
        }
        if ((GameState.inventory.branch || 0) < 1) {
            UIController.toast("🪵 장작(연료)이 부족합니다.");
            return;
        }
        GameState.inventory[foodId] -= 1;
        GameState.inventory.branch -= 1;
        const cookedKey = "cooked_" + foodId;
        GameState.inventory[cookedKey] = (GameState.inventory[cookedKey] || 0) + 1;
        UIController.toast(`🔥 ${data.name}을(를) 노릇하게 구워냈다!`);
        UIController.updateStatus();
        UIController.renderCookMenu();
    },

    eatFood(id) {
        const isCooked = id.startsWith("cooked_");
        const baseId = isCooked ? id.replace("cooked_", "") : id;
        const data = FoodData[baseId];
        if (!data) return;
        if ((GameState.inventory[id] || 0) < 1) {
            UIController.toast("보유하고 있지 않은 아이템입니다.");
            return;
        }

        GameState.inventory[id] -= 1;

        let mult = 1;
        if (!isCooked && data.needsCook) mult = 0.5;

        let risky = false;
        if (data.risky && Math.random() < data.riskChance) {
            GameState.stats.health -= data.riskDamage;
            risky = true;
        }

        ["health", "stamina", "hunger", "thirst", "sanity"].forEach(stat => {
            if (data[stat]) GameState.stats[stat] += data[stat] * mult;
        });
        GameState.stats.temp += 0.2;

        this.capStats();
        this.checkGameOver();
        UIController.toast(risky
            ? `🤢 상한 음식이었다! 몸이 안 좋아졌다...`
            : `🍽️ ${isCooked ? "구운 " : ""}${data.name}을(를) 먹었다.` + (!isCooked && data.needsCook ? " (날것이라 효과가 절반이었다)" : ""));
        UIController.updateStatus();
        UIController.renderCraftMenu();
    },

    // ---------------- 제작 (CraftSystem 위임) ----------------
    craft(recipeId) {
        CraftSystem.craft(recipeId);
    },

    combine(itemA, itemB) {
        CraftSystem.tryCombo(itemA, itemB);
    },

    // ---------------- 스탯 관리 ----------------
    capStats() {
        const s = GameState.stats;
        s.health = Math.max(0, Math.min(s.maxHealth, s.health));
        s.stamina = Math.max(0, Math.min(s.maxStamina, s.stamina));
        s.hunger = Math.max(0, Math.min(s.maxHunger, s.hunger));
        s.thirst = Math.max(0, Math.min(s.maxThirst, s.thirst));
        s.sanity = Math.max(0, Math.min(s.maxSanity, s.sanity));
        s.temp = Math.max(20, Math.min(40, s.temp));
    },

    checkGameOver() {
        if (GameState.gameOver) return;
        if (GameState.stats.health <= 0) {
            this.endGame(false, "체력이 다해 쓰러지고 말았다...");
        } else if (GameState.stats.sanity <= 0) {
            this.endGame(false, "정신이 완전히 무너져 더 이상 버틸 수 없었다...");
        }
    },

    endGame(win, reason) {
        GameState.gameOver = true;
        const params = new URLSearchParams({
            win: win ? "1" : "0",
            reason,
            day: GameState.day
        });
        location.href = `ending.html?${params.toString()}`;
    }
};