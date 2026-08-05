// js/data/events.js
// ------------------------------------------------------------------
// 탐색하기(explore) 행동 시 확률적으로 발생하는 이벤트입니다.
// choices[].effects: 즉시 적용되는 효과 (stats / items)
// choices[].successRate가 있으면 도박 선택지 (success/fail 효과 분기)
// ------------------------------------------------------------------

const EventData = {
    // 해변 지역 이벤트 풀
    beach: [
        {
            id: "find_water",
            weight: 10,
            title: "바닷가에서 생수 박스를 발견했다.",
            description: "조류에 떠밀려 온 것 같다.",
            choices: [
                { text: "챙긴다", effects: { items: { water: 5 } }, msg: "갈증을 해소할 귀중한 물을 얻었다!" }
            ]
        },
        {
            id: "washed_up_crate",
            weight: 6,
            title: "부서진 나무 상자가 밀려왔다.",
            description: "안에 뭔가 들어있을지도 모른다.",
            choices: [
                { text: "열어본다", effects: { items: { branch: 3, flint: 1 } }, msg: "쓸만한 재료들을 챙겼다." }
            ]
        },
        {
            id: "predator_wilddogs",
            weight: 5,
            title: "🐕‍🦺 들개 무리가 나타났다!",
            description: "굶주린 들개들이 이빨을 드러내며 다가온다. 맞설 것인가, 도망칠 것인가?",
            choices: [
                { text: "맞서 싸운다", combat: true, rewards: ["leather", "bone"] },
                { text: "짐을 버리고 도망친다", effects: { stats: { stamina: -20, sanity: -8 } }, msg: "황급히 몸을 피해 겨우 벗어났다." }
            ]
        }
    ],

    // 숲 지역 이벤트 풀
    forest: [
        {
            id: "snake_bite",
            weight: 8,
            title: "풀숲에서 뱀을 발견했다.",
            description: "독사처럼 보인다. 어떻게 할까?",
            choices: [
                { text: "조심히 피한다", effects: { stats: { health: -5, sanity: -10 } }, msg: "물리지는 않았지만 진땀을 뺐다." },
                { text: "잡아서 식량으로 쓴다", successRate: 40, success: { items: { chicken: 2 } }, fail: { stats: { health: -25 } }, msg: "위험한 도박이었다." }
            ]
        },
        {
            id: "berry_bush",
            weight: 9,
            title: "열매가 잔뜩 열린 덤불을 발견했다.",
            description: "먹어도 안전해 보인다.",
            choices: [
                { text: "챙긴다", effects: { items: { herb: 2 } }, msg: "허브를 넉넉히 챙겼다." }
            ]
        },
        {
            id: "predator_boar",
            weight: 6,
            title: "🐗 성난 멧돼지가 돌진해온다!",
            description: "엄니를 드러낸 멧돼지가 이쪽을 노려본다. 맞설 것인가, 도망칠 것인가?",
            choices: [
                { text: "맞서 싸운다", combat: true, rewards: ["boar_meat", "leather"] },
                { text: "나무 뒤로 피한다", effects: { stats: { stamina: -20, sanity: -8 } }, msg: "가까스로 몸을 피했다." }
            ]
        }
    ],

    // 동굴 지역 이벤트 풀
    cave: [
        {
            id: "bat_swarm",
            weight: 7,
            title: "천장에서 박쥐떼가 날아올랐다.",
            description: "놀란 마음을 진정시켜야 한다.",
            choices: [
                { text: "웅크려 피한다", effects: { stats: { sanity: -10 } }, msg: "정신이 조금 아찔했지만 무사히 지나갔다." },
                { text: "한 마리를 잡아본다", successRate: 35, success: { items: { bat_meat: 1 } }, fail: { stats: { health: -15 } }, msg: "동굴 속 사냥은 역시 쉽지 않다." }
            ]
        },
        {
            id: "hidden_vein",
            weight: 6,
            title: "벽에서 반짝이는 광맥을 발견했다.",
            description: "부싯돌이 섞여 있는 것 같다.",
            choices: [
                { text: "채굴한다", effects: { items: { flint: 3, stone: 2 } }, msg: "귀한 부싯돌과 돌을 캐냈다!" }
            ]
        },
        {
            id: "predator_cavebear",
            weight: 4,
            title: "🐻 동굴 깊은 곳에서 곰이 튀어나왔다!",
            description: "덩치 큰 곰이 포효하며 다가온다. 맞설 것인가, 도망칠 것인가?",
            choices: [
                { text: "맞서 싸운다", combat: true, rewards: ["bone", "leather"] },
                { text: "동굴 입구로 도망친다", effects: { stats: { stamina: -25, sanity: -12 } }, msg: "죽을힘을 다해 동굴 밖으로 뛰쳐나왔다." }
            ]
        }
    ]
};