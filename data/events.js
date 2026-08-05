const EventData = {
    // 해변 지역 이벤트 풀
    beach: [
        {
            id: "find_water",
            weight: 10,
            title: "바닷가에서 생수 박스를 발견했다.",
            description: "조류에 떠밀려 온 것 같다.",
            choices: [
                {
                    text: "챙긴다",
                    effects: { items: { water: 5 } },
                    msg: "갈증을 해소할 귀중한 물을 얻었다!"
                }
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
                {
                    text: "조심히 피한다",
                    effects: { stats: { health: -5, sanity: -10 } },
                    msg: "물리지는 않았지만 진땀을 뺐다."
                },
                {
                    text: "잡아서 식량으로 쓴다",
                    successRate: 40, // 40% 확률로 성공
                    success: { items: { food: 2 } },
                    fail: { stats: { health: -25 } },
                    msg: "위험한 도박이었다."
                }
            ]
        }
    ]
};