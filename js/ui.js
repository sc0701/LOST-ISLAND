// js/ui.js
const UIController = {
    // ---------------- 전체 갱신 ----------------
    updateStatus() {
        document.getElementById('day-display').innerText =
            `DAY ${GameState.day} / ${GameState.maxDay}  ·  ${String(GameState.hour).padStart(2, '0')}:00`;

        document.getElementById('stat-health').innerText = Math.round(GameState.stats.health);
        document.getElementById('stat-hunger').innerText = Math.round(GameState.stats.hunger);
        document.getElementById('stat-thirst').innerText = Math.round(GameState.stats.thirst);
        document.getElementById('stat-sanity').innerText = Math.round(GameState.stats.sanity);
        document.getElementById('stat-temp').innerText = GameState.stats.temp.toFixed(1);
        document.getElementById('stat-stamina').innerText = Math.round(GameState.stats.stamina);

        this.renderInventory();
        this.updateVisuals();
        this.renderMap();
    },

    // ---------------- 배경/캐릭터 이미지 ----------------
    updateVisuals() {
        const bgImage = document.getElementById('bg-image');
        const playerImage = document.getElementById('player-image');
        if (!bgImage || !playerImage) return;

        const isNight = GameState.hour >= NIGHT_START || GameState.hour < NIGHT_END;
        const locType = LocationData[GameState.currentLocation].type;

        if (isNight) {
            bgImage.src = 'assets/bg/night.png';
        } else if (locType === 'forest') {
            bgImage.src = 'assets/bg/forest.png';
        } else if (locType === 'cave') {
            bgImage.src = 'assets/bg/cave.png';
        } else {
            bgImage.src = 'assets/bg/beach_day.png';
        }

        if (GameState.stats.health <= 30 || GameState.stats.hunger <= 15 || GameState.stats.thirst <= 15) {
            playerImage.src = 'assets/characters/player_hurt.png';
        } else {
            playerImage.src = 'assets/characters/player_normal.png';
        }
    },

    // ---------------- 인벤토리 ----------------
    renderInventory() {
        const el = document.getElementById('inventory-grid');
        if (!el) return;

        const rows = [];
        // 식량류 (원본 + 조리본)
        Object.keys(FoodData).forEach(id => {
            const count = GameState.inventory[id] || 0;
            if (count > 0) rows.push({ label: FoodData[id].name, count, onEat: id });
            const cookedCount = GameState.inventory['cooked_' + id] || 0;
            if (cookedCount > 0) rows.push({ label: '구운 ' + FoodData[id].name, count: cookedCount, onEat: 'cooked_' + id });
        });
        // 물
        if ((GameState.inventory.water || 0) > 0) rows.push({ label: '깨끗한 물', count: GameState.inventory.water, onEat: 'water' });
        if ((GameState.inventory.dirty_water || 0) > 0) rows.push({ label: '더러운 물', count: GameState.inventory.dirty_water, onEat: 'dirty_water' });

        const foodHtml = rows.map(r =>
            `<div class="inv-item">
                <span>${r.label} <b>x${r.count}</b></span>
                <button class="inv-eat-btn" onclick="GameEngine.eatFood('${r.onEat}')">먹기</button>
            </div>`
        ).join('') || '<p class="inv-empty">보유한 식량이 없습니다.</p>';

        // 자원류
        const resRows = Object.keys(ResourceInfo).filter(id => (GameState.inventory[id] || 0) > 0);
        const resHtml = resRows.map(id =>
            `<div class="inv-item"><span>${ResourceInfo[id].name} <b>x${GameState.inventory[id]}</b></span></div>`
        ).join('') || '<p class="inv-empty">보유한 자원이 없습니다.</p>';

        // 도구 / 시설
        const toolNames = { stone_axe: '돌도끼', stone_spear: '돌창', fishing_rod: '뼈 낚싯대' };
        const facilityNames = { campfire: '모닥불', rain_catcher: '빗물 저장고' };
        const toolsHtml = Object.entries(GameState.tools).filter(([k, v]) => v)
            .map(([k]) => `<span class="tag">🔧 ${toolNames[k]}</span>`).join('');
        const facilitiesHtml = Object.entries(GameState.campFacilities).filter(([k, v]) => v)
            .map(([k]) => `<span class="tag">🏕️ ${facilityNames[k]}</span>`).join('');
        const levelHtml = GameState.campLevel > 0 ? `<span class="tag">🏠 쉼터 Lv.${GameState.campLevel}</span>` : '';

        el.innerHTML = `
            <div class="inv-section"><h4>🍖 식량 / 물</h4>${foodHtml}</div>
            <div class="inv-section"><h4>🪵 자원</h4>${resHtml}</div>
            <div class="inv-section"><h4>🛠️ 보유 도구 / 시설</h4>
                <div class="tag-row">${toolsHtml}${facilitiesHtml}${levelHtml}${!toolsHtml && !facilitiesHtml && !levelHtml ? '<span class="inv-empty">아직 없음</span>' : ''}</div>
            </div>`;
    },

    // ---------------- 지도 ----------------
    renderMap() {
        const container = document.getElementById('map-nodes');
        if (!container) return;
        container.innerHTML = Object.entries(LocationData).map(([name, info]) => {
            const active = GameState.currentLocation === name ? 'active' : '';
            return `<button class="map-node ${info.type} ${active}" style="top:${info.top}%; left:${info.left}%;" onclick="GameEngine.moveTo('${name}')">
                        <span class="node-icon">${info.icon}</span><span class="node-label">${info.label}</span>
                    </button>`;
        }).join('');
    },

    // ---------------- 행동 버튼 ----------------
    renderActionButtons() {
        const container = document.getElementById('action-buttons');
        if (!container) return;
        const loc = GameState.currentLocation;
        const info = LocationData[loc];

        const btn = (type, emoji, extra) =>
            `<button onclick="GameEngine.performAction('${type}')">${emoji} ${type}<br><small>${extra}</small></button>`;

        let html = `<h3>🏃 ${info.icon} ${info.label}에서 할 수 있는 행동</h3><div id="action-grid">`;

        if (info.type === 'camp') {
            html += btn('휴식', '🛌', `스태미나 0 · ${ActionCost['휴식'].time}시간`);
            html += btn('요리', '🔥', `스태미나 ${ActionCost['요리'].stamina} · ${ActionCost['요리'].time}시간`);
            html += `<button onclick="UIController.openCraftModal()">🔨 제작 / 건설<br><small>레시피로 도구/시설 만들기</small></button>`;
            html += `<button onclick="UIController.openComboModal()">🧪 조합 실험<br><small>재료 2개를 섞어보기</small></button>`;
        } else {
            html += btn('탐색하기', '🔍', `스태미나 ${ActionCost['탐색하기'].stamina} · ${ActionCost['탐색하기'].time}시간`);
            html += btn('사냥하기', '🏹', `스태미나 ${ActionCost['사냥하기'].stamina} · ${ActionCost['사냥하기'].time}시간`);
            html += btn('자원캐기', '⛏️', `스태미나 ${ActionCost['자원캐기'].stamina} · ${ActionCost['자원캐기'].time}시간`);
            html += btn('휴식', '🛌', `스태미나 0 · ${ActionCost['휴식'].time}시간`);
        }
        html += '</div>';
        container.innerHTML = html;
    },

    // ---------------- 제작 모달 ----------------
    openCraftModal() {
        document.getElementById('craft-modal').style.display = 'flex';
        this.renderCraftMenu();
    },
    closeCraftModal() {
        document.getElementById('craft-modal').style.display = 'none';
    },
    renderCraftMenu() {
        const el = document.getElementById('craft-list');
        if (!el) return;
        el.innerHTML = Object.entries(RecipeData).map(([id, r]) => {
            const already = (r.type === 'tool' && GameState.tools[id]) ||
                            (r.type === 'facility' && GameState.campFacilities[id]) ||
                            (r.type === 'upgrade' && GameState.campLevel >= r.level);
            const enough = CraftSystem.hasEnough(r.req);
            const reqText = CraftSystem.describeReq(r.req);
            return `<div class="craft-item">
                        <div class="craft-info">
                            <strong>${r.name}</strong> ${already ? '<span class="badge-done">✔ 완료</span>' : ''}
                            <div class="craft-req">${reqText}</div>
                        </div>
                        <button ${already || !enough ? 'disabled' : ''} onclick="GameEngine.craft('${id}')">제작</button>
                    </div>`;
        }).join('');
    },

    // ---------------- 조합 실험 모달 ----------------
    openComboModal() {
        document.getElementById('combo-modal').style.display = 'flex';
        this.renderComboMenu();
    },
    closeComboModal() {
        document.getElementById('combo-modal').style.display = 'none';
    },
    renderComboMenu() {
        const el = document.getElementById('combo-list');
        if (!el) return;
        const owned = Object.keys(ResourceInfo).filter(id => (GameState.inventory[id] || 0) > 0);
        if (owned.length < 1) {
            el.innerHTML = '<p class="inv-empty">조합할 재료가 없습니다. 먼저 자원을 캐오세요.</p>';
            return;
        }
        const options = owned.map(id => `<option value="${id}">${ResourceInfo[id].name} (${GameState.inventory[id]}개)</option>`).join('');
        el.innerHTML = `
            <p style="margin-bottom:10px; color:#94a3b8;">재료 두 개를 골라 조합해보세요. 정해진 조합이면 성공, 아니면 재료가 사라집니다.</p>
            <div class="combo-selects">
                <select id="combo-a">${options}</select>
                <span style="align-self:center;">+</span>
                <select id="combo-b">${options}</select>
            </div>
            <button style="margin-top:12px; width:100%;" onclick="UIController.doCombo()">조합하기</button>`;
    },
    doCombo() {
        const a = document.getElementById('combo-a').value;
        const b = document.getElementById('combo-b').value;
        GameEngine.combine(a, b);
        this.renderComboMenu();
    },

    // ---------------- 요리 모달 ----------------
    renderCookMenu() {
        let modal = document.getElementById('cook-modal');
        if (!modal) return;
        const cookable = Object.keys(FoodData).filter(id => FoodData[id].needsCook && (GameState.inventory[id] || 0) > 0);
        const list = document.getElementById('cook-list');
        list.innerHTML = cookable.length ? cookable.map(id =>
            `<div class="craft-item">
                <div class="craft-info"><strong>${FoodData[id].name}</strong> x${GameState.inventory[id]}
                    <div class="craft-req">장작(연료) 1개 필요 · 보유: ${GameState.inventory.branch || 0}</div>
                </div>
                <button ${(GameState.inventory.branch || 0) < 1 ? 'disabled' : ''} onclick="GameEngine.cookFood('${id}'); UIController.renderCookMenu();">굽기</button>
            </div>`
        ).join('') : '<p class="inv-empty">조리할 날음식이 없습니다.</p>';
        modal.style.display = 'flex';
    },
    closeCookModal() {
        const modal = document.getElementById('cook-modal');
        if (modal) modal.style.display = 'none';
    },

    // ---------------- 이벤트 모달 ----------------
    showEventModal(title, desc, choicesHtml) {
        document.getElementById('event-title').innerText = title;
        document.getElementById('event-desc').innerText = desc;
        document.getElementById('event-choices').innerHTML = choicesHtml;
        document.getElementById('event-modal').style.display = 'flex';
    },
    hideEventModal() {
        document.getElementById('event-modal').style.display = 'none';
    },

    // ---------------- 토스트 알림 ----------------
    toast(message) {
        const el = document.getElementById('toast');
        if (!el) { console.log(message); return; }
        el.innerText = message;
        el.classList.remove('show');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
    }
};
