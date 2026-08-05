// js/systems/craftSystem.js
const CraftSystem = {
    // 재료가 충분한지 확인
    hasEnough(req) {
        for (const key in req) {
            if ((GameState.inventory[key] || 0) < req[key]) return false;
        }
        return true;
    },

    // 재료 소모
    consume(req) {
        for (const key in req) {
            GameState.inventory[key] -= req[key];
        }
    },

    // 정식 레시피 제작 (거점 전용)
    craft(recipeId) {
        const recipe = RecipeData[recipeId];
        if (!recipe) return;

        if (!this.hasEnough(recipe.req)) {
            UIController.toast(`❌ 재료가 부족합니다: ${this.describeReq(recipe.req)}`);
            return;
        }

        this.consume(recipe.req);

        if (recipe.type === "tool") {
            GameState.tools[recipeId] = true;
        } else if (recipe.type === "facility") {
            GameState.campFacilities[recipeId] = true;
        } else if (recipe.type === "upgrade") {
            GameState.campLevel = Math.max(GameState.campLevel, recipe.level);
        } else if (recipe.type === "item" && recipe.grants) {
            const g = recipe.grants;
            GameState.inventory[g.item] = (GameState.inventory[g.item] || 0) + g.amount;
        }

        UIController.toast(`🔨 [${recipe.name}] 제작 완료!`);
        UIController.updateStatus();
        UIController.renderActionButtons();
        UIController.renderCraftMenu();
    },

    describeReq(req) {
        return Object.entries(req).map(([k, v]) => {
            const name = (ResourceInfo[k] && ResourceInfo[k].name) || (FoodData[k] && FoodData[k].name) || k;
            return `${name} x${v}`;
        }).join(", ");
    },

    // 자원 조합 실험실: 임의의 두 재료를 조합. 정해진 표에 있으면 성공, 없으면 실패.
    tryCombo(itemA, itemB) {
        if (itemA === itemB && (GameState.inventory[itemA] || 0) < 2) {
            UIController.toast("❌ 같은 재료를 조합하려면 2개 이상 필요합니다.");
            return;
        }
        if ((GameState.inventory[itemA] || 0) < 1 || (GameState.inventory[itemB] || 0) < 1) {
            UIController.toast("❌ 재료가 부족합니다.");
            return;
        }

        const sortedPair = [itemA, itemB].sort();
        const found = ComboData.find(c => {
            const p = [...c.pair].sort();
            return p[0] === sortedPair[0] && p[1] === sortedPair[1];
        });

        if (found && this.hasEnough(found.cost)) {
            this.consume(found.cost);
            GameState.inventory[found.result.item] = (GameState.inventory[found.result.item] || 0) + found.result.amount;
            UIController.toast(`✨ ${found.msg}`);
        } else {
            // 실패: 재료 1개씩 소모하고 사라짐
            GameState.inventory[itemA] -= 1;
            GameState.inventory[itemB] -= 1;
            UIController.toast("💨 조합에 실패했다. 재료가 뒤섞여 못 쓰게 되었다...");
        }

        UIController.updateStatus();
        UIController.renderCraftMenu();
    }
};
