/**
 * UI控制器模块
 * 负责界面渲染和更新
 */

class UI {
    constructor() {
        this.screens = {
            opening: document.getElementById('opening-screen'),
            start: document.getElementById('start-screen'),
            main: document.getElementById('main-screen'),
            ending: document.getElementById('ending-screen')
        };

        this.modals = {
            intro: document.getElementById('intro-modal'),
            major: document.getElementById('major-modal'),
            welcome: document.getElementById('welcome-modal'),
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
            <div class="modal-content">
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
        // 日期显示（大一上学期 9月3日格式）
        const dateEl = document.getElementById('year');
        if (dateEl) dateEl.textContent = player.getDateString();

        // 行动点显示
        const actionsEl = document.getElementById('actions-left');
        if (actionsEl) {
            actionsEl.textContent = player.actionsLeft;
            if (player.actionsLeft <= 3) {
                actionsEl.parentElement.classList.add('low');
            } else {
                actionsEl.parentElement.classList.remove('low');
            }
        }

        // 金钱
        const moneyEl = document.getElementById('money');
        if (moneyEl) moneyEl.textContent = `¥${player.money}`;

        // 绩点
        const gpaEl = document.getElementById('gpa-display');
        if (gpaEl) gpaEl.textContent = Math.round(player.gpa);

        // 焦虑值
        const anxietyBar = document.getElementById('anxiety-bar');
        const anxietyValue = document.getElementById('anxiety-value');
        if (anxietyBar) anxietyBar.style.width = `${player.anxiety}%`;
        if (anxietyValue) anxietyValue.textContent = `${player.anxiety}%`;

        // 理想主义值
        const idealismBar = document.getElementById('idealism-bar');
        const idealismValue = document.getElementById('idealism-value');
        if (idealismBar) idealismBar.style.width = `${player.idealism}%`;
        if (idealismValue) idealismValue.textContent = `${player.idealism}%`;

        // 技能显示
        const skillsDisplay = document.getElementById('skills-display');
        if (skillsDisplay) {
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
                civilService: '考公',
                thinking: '思辨'
            };
            const skillList = Object.entries(player.skills);
            if (skillList.length === 0) {
                skillsDisplay.innerHTML = '<span class="empty-skill">暂无技能</span>';
            } else {
                skillsDisplay.innerHTML = skillList.map(([id, level]) => {
                    const levelName = player.getSkillLevelName ? player.getSkillLevelName(level) : `Lv${level}`;
                    return `<span class="skill-tag">${skillNames[id] || id}<span class="skill-level">${levelName}</span></span>`;
                }).join('');
            }
        }

        // 人脉进度条
        const networkBar = document.getElementById('network-bar');
        const networkValue = document.getElementById('network-value');
        const networkLevelName = document.getElementById('network-level-name');
        if (networkBar) networkBar.style.width = `${Math.min(100, player.network)}%`;
        if (networkValue) networkValue.textContent = `${player.network}/100`;
        if (networkLevelName && player.getNetworkLevel) {
            const level = player.getNetworkLevel(player.network);
            networkLevelName.textContent = level.name;
        }
    }

    /**
     * 设置动作状态
     */
    setAvatarAction(action) {
        // 新UI没有像素小人，但可以在这里添加其他视觉反馈
        console.log('Action:', action);
    }

    /**
     * 更新叙事文本
     */
    updateNarrative(text) {
        const element = document.getElementById('narrative-text');
        if (element) {
            element.innerHTML = text.replace(/\n/g, '<br>');
        }
    }

    /**
     * 显示事件弹窗
     */
    showEvent(event) {
        const content = `
            <h3>${event.title}</h3>
            <p>${event.content.replace(/\n/g, '<br>')}</p>
            <button class="game-btn primary" onclick="game.closeEvent()">确定</button>
        `;
        this.showCustomModal(content);
    }

    /**
     * 添加日志到叙事区（带彩色样式）
     * @param {Object} options - 日志选项
     *   - action: 行动类型 (study/social/work/relax/studentUnion/practice)
     *   - title: 行动标题
     *   - narrative: 叙事文本
     *   - changes: 数值变化数组 [{name, value, oldValue, newValue}]
     *   - date: 日期字符串
     */
    addLog(options) {
        const element = document.getElementById('narrative-text');
        if (!element) return;

        // 行动类型对应的颜色
        const actionColors = {
            study: '#c9a227',      // 金色 - 学习
            social: '#4fc9c9',     // 青色 - 社交
            work: '#90ee90',       // 绿色 - 工作
            relax: '#ff69b4',      // 粉色 - 休息
            studentUnion: '#ff69b4', // 粉色 - 学生会
            practice: '#dda0dd',   // 紫色 - 钻研技能
            event: '#ffa500',      // 橙色 - 事件
            default: '#888'
        };

        const color = actionColors[options.action] || actionColors.default;

        // 构建数值变化HTML
        let changesHtml = '';
        if (options.changes && options.changes.length > 0) {
            const changeItems = options.changes.map(change => {
                const isPositive = change.value > 0;
                const changeColor = isPositive ? '#90ee90' : '#ff6666';
                const sign = isPositive ? '+' : '';
                return `<span style="color: ${changeColor}; margin-right: 12px;">${change.name}${sign}${change.value}</span>`;
            }).join('');
            changesHtml = `<div style="margin-top: 6px; font-size: 12px;">${changeItems}</div>`;
        }

        // 构建日志条目
        const dateStr = options.date || '';
        const dateHtml = dateStr ? `<span style="color: #666; font-size: 11px;">[${dateStr}]</span> ` : '';

        const logEntry = `
            <div style="margin: 12px 0; padding: 10px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border-left: 3px solid ${color};">
                <div style="color: ${color}; font-weight: bold; font-size: 13px; margin-bottom: 4px;">
                    ${dateHtml}${options.title || '行动'}
                </div>
                ${options.narrative ? `<div style="color: #ccc; font-size: 12px; line-height: 1.6; margin: 6px 0;">${options.narrative.replace(/\n/g, '<br>')}</div>` : ''}
                ${changesHtml}
            </div>
        `;

        // 添加到叙事区顶部（最新的在前面）
        element.innerHTML = logEntry + element.innerHTML;

        // 限制日志条目数量（保留最近30条）
        const entries = element.querySelectorAll(':scope > div');
        if (entries.length > 30) {
            for (let i = 30; i < entries.length; i++) {
                entries[i].remove();
            }
        }
    }

    /**
     * 添加简单日志（向后兼容）
     */
    addSimpleLog(message) {
        const element = document.getElementById('narrative-text');
        if (element) {
            const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            const logEntry = `<div style="color: #888; font-size: 11px; margin: 4px 0; border-left: 2px solid #ff69b4; padding-left: 8px;">[${timeStr}] ${message}</div>`;
            element.innerHTML = logEntry + element.innerHTML;
        }
        console.log('[Log]', message);
    }

    /**
     * 清空日志
     */
    clearLogs() {
        console.log('[Logs cleared]');
    }

    /**
     * 显示结局
     */
    showEnding(ending, stats) {
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
            civilService: '考公',
            thinking: '思辨'
        };

        let skillsHtml = '';
        if (Object.keys(stats.skills).length > 0) {
            skillsHtml = '<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #2a2a2a;">';
            skillsHtml += '<div style="font-size: 12px; color: #888; margin-bottom: 8px;">掌握技能</div>';
            for (let skillId in stats.skills) {
                const level = stats.skills[skillId];
                const levelName = level >= 7 ? '高级' : level >= 4 ? '中级' : '初级';
                skillsHtml += `<div style="font-size: 12px; margin: 4px 0;">${skillNames[skillId] || skillId}: ${levelName}</div>`;
            }
            skillsHtml += '</div>';
        }

        const content = `
            <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">${ending.icon || '🎓'}</div>
                <h3 style="margin-bottom: 8px;">${ending.title}</h3>
                <p style="font-size: 13px; line-height: 1.7; color: #888; margin-bottom: 24px; text-align: left;">
                    ${ending.content.replace(/\n/g, '<br>')}
                </p>
                <div style="background: #1a1a1a; padding: 16px; text-align: left; font-size: 12px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>资金: ¥${stats.money}</div>
                        <div>焦虑: ${stats.anxiety}%</div>
                        <div>理想: ${stats.idealism}%</div>
                        <div>绩点: ${Math.round(stats.gpa || 0)}</div>
                    </div>
                    ${skillsHtml}
                </div>
                <button class="game-btn primary" onclick="game.restart()">再来一局</button>
            </div>
        `;

        this.showCustomModal(content);
    }

    /**
     * 更新选择按钮状态
     */
    updateChoiceButtons(player) {
        const container = document.getElementById('choice-buttons');
        if (!container) return;

        // 添加或移除学生会按钮
        let unionBtn = document.getElementById('choice-studentUnion');
        if (player.studentUnion && !unionBtn) {
            unionBtn = document.createElement('button');
            unionBtn.id = 'choice-studentUnion';
            unionBtn.className = 'choice-btn';
            unionBtn.style.borderColor = 'var(--accent)';
            unionBtn.onclick = () => game.makeChoice('studentUnion');
            unionBtn.innerHTML = `
                <span class="choice-text">学生会工作</span>
                <span class="choice-hint">奉献+ 人脉+</span>
            `;
            container.appendChild(unionBtn);
        } else if (!player.studentUnion && unionBtn) {
            unionBtn.remove();
        }

        // 更新自由活动提示
        const socialBtn = Array.from(container.querySelectorAll('.choice-btn')).find(
            btn => btn.getAttribute('onclick')?.includes('social')
        );
        if (socialBtn) {
            const hintSpan = socialBtn.querySelector('.choice-hint');
            if (hintSpan) {
                if (player.money < 300) {
                    hintSpan.textContent = '金钱不足';
                    socialBtn.style.opacity = '0.6';
                } else {
                    hintSpan.textContent = '人脉↑ 随机事件';
                    socialBtn.style.opacity = '1';
                }
            }
        }
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
