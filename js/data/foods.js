// js/data/foods.js
// ------------------------------------------------------------------
// 식량/음료 데이터. needsCook이 true인 항목은 날것으로 먹으면
// 효과가 절반으로 줄고 배탈(건강 하락) 위험이 있습니다.
// 모닥불에서 "요리하기"를 하면 cooked_ 버전으로 바뀌어 위험 없이
// 100% 효과를 받을 수 있습니다.
// ------------------------------------------------------------------

const FoodData = {
    boar_meat:  { name: "멧돼지 고기", health: 15, stamina: 15, hunger: 35, needsCook: true },
    deer_meat:  { name: "고라니 고기", health: 10, stamina: 15, hunger: 30, needsCook: true },
    fish:       { name: "생선",       health: 8,  stamina: 10, hunger: 20, needsCook: true },
    clam:       { name: "조개",       health: 5,  stamina: 5,  hunger: 12, needsCook: true },
    bat_meat:   { name: "박쥐 고기",   health: 5,  stamina: 10, hunger: 15, needsCook: true, sanity: -5 },
    chicken:    { name: "닭고기",     health: 12, stamina: 15, hunger: 28, needsCook: true },

    coconut:    { name: "코코넛",     health: 3,  stamina: 5,  hunger: 12, thirst: 10, needsCook: false },
    mushroom:   { name: "야생 버섯",   health: 2,  stamina: 0,  hunger: 8,  needsCook: false, risky: true, riskChance: 0.25, riskDamage: 20 },
    herb:       { name: "약초",       health: 5,  stamina: 0,  hunger: 2,  sanity: 5, needsCook: false },

    water:       { name: "깨끗한 물", thirst: 35, needsCook: false },
    dirty_water: { name: "더러운 물", thirst: 25, needsCook: false, risky: true, riskChance: 0.35, riskDamage: 15 }
};

// 조리하면 위험이 사라지고 효과가 100%로 적용됩니다 (cooked_ 접두사 아이템으로 변환).
