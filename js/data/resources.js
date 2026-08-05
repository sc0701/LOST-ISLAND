// js/data/resources.js
// ------------------------------------------------------------------
// 지역 타입(forest / beach / cave)별로 "사냥하기"와 "자원캐기" 행동을
// 했을 때 얻을 수 있는 것들의 확률/수량 테이블입니다.
//
// 각 항목의 chance는 "기본 성공 확률"이며, 도구를 보유하고 있으면
// GameEngine.getSuccessBonus() 를 통해 보너스가 더해집니다.
// ------------------------------------------------------------------

const ResourceInfo = {
    branch:   { name: "장작",     desc: "모닥불의 연료가 됩니다." },
    big_wood: { name: "큰 나무",   desc: "쉼터를 짓는 데 필요합니다." },
    vine:     { name: "덩굴",     desc: "밧줄을 만드는 재료입니다." },
    leaf:     { name: "잎사귀",   desc: "지붕이나 위장에 사용됩니다." },
    stone:    { name: "돌",       desc: "건축과 무기 제작에 쓰입니다." },
    flint:    { name: "부싯돌",   desc: "불을 피우거나 도구에 씁니다." },
    bone:     { name: "동물 뼈",  desc: "낚싯대 등 도구 재료입니다." },
    leather:  { name: "가죽",     desc: "방한/도구 재료입니다." },
    mud:      { name: "진흙",     desc: "화덕이나 벽을 바르는 데 씁니다." },
    rope:     { name: "밧줄",     desc: "여러 제작에 필요한 기초 재료입니다." }
};

// 자원캐기(gather) 드롭 테이블: [ {id, min, max, chance} ]
const GatherTable = {
    forest: [
        { id: "branch",   min: 1, max: 3, chance: 0.85 },
        { id: "big_wood", min: 1, max: 1, chance: 0.35 },
        { id: "vine",     min: 1, max: 2, chance: 0.55 },
        { id: "leaf",     min: 2, max: 4, chance: 0.65 }
    ],
    beach: [
        { id: "branch",  min: 1, max: 2, chance: 0.5 },
        { id: "flint",   min: 1, max: 1, chance: 0.3 },
        { id: "mud",     min: 1, max: 2, chance: 0.4 },
        { id: "coconut", min: 1, max: 2, chance: 0.4, isFood: true }
    ],
    cave: [
        { id: "stone",   min: 2, max: 4, chance: 0.8 },
        { id: "flint",   min: 1, max: 2, chance: 0.45 },
        { id: "bone",    min: 1, max: 1, chance: 0.25 }
    ]
};

// 사냥하기(hunt) 드롭 테이블: [ {id, chance, isFood:true} ]
const HuntTable = {
    forest: [
        { id: "boar_meat", chance: 0.30 },
        { id: "deer_meat", chance: 0.25 },
        { id: "chicken",   chance: 0.30 }
    ],
    beach: [
        { id: "fish", chance: 0.35 },
        { id: "clam", chance: 0.55 }
    ],
    cave: [
        { id: "bat_meat", chance: 0.40 },
        { id: "bone",     chance: 0.20 }
    ]
};

// 탐색하기(explore)는 이벤트(EventData) 발생 또는 소량의 잡화 획득으로 이어집니다.
const ExploreFindTable = {
    forest: [
        { id: "herb",  min: 1, max: 2, chance: 0.4, isFood: true },
        { id: "vine",  min: 1, max: 1, chance: 0.3 }
    ],
    beach: [
        { id: "water",   min: 1, max: 2, chance: 0.3, isFood: true },
        { id: "coconut", min: 1, max: 1, chance: 0.3, isFood: true }
    ],
    cave: [
        { id: "flint", min: 1, max: 1, chance: 0.3 },
        { id: "stone", min: 1, max: 2, chance: 0.3 }
    ]
};
