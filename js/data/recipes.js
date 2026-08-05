// js/data/recipes.js
// ------------------------------------------------------------------
// RecipeData: 거점에서 "제작하기" 메뉴를 통해 만드는 정식 레시피입니다.
// 필요한 재료(req)를 모두 갖추고 있으면 100% 제작에 성공합니다.
//
// ComboData: "자원 조합 실험실"에서 아무 재료 2개를 골라 실험하는
// 시스템입니다. 정해진 조합표에 있으면 성공하지만, 표에 없는 조합은
// 재료만 사라지고 실패합니다 (모든 조합을 다 성공시키지 않기 위함).
// ------------------------------------------------------------------

const RecipeData = {
    // 기초 재료
    rope:        { name: "밧줄",              req: { vine: 3 },                          type: "item",    grants: { item: "rope", amount: 1 } },
    bone_needle:  { name: "뼈 바늘",       req: { bone: 1, flint: 1 },        type: "item" },
    leather_strap:{ name: "가죽 끈",       req: { leather: 1, flint: 1 },     type: "item" },
    wood_board:   { name: "나무판",        req: { big_wood: 1, stone: 1 },    type: "item" },
    stone_knife:  { name: "돌 칼",         req: { stone: 1, flint: 1, rope: 1 }, type: "item" },
    charcoal:     { name: "숯",           req: { branch: 3, mud: 1 },        type: "item" },

    // 도구 & 무기
    stone_axe:   { name: "돌도끼",            req: { branch: 2, stone: 2, rope: 1 },      type: "tool" },
    stone_spear: { name: "돌창",              req: { big_wood: 1, flint: 1, rope: 1 },    type: "tool" },
    fishing_rod: { name: "뼈 낚싯대",         req: { branch: 2, rope: 2, bone: 1 },       type: "tool" },
    wooden_spear: { name: "나무 창",       req: { branch: 2, vine: 1 },             type: "tool" },
    stone_hammer: { name: "돌망치",        req: { stone: 3, branch: 2, rope: 1 },   type: "tool" },
    bone_dagger:  { name: "뼈 단검",       req: { bone: 2, leather: 1 },            type: "tool" },
    leather_pouch:{ name: "가죽 주머니",   req: { leather: 3, rope: 1 },            type: "tool" },
    torch:        { name: "횃불",          req: { branch: 1, vine: 1, flint: 1 },   type: "tool" },
    bow:          { name: "활",            req: { big_wood: 1, rope: 2, vine: 1 },  type: "tool" },
    arrow:        { name: "화살",          req: { branch: 1, flint: 1, leaf: 1 },   type: "tool" },
    sling:        { name: "투석구",        req: { leather: 1, rope: 2 },            type: "tool" },
    bone_harpoon: { name: "뼈 작살",       req: { big_wood: 1, bone: 2, rope: 1 },  type: "tool" },
    gathering_net:{ name: "채집망",        req: { vine: 4, rope: 2 },               type: "tool" },
    mud_bowl:     { name: "진흙 그릇",     req: { mud: 3, leaf: 1 },                type: "tool" },
    coconut_flask:{ name: "코코넛 물통",   req: { coconut: 1, rope: 1 },            type: "tool" },
    leaf_umbrella:{ name: "나뭇잎 우산",   req: { big_wood: 1, leaf: 5, vine: 2 },  type: "tool" },

// 방어구 & 의류 (▼ 신규 카테고리)
    leaf_cloak:   { name: "나뭇잎 망토",   req: { leaf: 10, vine: 3 },              type: "armor" },
    leather_tunic:{ name: "가죽 튜닉",     req: { leather: 4, rope: 2 },            type: "armor" },
    bone_armor:   { name: "뼈 갑옷",       req: { bone: 5, leather: 2, rope: 2 },   type: "armor" },
    mud_camo:     { name: "진흙 위장크림", req: { mud: 2, leaf: 1 },                type: "armor" },
    leather_shoes:{ name: "가죽 신발",     req: { leather: 2, vine: 2 },            type: "armor" },

    // 시설 및 쉼터 업그레이드
    campfire:    { name: "모닥불",            req: { stone: 5, branch: 5 },               type: "facility" },
    camp_lv1:    { name: "나뭇잎 쉼터 (Lv.1)", req: { big_wood: 3, leaf: 10, rope: 2 },    type: "upgrade", level: 1 },
    camp_lv2:    { name: "통나무 쉼터 (Lv.2)", req: { big_wood: 8, stone: 6, rope: 4 },    type: "upgrade", level: 2 },
    rain_catcher:{ name: "빗물 저장고",       req: { big_wood: 2, leaf: 6, mud: 3 },      type: "facility" },
    drying_rack:  { name: "건조대",        req: { branch: 4, rope: 2 },               type: "facility" },
    smoker:       { name: "훈제기",        req: { stone: 4, mud: 2, branch: 3 },      type: "facility" },
    mud_oven:     { name: "진흙 화덕",     req: { mud: 5, stone: 3 },                 type: "facility" },
    wooden_fence: { name: "나무 울타리",   req: { big_wood: 2, branch: 3, vine: 2 },  type: "facility" },
    stone_wall:   { name: "돌 담장",       req: { stone: 8, mud: 3 },                 type: "facility" },
    leather_tent: { name: "가죽 텐트",     req: { big_wood: 3, leather: 5, rope: 4 }, type: "facility" },
    trap:         { name: "함정",          req: { branch: 3, rope: 2, leaf: 2 },      type: "facility" },
    coconut_trap: { name: "코코넛 함정",   req: { coconut: 1, branch: 1, vine: 1 },   type: "facility" },
    bone_chime:   { name: "뼈 풍경",       req: { bone: 3, vine: 1 },                 type: "facility" },
    stone_mortar: { name: "돌절구",        req: { stone: 4, flint: 1 },               type: "item" },

    // 방어 시설 (기상 이변/맹수 피해를 줄여줍니다)
    watchtower:   { name: "감시탑",        req: { big_wood: 4, branch: 4, rope: 2 },  type: "facility" }
};


// 조합 실험실: key는 "정렬된 아이템쌍" 문자열 (예: "stone+stone_" 처럼 만들지 않고
// CraftSystem에서 두 id를 정렬해 "a|b" 형태로 비교합니다)
const ComboData = [
    { pair: ["vine", "vine"],     result: { item: "rope", amount: 1 },     cost: { vine: 2 },              msg: "덩굴을 엮어 튼튼한 밧줄을 만들었다!" },
    { pair: ["stone", "flint"],   result: { item: "flint", amount: 1 },    cost: { stone: 1, flint: 1 },   msg: "돌과 부싯돌을 다듬어 더 날카로운 부싯돌을 얻었다!" },
    { pair: ["branch", "leaf"],   result: { item: "leaf", amount: 3 },     cost: { branch: 1, leaf: 1 },   msg: "나뭇가지에 잎을 엮어 위장막 재료를 늘렸다!" },
    { pair: ["mud", "leaf"],      result: { item: "mud", amount: 2 },      cost: { mud: 1, leaf: 2 },      msg: "진흙을 잎으로 다져 더 단단하게 만들었다!" },
    { pair: ["bone", "flint"],    result: { item: "bone", amount: 1 },     cost: { bone: 1, flint: 1 },    msg: "뼈를 부싯돌로 갈아 날카롭게 다듬었다!" },
    { pair: ["big_wood", "vine"], result: { item: "big_wood", amount: 1 }, cost: { big_wood: 1, vine: 2 }, msg: "덩굴로 나무를 보강해 하나 더 튼튼하게 만들었다!" }
];