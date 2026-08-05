// js/state.js
// ------------------------------------------------------------------
// 게임의 모든 상태(state)를 관리하는 객체입니다.
// GameEngine, UIController, EventSystem, CraftSystem 등 모든 곳에서
// 이 객체를 참조/수정합니다.
// ------------------------------------------------------------------

const GameState = {
    day: 1,
    maxDay: 30,          // 30일 후 구조선이 옵니다 (승리 조건)
    hour: 8,              // 0~23시. 하루 24시간이 실제로 흐릅니다.

    // 플레이어 스탯
    stats: {
        health: 100, maxHealth: 100,
        stamina: 100, maxStamina: 100,
        hunger: 100, maxHunger: 100,
        thirst: 100, maxThirst: 100,
        sanity: 100, maxSanity: 100,
        temp: 36.5, normalTemp: 36.5
    },

    // 인벤토리: 식량류 + 자원류를 한 곳에서 관리합니다.
    inventory: {
        // 식량 (익히지 않은 원본 상태)
        boar_meat: 0, deer_meat: 0, fish: 0, clam: 0, bat_meat: 0, chicken: 0,
        mushroom: 0, herb: 0, coconut: 0,
        // 조리된 식량은 "cooked_" 접두사로 동적으로 생성됩니다. (예: cooked_boar_meat)
        dirty_water: 0, water: 0,

        // 건축 및 기초 자원
        branch: 0, big_wood: 0, vine: 0, leaf: 0,
        stone: 0, flint: 0, bone: 0, leather: 0, mud: 0, rope: 0
    },

    tools: {
        stone_axe: false,
        stone_spear: false,
        fishing_rod: false
    },

    campFacilities: {
        campfire: false,
        rain_catcher: false
    },
    campLevel: 0, // 쉼터(거처) 업그레이드 레벨

    currentLocation: "거점",
    gameOver: false,

    log: [] // 최근 활동 로그 (선택적으로 화면에 표시)
};

// 지역별 정보: 타입(camp/forest/beach/cave)에 따라 가능한 행동/자원/사냥감이 달라집니다.
// top/left는 #island-map 안에서의 위치(%)입니다.
const LocationData = {
    "거점":       { type: "camp",   icon: "⛺", label: "거점",       top: 50, left: 50 },
    "북쪽 숲":     { type: "forest", icon: "🌲", label: "북쪽 숲",     top: 20, left: 30 },
    "동쪽 숲":     { type: "forest", icon: "🌲", label: "동쪽 숲",     top: 40, left: 70 },
    "남쪽 숲":     { type: "forest", icon: "🌲", label: "남쪽 숲",     top: 70, left: 40 },
    "북쪽 해변":   { type: "beach",  icon: "🏖️", label: "북쪽 해변",   top: 10, left: 50 },
    "남서쪽 해변": { type: "beach",  icon: "🏖️", label: "남서쪽 해변", top: 80, left: 20 },
    "깊은 동굴":   { type: "cave",   icon: "🕳️", label: "깊은 동굴",   top: 30, left: 85 }
};
