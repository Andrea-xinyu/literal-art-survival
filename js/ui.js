/**
 * UI控制器模块
 * 负责界面渲染和更新
 */

class UI {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            major: document.getElementById('major-screen'),
            main: document.getElementById('main-screen'),
            ending: document.getElementById('ending-screen')
        };

        this.modals = {
            intro: document.getElementById('intro-modal'),
            event: document.getElementById('event-popup'),
            custom: null // 动态创建
        };

        // 创建自定义弹窗
        this.createCustomModal();
    }

    /**
     * 创建自定义弹窗
     */
    createCustomModal() {
        const modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; text-align: center;">
                <div id="custom-modal-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modals.custom = modal;
    }

    /**
     * 切换屏幕
     */
    switchScreen(screenName) {
        // 隐藏所有屏幕
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // 显示目标屏幕
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    /**
     * 显示弹窗
     */
    showModal(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.remove('hidden');
        }
    }

    /**
     * 隐藏弹窗
     */
    hideModal(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.add('hidden');
        }
    }

    /**
     * 显示自定义弹窗
     */
    showCustomModal(content) {
        const contentDiv = document.getElementById('custom-modal-content');
        if (contentDiv) {
            contentDiv.innerHTML = content;
            this.showModal('custom');
        }
    }

    /**
     * 更新所有状态显示
     */
    updateStats(player) {
        // 日期显示（大一9月3日格式）
        document.getElementById('year').textContent = player.getDateString();

        // 行动点显示
        const actionsDiv = document.getElementById('actions-display') || this.createActionsDisplay();
        actionsDiv.textContent = `⚡ 剩余行动点: ${player.actionsLeft}/10`;
        actionsDiv.style.color = player.actionsLeft <= 3 ? '#ff69b4' : '#fff';

        // 专业名
        const majorData = GameData.majors[player.major];
        document.getElementById('major-name').textContent = majorData ? majorData.name : '未知';

        // 金钱
        document.getElementById('money').textContent = `¥${player.money}`;

        // 焦虑值（>=80显示红色警告）
        const anxietyBar = document.getElementById('anxiety-bar');
        const anxietyValue = document.getElementById('anxiety-value');
        anxietyBar.style.width = `${player.anxiety}%`;
        anxietyValue.textContent = `${player.anxiety}%`;

        // 焦虑警告样式
        if (player.anxiety >= 80) {
            anxietyBar.style.backgroundColor = '#ff0000';
            anxietyValue.style.color = '#ff0000';
            anxietyValue.textContent = `${player.anxiety}% ⚠️`;
        } else {
            anxietyBar.style.backgroundColor = '#ff69b4';
            anxietyValue.style.color = '#fff';
        }

        // 理想主义值
        document.getElementById('idealism-bar').style.width = `${player.idealism}%`;
        document.getElementById('idealism-value').textContent = `${player.idealism}%`;

        // 学业水平（百分制）
        this.updateAcademicDisplay(player);

        // 技能显示（最多3个）
        this.updateSkillsDisplay(player);

        // 社交关系和人脉
        this.updateRelations(player);

        // 更新像素小人状态
        this.updatePixelAvatar(player);
    }

    /**
     * 更新像素小人显示
     */
    updatePixelAvatar(player) {
        const avatarContainer = document.getElementById('pixel-avatar') || this.createPixelAvatar();

        // 根据焦虑值选择状态
        let anxietyState = 'normal';
        if (player.anxiety >= 80) anxietyState = 'critical';
        else if (player.anxiety >= 60) anxietyState = 'high';
        else if (player.anxiety <= 30) anxietyState = 'relaxed';

        // 更新状态文本
        const statusText = avatarContainer.querySelector('.avatar-status');
        if (statusText) {
            if (player.anxiety >= 80) {
                statusText.innerHTML = '⚠️ <span style="color: #ff0000;">焦虑过高！请休息！</span>';
            } else if (player.anxiety >= 60) {
                statusText.innerHTML = '⚡ <span style="color: #ffaa00;">有点焦虑</span>';
            } else if (player.anxiety <= 30) {
                statusText.innerHTML = '✨ <span style="color: #90ee90;">状态不错</span>';
            } else {
                statusText.textContent = '😐 一般般';
            }
        }

        return avatarContainer;
    }

    /**
     * 创建像素小人
     */
    createPixelAvatar() {
        const mainContent = document.querySelector('.main-content');
        const avatarDiv = document.createElement('div');
        avatarDiv.id = 'pixel-avatar';
        avatarDiv.className = 'pixel-avatar-container';
        avatarDiv.innerHTML = `
            <div class="avatar-status" style="
                text-align: center;
                font-size: 14px;
                margin-bottom: 10px;
                padding: 5px;
                background: #1a1a1a;
                border: 1px solid #333;
            ">😐 一般般</div>
            <div class="avatar-pixel" style="
                width: 100px;
                height: 100px;
                margin: 0 auto;
                background: #ff69b4;
                border: 3px solid #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 60px;
            ">🧑</div>
            <div class="avatar-action" style="
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 10px;
            ">等待行动...</div>
        `;
        mainContent.insertBefore(avatarDiv, mainContent.firstChild);
        return avatarDiv;
    }

    /**
     * 设置像素小人动作
     */
    setAvatarAction(action) {
        const avatar = document.querySelector('.avatar-pixel');
        const actionText = document.querySelector('.avatar-action');

        const actions = {
            study: { emoji: '📚', text: '正在认真学习...' },
            social: { emoji: '🎉', text: '正在社交中...' },
            work: { emoji: '💼', text: '正在打工...' },
            relax: { emoji: '🎮', text: '正在躺平...' },
            studentUnion: { emoji: '🏛️', text: '正在学生会工作...' },
            event: { emoji: '😮', text: '发生了什么事！' },
            exam: { emoji: '📝', text: '正在考试中...' }
        };

        if (avatar && actions[action]) {
            avatar.textContent = actions[action].emoji;
            actionText.textContent = actions[action].text;
        }
    }

    /**
     * 创建行动点显示元素
     */
    createActionsDisplay() {
        const statusBar = document.querySelector('.status-bar');
        const actionsDiv = document.createElement('span');
        actionsDiv.id = 'actions-display';
        actionsDiv.className = 'status-item';
        statusBar.querySelector('.status-left').appendChild(actionsDiv);
        return actionsDiv;
    }

    /**
     * 更新学业水平显示（百分制）
     */
    updateAcademicDisplay(player) {
        // 更新或创建学业显示
        let academicDiv = document.getElementById('academic-display');
        if (!academicDiv) {
            const statsPanel = document.querySelector('.stats-panel');
            academicDiv = document.createElement('div');
            academicDiv.id = 'academic-display';
            academicDiv.className = 'stat-group';
            statsPanel.insertBefore(academicDiv, statsPanel.children[1]);
        }

        const gpaStr = player.gpa ? Math.round(player.gpa) : 0;
        const academicStr = player.academic ? Math.round(player.academic) : 0;

        // 学生会等级显示
        let unionHtml = '';
        if (player.studentUnion) {
            const unionLevelName = player.getStudentUnionLevelName ? player.getStudentUnionLevelName(player.studentUnionLevel) : `Lv.${player.studentUnionLevel}`;
            unionHtml = `
                <div class="stat-row" style="margin-top: 8px;">
                    <span class="stat-label">🏛️ 学生会:</span>
                    <span class="stat-value" style="color: #ff69b4;">${unionLevelName}</span>
                    <span style="font-size: 10px; color: #888; margin-left: 5px;">(奉献:${Math.round(player.contribution || 0)})</span>
                </div>
            `;
        }

        academicDiv.innerHTML = `
            <div class="stat-title">📖 学业水平</div>
            <div class="stat-bar">
                <span class="stat-label">绩点:</span>
                <div class="progress-bar" style="flex: 1;">
                    <div class="progress-fill" style="width: ${player.gpa}%; background: ${player.gpa >= 85 ? '#90ee90' : player.gpa >= 70 ? '#ff69b4' : '#ff6666'};"></div>
                </div>
                <span class="stat-value" style="color: ${player.gpa >= 85 ? '#90ee90' : player.gpa >= 70 ? '#fff' : '#ff6666'};">${gpaStr}</span>
            </div>
            <div class="stat-bar" style="margin-top: 8px;">
                <span class="stat-label">专业:</span>
                <div class="progress-bar" style="flex: 1;">
                    <div class="progress-fill idealism" style="width: ${player.academic}%"></div>
                </div>
                <span class="stat-value">${academicStr}</span>
            </div>
            ${unionHtml}
        `;
    }

    /**
     * 更新技能显示（最多3个）
     */
    updateSkillsDisplay(player) {
        const skillNames = {
            writing: '写作',
            coding: '代码',
            media: '自媒体',
            art: '绘画',
            cosplay: 'Cosplay',
            gaming: '游戏代肝',
            divination: '占卜',
            tutoring: '家教',
            english: '英语',
            photography: '摄影',
            design: '设计',
            civilService: '考公'
        };

        let html = '<div class="stat-title">🎯 技能栏 (' + Object.keys(player.skills).length + '/3)</div>';
        html += '<div class="skill-grid">';

        for (let skillId in player.skills) {
            const level = player.skills[skillId];
            const levelName = player.getSkillLevelName(level);
            const stars = '★'.repeat(Math.floor(level / 2)) + '☆'.repeat(5 - Math.floor(level / 2));

            html += `
                <div class="skill-item" style="background: #1a1a1a; padding: 8px; border: 1px solid #333;">
                    <span class="skill-name" style="color: #ff69b4;">${skillNames[skillId] || skillId}</span>
                    <div style="font-size: 10px; color: #888;">${levelName}</div>
                    <div style="font-size: 11px; color: #ffb6c1;">${stars}</div>
                    <div style="font-size: 10px; color: #666;">Lv.${level.toFixed(1)}</div>
                </div>
            `;
        }

        // 显示空槽位
        const emptySlots = player.maxSkills - Object.keys(player.skills).length;
        for (let i = 0; i < emptySlots; i++) {
            html += `
                <div class="skill-item" style="background: #0a0a0a; padding: 8px; border: 1px dashed #333; opacity: 0.5;">
                    <span class="skill-name" style="color: #666;">[空]</span>
                    <div style="font-size: 10px; color: #444;">待学习</div>
                </div>
            `;
        }

        html += '</div>';

        // 更新或创建技能显示区域
        let skillsDiv = document.getElementById('skills-display');
        if (!skillsDiv) {
            const statsPanel = document.querySelector('.stats-panel');
            skillsDiv = document.createElement('div');
            skillsDiv.id = 'skills-display';
            skillsDiv.className = 'stat-group';
            statsPanel.appendChild(skillsDiv);
        }
        skillsDiv.innerHTML = html;
    }

    /**
     * 更新技能显示
     */
    updateSkillDisplay(elementId, level) {
        const element = document.getElementById(elementId);
        if (element) {
            const stars = '⭐'.repeat(Math.floor(level));
            element.textContent = stars || '✩';
        }
    }

    /**
     * 更新社交关系显示（6级室友关系 + 8级人脉等级）
     */
    updateRelations(player) {
        const container = document.getElementById('relations');
        if (!container) return;

        const relations = player.relations;

        // 室友关系等级
        const getRoommateLevel = (val) => {
            if (val >= 86) return { text: '死党', color: '#ff69b4' };
            if (val >= 66) return { text: '亲密', color: '#ffb6c1' };
            if (val >= 46) return { text: '熟悉', color: '#fff' };
            if (val >= 31) return { text: '陌生人', color: '#888' };
            if (val >= 16) return { text: '紧张', color: '#ffaa00' };
            return { text: '互相厌恶', color: '#ff0000' };
        };

        // 人脉等级
        const getNetworkLevel = (val) => {
            if (val >= 100) return { text: '大网红', color: '#ff69b4' };
            if (val >= 90) return { text: '全校皆知', color: '#44ff44' };
            if (val >= 60) return { text: '口口相传', color: '#88ff88' };
            if (val >= 40) return { text: '小有名气', color: '#fff' };
            if (val >= 30) return { text: '偶有耳闻', color: '#ffdd00' };
            if (val >= 20) return { text: '路人一枚', color: '#ffaa00' };
            if (val >= 10) return { text: '查无此人', color: '#ff4444' };
            return { text: '全校厌恶', color: '#ff0000' };
        };

        const roommateVal = relations.roommate || 0;
        const roommateLevel = getRoommateLevel(roommateVal);

        const networkVal = player.network || 0;
        const networkLevel = getNetworkLevel(networkVal);

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <span class="relation-tag" style="color: ${roommateLevel.color};">室友: ${roommateLevel.text}</span>
                <span class="relation-tag" style="color: ${networkLevel.color};">人脉: ${networkLevel.text} (${Math.round(networkVal)})</span>
            </div>
        `;
    }

    /**
     * 更新叙事文本
     */
    updateNarrative(text) {
        const element = document.getElementById('narrative');
        if (element) {
            // 添加打字机效果
            this.typewriterEffect(element.querySelector('.narrative-text'), text);
        }
    }

    /**
     * 打字机效果
     */
    typewriterEffect(element, text, speed = 20) {
        element.innerHTML = '';
        const lines = text.split('\n');
        let currentLine = 0;
        let currentChar = 0;

        const type = () => {
            if (currentLine >= lines.length) return;

            const line = lines[currentLine];
            if (currentChar < line.length) {
                element.innerHTML += line[currentChar];
                currentChar++;
                setTimeout(type, speed);
            } else {
                element.innerHTML += '<br>';
                currentLine++;
                currentChar = 0;
                setTimeout(type, speed * 2);
            }
        };

        type();
    }

    /**
     * 显示事件弹窗
     */
    showEvent(event) {
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-content').innerHTML = event.content.replace(/\n/g, '<br>');
        this.showModal('event');
    }

    /**
     * 添加日志
     */
    addLog(message) {
        const container = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        container.appendChild(entry);

        // 滚动到底部
        container.scrollTop = container.scrollHeight;

        // 限制条目数
        while (container.children.length > 20) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * 清空日志
     */
    clearLogs() {
        const container = document.getElementById('log-content');
        container.innerHTML = '';
    }

    /**
     * 显示结局
     */
    showEnding(ending, stats) {
        document.getElementById('ending-title').textContent = `${ending.icon} ${ending.title}`;

        // 结局内容
        let contentHtml = `<p>${ending.content.replace(/\n/g, '</p><p>')}</p>`;
        contentHtml += `<div class="ending-tags" style="margin-top: 20px;">`;
        ending.tags.forEach(tag => {
            contentHtml += `<span style="display: inline-block; background: #333; color: #ff69b4; padding: 3px 10px; margin: 3px; font-size: 12px;">${tag}</span>`;
        });
        contentHtml += `</div>`;
        document.getElementById('ending-content').innerHTML = contentHtml;

        // 最终统计
        const skillNames = {
            writing: '写作',
            coding: '代码',
            media: '自媒体',
            art: '绘画',
            cosplay: 'Cosplay',
            gaming: '游戏代肝',
            divination: '占卜',
            tutoring: '家教',
            english: '英语',
            photography: '摄影',
            design: '设计',
            civilService: '考公'
        };

        let statsHtml = `<h4 style="color: #ff69b4; margin-bottom: 15px;">📊 最终统计</h4>`;
        statsHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; font-size: 13px;">`;
        statsHtml += `<div>💰 剩余资金: <span style="color: #fff;">¥${stats.money}</span></div>`;
        statsHtml += `<div>😰 最终焦虑: <span style="color: #ff69b4;">${stats.anxiety}%</span></div>`;
        statsHtml += `<div>✨ 理想主义: <span style="color: #ffb6c1;">${stats.idealism}%</span></div>`;
        statsHtml += `<div>📚 最终绩点: <span style="color: #fff;">${stats.gpa ? Math.round(stats.gpa) : 0}分</span></div>`;
        statsHtml += `<div>🤝 最终人脉: <span style="color: #fff;">${stats.network || 0}</span></div>`;
        statsHtml += `<div>🎓 学会技能: <span style="color: #fff;">${Object.keys(stats.skills).length}个</span></div>`;
        statsHtml += `</div>`;

        // 显示已学技能
        if (Object.keys(stats.skills).length > 0) {
            statsHtml += `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">`;
            statsHtml += `<h4 style="color: #ff69b4; margin-bottom: 10px;">🎯 掌握技能</h4>`;
            statsHtml += `<div style="font-size: 12px; line-height: 1.8;">`;
            for (let skillId in stats.skills) {
                const level = stats.skills[skillId];
                const levelName = level >= 7 ? '高级' : level >= 4 ? '中级' : '初级';
                statsHtml += `<div>${skillNames[skillId] || skillId}: ${levelName} (Lv.${level.toFixed(1)})</div>`;
            }
            statsHtml += `</div></div>`;
        }

        if (ending.stats) {
            statsHtml += `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">`;
            statsHtml += `<h4 style="color: #ff69b4; margin-bottom: 10px;">💼 结局详情</h4>`;
            statsHtml += `<div style="font-size: 13px; line-height: 1.8;">`;
            statsHtml += `<div>💵 预期收入: ${ending.stats.income}</div>`;
            statsHtml += `<div>📈 稳定性: ${ending.stats.stability}</div>`;
            statsHtml += `<div>😊 满意度: ${ending.stats.satisfaction}</div>`;
            statsHtml += `</div></div>`;
        }

        document.getElementById('ending-stats').innerHTML = statsHtml;

        this.switchScreen('ending');
    }

    /**
     * 更新选择按钮状态
     */
    updateChoiceButtons(player) {
        const container = document.getElementById('choice-buttons');
        if (!container) return;

        // 更新"参加社团活动"按钮为"自由活动"
        const socialBtn = Array.from(container.querySelectorAll('.choice-btn')).find(
            btn => btn.getAttribute('onclick')?.includes('social')
        );
        if (socialBtn) {
            const hintSpan = socialBtn.querySelector('.choice-hint');
            if (hintSpan && hintSpan.textContent.includes('社团')) {
                socialBtn.querySelector('.choice-text').textContent = '自由活动';
                hintSpan.textContent = '可能遇到各种事情';
            }
        }

        // 添加或移除学生会按钮
        let unionBtn = document.getElementById('choice-studentUnion');
        if (player.studentUnion && !unionBtn) {
            unionBtn = document.createElement('button');
            unionBtn.id = 'choice-studentUnion';
            unionBtn.className = 'choice-btn';
            unionBtn.onclick = () => game.makeChoice('studentUnion');
            unionBtn.innerHTML = `
                <span class="choice-icon">🏛️</span>
                <span class="choice-text">学生会工作</span>
                <span class="choice-hint">奉献+ 人脉+</span>
            `;
            container.appendChild(unionBtn);
        } else if (!player.studentUnion && unionBtn) {
            unionBtn.remove();
        }

        // 更新按钮状态
        const buttons = container.querySelectorAll('.choice-btn');
        buttons.forEach(btn => {
            const choiceType = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
            const hintSpan = btn.querySelector('.choice-hint');

            if (choiceType === 'work') {
                btn.disabled = false;
                btn.style.opacity = '1';
                if (hintSpan) hintSpan.textContent = '金钱+ 焦虑+';
            } else if (choiceType === 'social') {
                // 自由活动根据金钱显示不同提示
                if (player.money < 300) {
                    if (hintSpan) hintSpan.textContent = '金钱不足，可能无法出门';
                } else {
                    if (hintSpan) hintSpan.textContent = '随机事件，可能学习技能';
                }
                btn.disabled = false;
                btn.style.opacity = '1';
            } else if (choiceType === 'studentUnion') {
                btn.disabled = false;
                btn.style.opacity = '1';
                if (hintSpan) hintSpan.textContent = '奉献+ 人脉+';
            }
        });
    }

    /**
     * 添加视觉反馈动画
     */
    addVisualFeedback(element, type) {
        const classes = {
            positive: 'pulse',
            negative: 'glitch',
            neutral: ''
        };

        if (classes[type]) {
            element.classList.add(classes[type]);
            setTimeout(() => {
                element.classList.remove(classes[type]);
            }, 500);
        }
    }
}

// 导出UI实例
const ui = new UI();
