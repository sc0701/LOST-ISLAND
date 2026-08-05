const GameState = {
    day: 1,
    actionCount: 0, // 하루에 2번 행동하면 다음 날로 넘어감
    maxActions: 2,
    
    // 플레이어 스탯
    stats: {
        health: 100,
        hunger: 100,
        thirst: 100,
        sanity: 100,
        temp: 36.5
    },
    
    // 자원 및 인벤토리
    inventory: {
        food: 0,
        water: 0,
        wood: 0,
        stone: 0,
        rope: 0
    },
    
    currentLocation: "해변",
    campLevel: 0 // 0: 모래 위, 1: 임시 쉼터 ...
};