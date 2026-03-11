/**
 * 游戏主逻辑模块
 * 协调各个模块，控制游戏流程
 */

class Game {
    constructor() {
        this.player = player;
        this.ui = ui;
        this.data = GameData;
        this.isProcessing = false;
    }

    /**
     * 初始化游戏
     */
    init() {
        // 检查是否有存档
        if (this.player.load()) {
            this.ui.switchScreen('main');
            this.ui.updateStats(this.player);
        } else {
            this.ui.switchScreen('start');
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        this.player.reset();
        this.ui.clearLogs();
        this.ui.switchScreen('major');
    }

    /**
     * 选择专业
     */
    selectMajor(majorId) {
        this.player.selectMajor(majorId);
        this.ui.switchScreen('main');
        this.ui.updateStats(this.player);

        // 显示初始叙事
        this.ui.setAvatarAction('study');
        this.ui.addLog('游戏开始 - 选择了汉语言文学专业');

        // 显示学生会加入弹窗（第一周）
        setTimeout(() => {
            this.showStudentUnionPrompt();
        }, 500);
    }

    /**
     * 显示学生会加入弹窗
     */
    showStudentUnionPrompt() {
        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🏛️ 学生会招新</h3>
            <p style="margin-bottom: 15px;">开学第一周，学生会的学长学姐来宿舍宣传。</p>
            <p style="margin-bottom: 15px;">"加入学生会可以锻炼能力，积累人脉，对以后考公、进央国企都有帮助。"</p>
            <div style="background: #1a1a1a; padding: 10px; margin: 15px 0; font-size: 12px;">
                <strong>提示：</strong><br>
                加入学生会会消耗更多精力（每周额外消耗健康和金钱）<br>
                但可以提升导师关系、增加考公/选调生路线的成功率
            </div>
            <p style="color: #888; font-size: 12px; margin-bottom: 20px;">（如果选择不加入，后续游戏中将不会出现学生会选项）</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="pixel-btn" onclick="game.joinStudentUnion(true)">加入学生会</button>
                <button class="pixel-btn" onclick="game.joinStudentUnion(false)" style="border-color: #666; color: #888;">不加入</button>
            </div>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 处理学生会选择
     */
    joinStudentUnion(join) {
        this.ui.hideModal('custom');
        this.player.studentUnion = join;

        if (join) {
            this.player.studentUnionLevel = 1;
            this.ui.addLog('加入了学生会');
            this.ui.updateNarrative('你填写了报名表，成为了学生会的一名干事。\n\n看着那张登记表，你不知道这是不是一个正确的选择。但至少，你的大学生活似乎有了更多的可能性。');
        } else {
            this.ui.addLog('选择不加入学生会');
            this.ui.updateNarrative('你婉拒了邀请。\n\n"学生会就是给老师打杂的，"室友这样说，"不去也罢。"\n\n你点点头，但心里有点不确定。');
        }

        this.ui.updateStats(this.player);
    }

    /**
     * 玩家做出选择
     */
    makeChoice(choiceId) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // 记录次数（用于触发某些事件）
        if (choiceId === 'relax') {
            this.player.relaxCount = (this.player.relaxCount || 0) + 1;
        } else if (choiceId === 'study') {
            this.player.studyCount = (this.player.studyCount || 0) + 1;
        }

        // 设置像素小人动作
        this.ui.setAvatarAction(choiceId);

        // 记录修改前的数值
        const oldStats = {
            gpa: this.player.gpa,
            academic: this.player.academic,
            anxiety: this.player.anxiety,
            money: this.player.money,
            idealism: this.player.idealism,
            network: this.player.network,
            contribution: this.player.contribution
        };

        // 应用选择效果（返回特殊处理的结果）
        const appliedEffects = this.player.applyChoice(choiceId);

        // 获取叙事文本
        const choiceData = this.data.choices[choiceId];
        let narrative = choiceData ? this.getRandomNarrative(choiceData.narrative) : '';

        // 处理认真学习时的理想变化描述
        if (choiceId === 'study' && appliedEffects.idealismValue !== undefined) {
            const idealismText = this.player.getStudyIdealismText(appliedEffects.idealismValue);
            narrative += '\n\n' + idealismText;
        }

        // 处理自由活动金钱不足的情况
        if (choiceId === 'social' && appliedEffects.noMoney) {
            this.showNoMoneyPrompt(oldStats);
            return;
        }

        // 处理自由活动触发技能事件
        if (choiceId === 'social' && appliedEffects.skillEvent) {
            // 先显示基础结果，然后触发技能事件
            this.showActionResult(choiceId, choiceData, appliedEffects, oldStats, narrative, true);
            return;
        }

        // 检查人脉等级变化
        const networkChange = this.player.checkNetworkLevelChange();
        if (networkChange.changed) {
            this.pendingNetworkChange = networkChange;
        }

        // 检查学生会等级变化
        const unionPromo = this.player.updateStudentUnionLevel();
        if (unionPromo && unionPromo.promoted) {
            this.pendingUnionPromo = unionPromo;
        }

        // 显示结果弹窗
        this.showActionResult(choiceId, choiceData, appliedEffects, oldStats, narrative);
    }

    /**
     * 显示金钱不足提示
     */
    showNoMoneyPrompt(oldStats) {
        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">💸 囊中羞涩</h3>
            <p style="margin-bottom: 20px; line-height: 1.8; text-align: left; padding: 0 20px;">
                你正要出门，突然想到这个月生活费已经所剩无几，最终你还是退回了宿舍，流下眼泪：<br><br>
                <em style="color: #ffb6c1;">"有时宅不是爱好，而是穷……"</em>
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px; color: #888;">
                当前金钱: ¥${this.player.money}
            </div>
            <button class="pixel-btn" onclick="game.closeNoMoneyPrompt()">确定</button>
        `;
        this.ui.showCustomModal(content);
        this.isProcessing = false;
    }

    /**
     * 关闭金钱不足提示
     */
    closeNoMoneyPrompt() {
        this.ui.hideModal('custom');
        // 仍然消耗行动点并推进时间
        this.advanceTime();
    }

    /**
     * 显示行动结果弹窗
     */
    showActionResult(choiceId, choiceData, appliedEffects, oldStats, narrative, hasSkillEvent = false) {
        const player = this.player;

        // 构建数值变化显示
        const changes = [];
        const statNames = {
            gpa: '绩点',
            academic: '专业',
            anxiety: '焦虑',
            money: '金钱',
            idealism: '理想',
            network: '人脉',
            contribution: '奉献值'
        };

        // 显示实际变化的数值
        for (let stat in statNames) {
            const diff = player[stat] - oldStats[stat];
            if (Math.abs(diff) > 0.01) {
                changes.push(`${statNames[stat]} ${diff > 0 ? '+' : ''}${Math.round(diff)}`);
            }
        }

        // 室友关系
        if (player.relations.roommate !== oldStats.relations?.roommate) {
            const diff = player.relations.roommate - (oldStats.relations?.roommate || 0);
            changes.push(`室友关系 ${diff > 0 ? '+' : ''}${Math.round(diff)}`);
        }

        // 特殊标记
        let specialNote = '';
        if (choiceId === 'study' && appliedEffects.idealismValue !== undefined) {
            specialNote = '<div style="color: #ffb6c1; font-size: 11px; margin-top: 5px;">理想变化：' + (appliedEffects.idealismValue > 0 ? '+' : '') + appliedEffects.idealismValue + '</div>';
        }
        if (choiceId === 'social' && appliedEffects.socialResult) {
            specialNote = '<div style="color: #ffb6c1; font-size: 11px; margin-top: 5px;">' + (appliedEffects.socialResult === 1 ? '结果A：休闲放松' : '结果B：社交拓展') + '</div>';
        }

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">${choiceData.icon} ${choiceData.title}</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">${narrative.replace(/\n/g, '<br>')}</p>
            ${specialNote}
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left;">
                <div style="color: #888; font-size: 12px; margin-bottom: 8px;">本次行动影响：</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${changes.map(c => `<span style="background: ${c.includes('-') ? '#331111' : '#113311'}; padding: 3px 8px; font-size: 12px; border-radius: 3px;">${c}</span>`).join('')}
                    ${changes.length === 0 ? '<span style="color: #666; font-size: 12px;">无明显变化</span>' : ''}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #888; margin-bottom: 15px;">
                <div>绩点: ${Math.round(oldStats.gpa)} → ${Math.round(player.gpa)}</div>
                <div>专业: ${Math.round(oldStats.academic)} → ${Math.round(player.academic)}</div>
                <div>焦虑: ${oldStats.anxiety} → ${player.anxiety}</div>
                <div>人脉: ${oldStats.network} → ${player.network}</div>
            </div>
            <button class="pixel-btn" onclick="game.closeActionResult(${hasSkillEvent})">${hasSkillEvent ? '继续' : '确定'}</button>
        `;

        this.ui.showCustomModal(content);
        this.ui.addLog(`${player.getDateString()} - ${choiceData.title}`);
    }

    /**
     * 关闭行动结果弹窗，进入事件处理
     */
    closeActionResult(hasSkillEvent = false) {
        this.ui.hideModal('custom');
        setTimeout(() => {
            if (hasSkillEvent) {
                // 自由活动触发的技能事件
                this.triggerSkillEventFromSocial();
            } else if (this.pendingNetworkChange && this.pendingNetworkChange.changed) {
                // 显示人脉等级变化
                this.showNetworkLevelChange();
            } else if (this.pendingUnionPromo && this.pendingUnionPromo.promoted) {
                // 显示学生会晋升
                this.showUnionPromotion();
            } else {
                this.processActionEnd();
            }
        }, 300);
    }

    /**
     * 显示人脉等级变化弹窗
     */
    showNetworkLevelChange() {
        const change = this.pendingNetworkChange;
        this.pendingNetworkChange = null;

        const rules = this.player.getNetworkLevelRules();
        const rulesText = rules.map((r, i) => {
            const isCurrent = r.includes(change.level.range.split('-')[0]);
            return `<div style="${isCurrent ? 'color: #ff69b4; font-weight: bold;' : 'color: #666;'}">${i + 1}. ${r}</div>`;
        }).join('');

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">${change.up ? '📈' : '📉'} 人脉等级${change.up ? '提升' : '下降'}！</h3>
            <p style="margin-bottom: 15px; font-size: 18px; color: ${change.level.color};">
                当前等级：<strong>${change.level.name}</strong>
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                <div style="color: #888; margin-bottom: 10px;">人脉等级划分规则：</div>
                ${rulesText}
            </div>
            <button class="pixel-btn" onclick="game.closeNetworkLevelChange()">确定</button>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 关闭人脉等级变化弹窗
     */
    closeNetworkLevelChange() {
        this.ui.hideModal('custom');
        setTimeout(() => {
            if (this.pendingUnionPromo && this.pendingUnionPromo.promoted) {
                this.showUnionPromotion();
            } else {
                this.processActionEnd();
            }
        }, 300);
    }

    /**
     * 显示学生会晋升弹窗
     */
    showUnionPromotion() {
        const promo = this.pendingUnionPromo;
        this.pendingUnionPromo = null;

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🏛️ 学生会晋升！</h3>
            <p style="margin-bottom: 15px;">恭喜你获得晋升！</p>
            <p style="font-size: 24px; color: #ffb6c1; margin: 20px 0;">
                ${promo.oldLevel} → ${promo.newLevel}
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px; color: #888;">
                <div>当前奉献值：${this.player.contribution}</div>
                <div style="margin-top: 10px;">学生会等级规则：</div>
                <div>Lv1：底层干事（0-30奉献值）</div>
                <div>Lv2：小干部（30-50奉献值）</div>
                <div>Lv3：部长（50-75奉献值）</div>
                <div>Lv4：部门主席（75-100奉献值）</div>
                <div style="color: #ff69b4;">Lv5：总主席（需90+奉献值，且每学期绩点平均>=85，人脉>=60）</div>
            </div>
            <button class="pixel-btn" onclick="game.closeUnionPromotion()">确定</button>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 关闭学生会晋升弹窗
     */
    closeUnionPromotion() {
        this.ui.hideModal('custom');
        setTimeout(() => {
            this.processActionEnd();
        }, 300);
    }

    /**
     * 自由活动触发的技能事件
     */
    triggerSkillEventFromSocial() {
        const skillEvents = this.player.getSkillLearningEvents();
        if (skillEvents.length > 0) {
            const event = skillEvents[Math.floor(Math.random() * skillEvents.length)];
            this.player.currentEvent = event;
            this.showSkillEvent(event);
            this.ui.addLog(`自由活动触发技能事件: ${event.title}`);
        } else {
            // 没有可用技能事件，直接推进
            this.advanceTime();
        }
    }

    /**
     * 获取随机叙事
     */
    getRandomNarrative(narratives) {
        if (Array.isArray(narratives)) {
            return narratives[Math.floor(Math.random() * narratives.length)];
        }
        return narratives;
    }

    /**
     * 处理行动结束逻辑
     */
    processActionEnd() {
        // 检查随机事件
        const event = this.triggerRandomEvent();

        if (event) {
            // 显示事件弹窗
            if (event.type === 'skill') {
                this.ui.setAvatarAction('event');
                this.showSkillEvent(event);
            } else {
                this.ui.setAvatarAction('event');
                this.ui.showEvent(event);
            }
            this.ui.addLog(`触发事件: ${event.title}`);
        } else {
            // 没有事件，直接推进时间
            this.advanceTime();
        }
    }

    /**
     * 显示考试
     */
    showExam(examType) {
        const result = this.player.getExamResult(examType);

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">📋 ${result.title}</h3>
            <div style="font-size: 48px; margin: 20px 0;">${result.grade}</div>
            <p style="margin-bottom: 20px; line-height: 1.8;">${result.content.replace(/\n/g, '<br>')}</p>
            <div style="background: #1a1a1a; padding: 10px; margin: 15px 0;">
                <div>当前绩点: <span style="color: #ff69b4;">${this.player.gpa.toFixed(2)}</span></div>
                <div>学业水平: <span style="color: #ffb6c1;">${this.player.academic.toFixed(1)}</span></div>
            </div>
            <button class="pixel-btn" onclick="game.closeExam()">确定</button>
        `;

        this.ui.showCustomModal(content);
        this.ui.addLog(`完成${examType === 'midterm' ? '期中' : '期末'}考试，获得${result.grade}`);
    }

    /**
     * 关闭考试弹窗
     */
    closeExam() {
        this.ui.hideModal('custom');
        this.advanceTime();
    }

    /**
     * 显示技能学习事件
     */
    showSkillEvent(event) {
        const currentSkillCount = Object.keys(this.player.skills).length;

        let warning = '';
        if (currentSkillCount >= this.player.maxSkills) {
            warning = `<div style="color: #ff6666; margin: 10px 0;">⚠️ 警告：你的技能槽已满（${currentSkillCount}/${this.player.maxSkills}）！<br>学习新技能需要遗忘一个已有技能。</div>`;
        } else {
            warning = `<div style="color: #888; margin: 10px 0;">技能槽: ${currentSkillCount}/${this.player.maxSkills}</div>`;
        }

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">${event.title}</h3>
            <p style="margin-bottom: 15px; line-height: 1.8;">${event.content.replace(/\n/g, '<br>')}</p>
            ${warning}
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button class="pixel-btn" onclick="game.learnSkill(true)">学习技能</button>
                <button class="pixel-btn" onclick="game.learnSkill(false)" style="border-color: #666; color: #888;">放弃</button>
            </div>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 处理技能学习
     */
    learnSkill(learn) {
        this.ui.hideModal('custom');

        if (learn) {
            const success = this.player.learnSkillFromEvent(true);
            if (success) {
                const event = this.player.currentEvent;
                this.ui.addLog(`学会了新技能: ${event.skillId}`);
                this.ui.updateNarrative(`你决定尝试学习"${event.title.replace(/^.+?\s/, '')}"\n\n虽然不知道这条路会通向哪里，但至少是一个开始。`);
            } else {
                // 技能槽满了，需要选择遗忘
                this.showForgetSkillPrompt();
                return;
            }
        } else {
            this.player.learnSkillFromEvent(false);
            this.ui.updateNarrative('你放弃了这个机会。\n\n"以后再说吧，"你安慰自己。但你知道，机会不是什么时候都有的。');
        }

        this.ui.updateStats(this.player);
        this.advanceTime();
    }

    /**
     * 显示遗忘技能提示
     */
    showForgetSkillPrompt() {
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

        let skillsHtml = '';
        for (let skillId in this.player.skills) {
            const level = this.player.skills[skillId];
            const levelName = this.player.getSkillLevelName(level);
            skillsHtml += `<button class="pixel-btn" onclick="game.forgetAndLearn('${skillId}')" style="margin: 5px;">${skillNames[skillId] || skillId} (${levelName})</button>`;
        }

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🔄 技能槽已满</h3>
            <p style="margin-bottom: 15px;">你需要遗忘一个已有技能才能学习新技能。</p>
            <p style="margin-bottom: 15px; color: #888;">选择要遗忘的技能：</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                ${skillsHtml}
            </div>
            <button class="pixel-btn" onclick="game.forgetAndLearn(null)" style="margin-top: 15px; border-color: #666; color: #888;">取消</button>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 遗忘技能并学习新技能
     */
    forgetAndLearn(skillToForget) {
        this.ui.hideModal('custom');

        if (skillToForget) {
            this.player.forgetSkill(skillToForget);
            this.ui.addLog(`遗忘了技能: ${skillToForget}`);

            // 现在学习新技能
            const success = this.player.learnSkillFromEvent(true);
            if (success) {
                const event = this.player.currentEvent;
                this.ui.addLog(`学会了新技能: ${event.skillId}`);
                this.ui.updateNarrative(`你决定放弃原来的技能，学习"${event.title.replace(/^.+?\s/, '')}"\n\n有时候，放弃也是一种选择。`);
            }
        } else {
            // 取消学习
            this.player.learnSkillFromEvent(false);
            this.ui.updateNarrative('你最终没有做出改变。\n\n也许保守一点更安全，但你心里有些遗憾。');
        }

        this.ui.updateStats(this.player);
        this.advanceTime();
    }

    /**
     * 触发随机事件
     */
    triggerRandomEvent() {
        const possibleEvents = this.data.getPossibleEvents(this.player);

        if (possibleEvents.length > 0) {
            const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

            // 应用事件效果
            if (event.effects) {
                for (let stat in event.effects) {
                    this.player.modifyStat(stat, event.effects[stat]);
                }
            }

            // 记录已触发
            this.player.eventsTriggered.push(event.id);

            return event;
        }

        return null;
    }

    /**
     * 关闭事件弹窗，进入下一周
     */
    closeEvent() {
        this.ui.hideModal('event');
        this.advanceTime();
    }

    /**
     * 推进时间
     */
    advanceTime() {
        this.isProcessing = false;

        // 推进时间并检查结果
        const timeResult = this.player.advanceTime();

        // 检查结局（可能因焦虑或期末成绩触发）
        const ending = this.player.checkEnding(timeResult.exam);
        if (ending) {
            this.showEnding(ending);
            return;
        }

        // 检查考试
        if (timeResult.exam) {
            this.showExam(timeResult.exam);
            return;
        }

        // 检查学生会总主席竞选资格（大三年级3月前）
        if (this.player.studentUnion && this.player.year === 3 && this.player.monthIndex < 5) {
            if (this.player.canRunForPresident()) {
                this.showPresidentElectionPrompt();
                return;
            }
        }

        // 寒假期间技能事件触发率增加
        if (this.player.isWinterBreak && Math.random() < 0.4) {
            this.triggerSkillEvent();
            return;
        }

        // 更新UI
        this.ui.updateStats(this.player);
        this.ui.updateChoiceButtons(this.player);

        // 显示日期提示
        if (timeResult.newMonth) {
            this.ui.addLog(`===== 进入${this.player.months[this.player.monthIndex]} =====`);
            if (timeResult.winterBreak) {
                this.ui.addLog('🎉 寒假开始！有更多时间培养技能');
            }
        }
    }

    /**
     * 触发技能事件（寒假专用）
     */
    triggerSkillEvent() {
        const skillEvents = this.player.getSkillLearningEvents();
        if (skillEvents.length > 0) {
            const event = skillEvents[Math.floor(Math.random() * skillEvents.length)];
            this.player.currentEvent = event;
            this.showSkillEvent(event);
            this.ui.addLog(`寒假触发技能事件: ${event.title}`);
        }
    }

    /**
     * 显示总主席竞选弹窗
     */
    showPresidentElectionPrompt() {
        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🏆 总主席竞选</h3>
            <p style="margin-bottom: 15px; line-height: 1.8;">你已达到竞选总主席的资格！</p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                <div style="color: #888; margin-bottom: 10px;">竞选条件：</div>
                <div style="color: ${this.player.contribution >= 90 ? '#90ee90' : '#ff6666'};">
                    ${this.player.contribution >= 90 ? '✓' : '✗'} 奉献值≥90（当前: ${this.player.contribution}）
                </div>
                <div style="color: ${this.player.gpa >= 85 ? '#90ee90' : '#ff6666'};">
                    ${this.player.gpa >= 85 ? '✓' : '✗'} 每学期绩点平均≥85（当前: ${Math.round(this.player.gpa)}）
                </div>
                <div style="color: ${this.player.network >= 60 ? '#90ee90' : '#ff6666'};">
                    ${this.player.network >= 60 ? '✓' : '✗'} 人脉≥"口口相传"（当前: ${this.player.network}）
                </div>
            </div>
            <p style="margin: 15px 0; font-size: 13px; color: #888;">是否参加总主席竞选？</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="pixel-btn" onclick="game.runForPresident(true)">参加竞选</button>
                <button class="pixel-btn" onclick="game.runForPresident(false)" style="border-color: #666; color: #888;">放弃</button>
            </div>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 处理总主席竞选
     */
    runForPresident(run) {
        this.ui.hideModal('custom');
        if (run) {
            this.player.studentUnionLevel = 5;
            this.ui.addLog('成功竞选为学生会总主席！');
            this.ui.updateNarrative('经过激烈的竞选，你成功当选为学生会总主席！\n\n这是对你四年奉献的最好回报。');
        } else {
            this.ui.addLog('放弃了总主席竞选');
            this.ui.updateNarrative('你决定不参加竞选。\n\n"有时候，知足也是一种智慧。"你对自己说。');
        }
        this.ui.updateStats(this.player);
        setTimeout(() => {
            this.processActionEnd();
        }, 300);
    }

    /**
     * 显示结局
     */
    showEnding(ending) {
        const stats = this.player.getFinalStats();
        this.ui.showEnding(ending, stats);
        this.ui.addLog(`游戏结束 - 结局: ${ending.title}`);
    }

    /**
     * 重新开始
     */
    restart() {
        this.player.reset();
        this.ui.clearLogs();
        this.ui.switchScreen('start');
    }

    /**
     * 存档
     */
    saveGame() {
        if (this.player.save()) {
            this.ui.addLog('💾 游戏已存档');
            alert('游戏已保存！');
        } else {
            alert('存档失败，请重试');
        }
    }

    /**
     * 显示游戏说明
     */
    showIntro() {
        this.ui.showModal('intro');
    }

    /**
     * 关闭游戏说明
     */
    closeIntro() {
        this.ui.hideModal('intro');
    }
}

// 创建游戏实例并导出
const game = new Game();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
