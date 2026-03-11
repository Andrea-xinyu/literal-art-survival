/**
 * 玩家状态管理模块
 * 管理玩家属性、时间进度、存档等功能
 */

class Player {
    constructor() {
        this.reset();
    }

    /**
     * 重置玩家状态（新游戏）
     */
    reset() {
        // 基础信息
        this.major = null;           // 专业
        this.year = 1;               // 年级 (1-4)
        this.monthIndex = 0;         // 月份索引 (0-5: 9月-2月)
        this.day = 3;                // 日期 (每月从3日开始)
        this.semester = 1;           // 学期 (1-2: 上学期/寒假)
        this.totalActions = 0;       // 总行动次数
        this.actionsLeft = 10;       // 本月剩余行动点

        // 月份配置 (9月-2月)
        this.months = ['9月', '10月', '11月', '12月', '1月', '2月'];
        this.daysInMonth = [30, 31, 30, 31, 31, 28];  // 每月天数
        this.isWinterBreak = false;  // 是否在寒假

        // 经济状况
        this.money = 2000;           // 当前金钱
        this.monthlyIncome = 1500;   // 月生活费

        // 精神状态 (0-100)
        this.anxiety = 30;           // 焦虑值
        this.idealism = 80;          // 理想主义值

        // 技能系统 (最多3个技能槽)
        // 技能等级: 1-3初级, 4-6中级, 7-9高级, 10大师
        this.skills = {};
        this.maxSkills = 3;          // 最大技能数
        this.skillSlots = [];        // 已装备的技能列表

        // 专业水平 (0-100 百分制) - 决定每学期刷新后的绩点
        this.academic = 30;          // 学业水平起始30

        // 绩点系统 (百分制，起始70分)
        this.gpa = 70;               // 绩点 (0-100)

        // 学生会状态
        this.studentUnion = false;   // 是否加入学生会
        this.studentUnionLevel = 1;  // 学生会等级 (1-5)
        this.contribution = 0;       // 学生会奉献值

        // 社交关系
        // 室友关系 (0-100, 6个阶段)
        this.relations = {
            roommate: 40    // 开局陌生人(40)
        };

        // 人脉属性 (0-100+, 8个等级)
        this.network = 25;           // 开局人脉25
        this.previousNetworkLevel = this.getNetworkLevelIndex(25);  // 记录上一个人脉等级

        // 学业表现
        this.credits = 0;            // 学分

        // 隐藏属性
        this.luck = 50;              // 运气 (0-100)

        // 游戏记录
        this.history = [];           // 历史选择
        this.eventsTriggered = [];   // 已触发事件
        this.flags = {};             // 剧情标记

        // 状态
        this.currentEvent = null;    // 当前事件
        this.actionLog = [];         // 行动日志

        // 计数器
        this.relaxCount = 0;         // 躺平次数（用于触发某些事件）
        this.studyCount = 0;         // 学习次数
    }

    /**
     * 获取人脉等级索引
     */
    getNetworkLevelIndex(value) {
        if (value < 10) return 0;
        if (value < 20) return 1;
        if (value < 30) return 2;
        if (value < 40) return 3;
        if (value < 60) return 4;
        if (value < 90) return 5;
        if (value < 100) return 6;
        return 7;
    }

    /**
     * 获取人脉等级名称
     */
    getNetworkLevelName(value) {
        if (value < 10) return { name: '全校厌恶', color: '#ff0000', range: '0-10' };
        if (value < 20) return { name: '查无此人', color: '#ff4444', range: '10-20' };
        if (value < 30) return { name: '路人一枚', color: '#ffaa00', range: '20-30' };
        if (value < 40) return { name: '偶有耳闻', color: '#ffdd00', range: '30-40' };
        if (value < 60) return { name: '小有名气', color: '#fff', range: '40-60' };
        if (value < 90) return { name: '口口相传', color: '#88ff88', range: '60-90' };
        if (value < 100) return { name: '全校皆知', color: '#44ff44', range: '90-100' };
        return { name: '大网红', color: '#ff69b4', range: '100+' };
    }

    /**
     * 检查人脉等级变化
     */
    checkNetworkLevelChange() {
        const currentLevelIndex = this.getNetworkLevelIndex(this.network);
        if (currentLevelIndex !== this.previousNetworkLevel) {
            const isUp = currentLevelIndex > this.previousNetworkLevel;
            const currentLevel = this.getNetworkLevelName(this.network);
            this.previousNetworkLevel = currentLevelIndex;
            return { changed: true, up: isUp, level: currentLevel };
        }
        return { changed: false };
    }

    /**
     * 获取人脉等级规则文本
     */
    getNetworkLevelRules() {
        return [
            '全校厌恶（0-10）',
            '查无此人（10-20）',
            '路人一枚（20-30）',
            '偶有耳闻（30-40）',
            '小有名气（40-60）',
            '口口相传（60-90）',
            '全校皆知（90-100）',
            '大网红（100+）'
        ];
    }

    /**
     * 获取学生会等级名称
     */
    getStudentUnionLevelName(level) {
        if (level >= 5) return '总主席';
        if (level >= 4) return '部门主席';
        if (level >= 3) return '部长';
        if (level >= 2) return '小干部';
        return '底层干事';
    }

    /**
     * 更新学生会等级（基于奉献值）
     */
    updateStudentUnionLevel() {
        if (!this.studentUnion) return null;

        const oldLevel = this.studentUnionLevel;
        // 根据奉献值确定等级
        if (this.contribution >= 100) {
            this.studentUnionLevel = 4;  // 部门主席
        } else if (this.contribution >= 75) {
            this.studentUnionLevel = 3;  // 部长
        } else if (this.contribution >= 50) {
            this.studentUnionLevel = 2;  // 小干部
        } else if (this.contribution >= 30) {
            this.studentUnionLevel = 1;  // 底层干事(升级)
        } else {
            this.studentUnionLevel = 1;  // 底层干事(初始)
        }

        if (this.studentUnionLevel > oldLevel) {
            return {
                promoted: true,
                oldLevel: this.getStudentUnionLevelName(oldLevel),
                newLevel: this.getStudentUnionLevelName(this.studentUnionLevel)
            };
        }
        return null;
    }

    /**
     * 检查是否可以竞选总主席
     */
    canRunForPresident() {
        // 大三年级3月前，贡献值>=90，绩点平均值>=85，人脉>=60(口口相传)
        return this.contribution >= 90 &&
               this.gpa >= 85 &&
               this.network >= 60;
    }

    /**
     * 选择专业
     * @param {string} majorId - 专业ID
     */
    selectMajor(majorId) {
        this.major = majorId;

        // 根据专业调整初始学业水平
        const majorAcademicBonus = {
            chinese: 1.5
        };

        this.academic = majorAcademicBonus[majorId] || 3.0;

        // 设置初始绩点
        this.refreshGPA();
    }

    /**
     * 获取当前日期字符串
     */
    getDateString() {
        return `大一${this.months[this.monthIndex]}${this.day}日`;
    }

    /**
     * 推进时间（一次行动）
     * @returns {Object} 时间变化信息
     */
    advanceTime() {
        this.actionsLeft--;
        this.totalActions++;

        // 每过三天（一次行动）消耗180金钱
        this.money -= 180;
        if (this.money < 0) this.money = 0;

        const result = {
            newMonth: false,
            exam: null,
            winterBreak: false
        };

        // 检查是否进入下个月
        if (this.actionsLeft <= 0) {
            this.actionsLeft = 10;
            this.day = 3;  // 每月从3日开始
            this.monthIndex++;

            // 检查是否是考试月
            if (this.monthIndex === 2) {  // 11月 - 期中
                result.exam = 'midterm';
            } else if (this.monthIndex === 3) {  // 12月 - 期末
                result.exam = 'final';
            }

            // 检查是否进入寒假 (1月)
            if (this.monthIndex === 4) {  // 1月
                this.isWinterBreak = true;
                result.winterBreak = true;
            }

            // 检查是否结束游戏 (2月底)
            if (this.monthIndex >= 5) {
                result.endGame = true;
            }

            // 每月发放生活费
            this.money += this.monthlyIncome;
            this.addLog(`收到生活费 ¥${this.monthlyIncome}`);

            // 新学期刷新绩点
            if (this.monthIndex === 0 || this.monthIndex === 3) {
                this.refreshGPA();
            }

            result.newMonth = true;
        } else {
            // 推进日期（每次行动推进约3天）
            this.day += 3;
            const maxDay = this.daysInMonth[this.monthIndex];
            if (this.day > maxDay) {
                this.day = maxDay;
            }
        }

        return result;
    }

    /**
     * 根据专业水平刷新绩点（百分制）
     * 专业<50: 70分, 50-75: 80分, >75: 90分
     */
    refreshGPA() {
        let baseGPA;
        if (this.academic < 50) {
            baseGPA = 70;
        } else if (this.academic <= 75) {
            baseGPA = 80;
        } else {
            baseGPA = 90;
        }
        this.gpa = baseGPA;
    }

    /**
     * 获取技能等级名称
     */
    getSkillLevelName(value) {
        if (value >= 10) return '大师';
        if (value >= 7) return '高级';
        if (value >= 4) return '中级';
        return '初级';
    }

    /**
     * 学习新技能
     * @param {string} skillId - 技能ID
     * @param {number} initialValue - 初始值
     * @returns {boolean} 是否成功学习
     */
    learnSkill(skillId, initialValue = 1) {
        // 检查是否已拥有此技能
        if (this.skills[skillId]) {
            // 已拥有，提升等级
            this.skills[skillId] = Math.min(10, this.skills[skillId] + initialValue);
            return true;
        }

        // 检查是否有空技能槽
        if (Object.keys(this.skills).length >= this.maxSkills) {
            return false; // 技能槽已满
        }

        // 学习新技能
        this.skills[skillId] = initialValue;
        this.skillSlots.push(skillId);
        return true;
    }

    /**
     * 遗忘技能（为学习新技能腾出位置）
     */
    forgetSkill(skillId) {
        if (this.skills[skillId]) {
            delete this.skills[skillId];
            this.skillSlots = this.skillSlots.filter(s => s !== skillId);
            return true;
        }
        return false;
    }

    /**
     * 推进时间（一周）
     * @returns {boolean} 是否进入新学期
     */
    advanceWeek() {
        this.week++;
        this.totalWeeks++;

        // 每月发放生活费（每4周）
        if (this.week % 4 === 0) {
            this.money += this.monthlyIncome;
            this.addLog(`收到生活费 ¥${this.monthlyIncome}`);
        }

        // 学期结束
        if (this.week > 16) {
            this.week = 1;
            this.semester++;

            // 年级提升（每2学期）
            if (this.semester % 2 === 1) {
                this.year++;
            }

            this.addLog(`===== 进入大${this.getYearName()}第${this.semester % 2 === 0 ? 2 : 1}学期 =====`);
            return true; // 新学期
        }

        return false;
    }

    /**
     * 获取年级中文名
     */
    getYearName() {
        const names = ['', '一', '二', '三', '四'];
        return names[this.year] || '四';
    }

    /**
     * 修改属性值（带边界检查）
     */
    modifyStat(stat, value) {
        if (stat === 'money') {
            this.money += value;
            if (this.money < 0) this.money = 0;
        } else if (stat === 'anxiety') {
            this.anxiety += value;
            this.anxiety = Math.max(0, Math.min(100, this.anxiety));
        } else if (stat === 'idealism') {
            this.idealism += value;
            this.idealism = Math.max(0, Math.min(100, this.idealism));
        } else if (stat === 'academic') {
            this.academic += value;
            this.academic = Math.max(0, Math.min(100, this.academic));
        } else if (stat === 'gpa') {
            this.gpa += value;
            this.gpa = Math.max(0, Math.min(100, this.gpa));
        } else if (stat === 'network') {
            this.network += value;
            // 人脉可以超过100
            if (this.network < 0) this.network = 0;
        } else if (stat === 'contribution') {
            this.contribution += value;
            if (this.contribution < 0) this.contribution = 0;
        } else if (stat.startsWith('skills.')) {
            const skillId = stat.split('.')[1];
            // 自动学习技能（如果有空槽）或提升已有技能
            if (this.skills[skillId]) {
                this.skills[skillId] += value;
                this.skills[skillId] = Math.max(1, Math.min(10, this.skills[skillId]));
            } else if (Object.keys(this.skills).length < this.maxSkills) {
                this.learnSkill(skillId, Math.max(1, value));
            }
        } else if (stat.startsWith('relations.')) {
            const relation = stat.split('.')[1];
            if (this.relations[relation] !== undefined) {
                this.relations[relation] += value;
                this.relations[relation] = Math.max(0, Math.min(100, this.relations[relation]));
            }
        }
    }

    /**
     * 执行选择的效果
     * @param {string} choiceId - 选择ID
     */
    applyChoice(choiceId) {
        const appliedEffects = this.applyChoiceEffects(choiceId);

        // 记录历史
        this.history.push({
            week: this.totalWeeks,
            choice: choiceId,
            effects: appliedEffects
        });

        return appliedEffects;
    }

    /**
     * 获取选择的效果
     * 新数值规则（百分制）
     */
    getChoiceEffects(choiceId) {
        const effects = {
            study: {
                'gpa': 2,              // 绩点+2
                'academic': 1,         // 专业+1
                'anxiety': 5,          // 焦虑+5
                'network': -1,         // 人脉-1
                'idealism': 'random'   // 理想随机+1/+2/+3/-3
            },
            social: {
                'gpa': 'random_money', // 根据金钱决定
                'anxiety': 'random_money',
                'money': 'random_money',
                'relations.roommate': 5,
                'idealism': 8,
                'network': 2
            },
            work: {
                'gpa': -1,             // 绩点-1
                'anxiety': 8,          // 焦虑+8
                'money': 300,          // 金钱+300
                'idealism': -5,        // 理想-5
                'network': 2           // 人脉+2
            },
            relax: {
                'gpa': -1,             // 绩点-1
                'anxiety': -10,        // 焦虑-10
                'idealism': -2,        // 理想-2
                'network': -1          // 人脉-1
            },
            studentUnion: {
                'gpa': -1,             // 绩点-1
                'anxiety': 5,          // 焦虑+5
                'idealism': -3,        // 理想-3
                'contribution': 5,     // 奉献值+5
                'network': 2           // 人脉+2
            }
        };

        return effects[choiceId] || {};
    }

    /**
     * 应用选择效果（处理特殊效果如随机值）
     */
    applyChoiceEffects(choiceId) {
        const effects = this.getChoiceEffects(choiceId);
        const appliedEffects = {};  // 记录实际应用的效果值

        for (let stat in effects) {
            let value = effects[stat];

            // 处理认真学习时的理想随机变化
            if (choiceId === 'study' && stat === 'idealism' && value === 'random') {
                const rand = Math.random();
                if (rand < 0.25) {
                    value = 1;
                } else if (rand < 0.5) {
                    value = 2;
                } else if (rand < 0.75) {
                    value = 3;
                } else {
                    value = -3;
                }
                appliedEffects['idealismValue'] = value;
            }

            // 处理自由活动的两种结果
            if (choiceId === 'social') {
                if (this.money < 300) {
                    // 金钱不足，不出门
                    appliedEffects['noMoney'] = true;
                    continue;
                }
                // 30%概率触发技能事件（在game.js中处理）
                if (Math.random() < 0.3) {
                    appliedEffects['skillEvent'] = true;
                } else {
                    // 70%概率：随机选择两种结果之一
                    if (Math.random() < 0.5) {
                        // 结果1：绩点-1，焦虑-20，金钱-200，室友+5，理想+8，人脉+2
                        appliedEffects['socialResult'] = 1;
                        this.modifyStat('gpa', -1);
                        this.modifyStat('anxiety', -20);
                        this.modifyStat('money', -200);
                        this.modifyStat('relations.roommate', 5);
                        this.modifyStat('idealism', 8);
                        this.modifyStat('network', 2);
                    } else {
                        // 结果2：绩点+3，焦虑-10，金钱-300，理想+4，人脉+3
                        appliedEffects['socialResult'] = 2;
                        this.modifyStat('gpa', 3);
                        this.modifyStat('anxiety', -10);
                        this.modifyStat('money', -300);
                        this.modifyStat('idealism', 4);
                        this.modifyStat('network', 3);
                    }
                }
                continue;
            }

            // 应用普通数值
            if (typeof value === 'number') {
                this.modifyStat(stat, value);
            }
        }

        return appliedEffects;
    }

    /**
     * 获取认真学习时的理想变化描述
     */
    getStudyIdealismText(value) {
        if (value === 1) {
            return '学到深夜，你突然明白了一个困扰已久的概念，内心涌起一丝成就感。理想主义+1';
        } else if (value === 2) {
            return '教授的讲解让你茅塞顿开，你仿佛看到了学术之路的光明前景。理想主义+2';
        } else if (value === 3) {
            return '你在图书馆发现了一本改变你世界观的书，那种震撼让你热泪盈眶。理想主义+3';
        } else {
            return '看着堆积如山的作业，你不禁怀疑：这些知识真的能改变什么吗？理想主义-3';
        }
    }

    /**
     * 触发随机事件
     */
    triggerRandomEvent() {
        // 从数据中获取随机事件
        const event = this.getRandomEventFromData();

        if (!event) return null;

        // 记录已触发（技能事件在学习后才记录）
        if (event.type !== 'skill') {
            this.eventsTriggered.push(event.id);
        }

        this.currentEvent = event;
        return event;
    }

    /**
     * 学习技能（由UI调用）
     */
    learnSkillFromEvent(learn) {
        const event = this.currentEvent;
        if (!event || event.type !== 'skill') return false;

        if (learn) {
            // 学习技能
            const success = this.learnSkill(event.skillId, event.initialValue || 1);
            if (success) {
                // 应用事件效果
                if (event.effects) {
                    for (let stat in event.effects) {
                        this.modifyStat(stat, event.effects[stat]);
                    }
                }
                this.addLog(`学会了新技能: ${event.skillId}`);
            }
            this.eventsTriggered.push(event.id);
            return success;
        } else {
            // 放弃学习
            this.eventsTriggered.push(event.id);
            this.addLog(`放弃了学习: ${event.skillId}`);
            return true;
        }
    }

    /**
     * 获取可能发生的事件
     */
    getPossibleEvents() {
        return [];
    }

    /**
     * 从GameData获取随机事件（包括技能学习事件）
     */
    getRandomEventFromData() {
        // 使用GameData中的事件池
        const allEvents = this.getAllPossibleEvents();

        if (allEvents.length === 0) return null;

        // 随机选择一个事件
        const event = allEvents[Math.floor(Math.random() * allEvents.length)];
        return event;
    }

    /**
     * 获取所有可能的事件（包括技能学习事件）
     */
    getAllPossibleEvents() {
        const allEvents = [];

        // 基础事件池
        const baseEvents = [
            {
                id: 'late_for_class',
                title: '上课迟到',
                content: '你睡过头了，赶到教室时老师已经开始讲课。你偷偷从后门溜进去，但还是被点名了。',
                condition: () => this.health < 60,
                effects: { 'anxiety': 5, 'relations.professor': -5 },
                type: 'normal'
            },
            {
                id: 'existential_crisis',
                title: '存在危机',
                content: '刷到计算机专业同学的offer，月薪是你预期的三倍。你开始怀疑自己的选择...',
                condition: () => this.anxiety > 50,
                effects: { 'anxiety': 10, 'idealism': -10 },
                type: 'normal'
            },
            {
                id: 'roommate_conflict',
                title: '宿舍矛盾',
                content: '室友晚上打游戏到三点，你终于忍不住爆发了。场面一度很尴尬。',
                condition: () => this.anxiety > 60 && this.relations.roommate < 40,
                effects: { 'relations.roommate': -15, 'anxiety': -5, 'health': -5 },
                type: 'normal'
            },
            {
                id: 'family_pressure',
                title: '家里来电',
                content: '妈妈问你毕业打算干什么，你说还在考虑。电话那头沉默了三秒。',
                condition: () => this.week > 8,
                effects: { 'anxiety': 15, 'idealism': -5 },
                type: 'normal'
            }
        ];

        // 过滤并添加基础事件
        baseEvents.forEach(event => {
            if (!this.eventsTriggered.includes(event.id)) {
                if (!event.condition || event.condition()) {
                    allEvents.push(event);
                }
            }
        });

        // 技能学习事件 - 只有在有空技能槽时才可能触发
        if (Object.keys(this.skills).length < this.maxSkills) {
            const skillEvents = this.getSkillLearningEvents();
            allEvents.push(...skillEvents);
        }

        return allEvents;
    }

    /**
     * 获取技能学习事件
     */
    getSkillLearningEvents() {
        const skillEvents = [
            {
                id: 'learn_writing',
                title: '📝 发现写作天赋',
                content: '你在社团公众号投了一篇稿子，反响不错。编辑问你要不要定期供稿。\n\n【是否学习"写作"技能？】\n\n初级写作可以接文案兼职，高级可以出版书籍。',
                skillId: 'writing',
                initialValue: 2,
                condition: () => this.week > 2 && this.idealism > 40,
                effects: { 'anxiety': -2 },
                type: 'skill'
            },
            {
                id: 'learn_coding',
                title: '💻 转码诱惑',
                content: '室友在学Python，问你要不要一起。网上都说"转码是文科生最好的出路"。\n\n【是否学习"代码"技能？】\n\n初级可以写简单脚本，高级可以做全栈开发。',
                skillId: 'coding',
                initialValue: 1,
                condition: () => this.anxiety > 40,
                effects: { 'anxiety': 5, 'idealism': -3 },
                type: 'skill'
            },
            {
                id: 'learn_media',
                title: '📱 自媒体机会',
                content: '你发的吐槽日常突然小爆了，有人私信问接不接推广。\n\n【是否学习"自媒体"技能？】\n\n初级可以接小广告，高级可以成为KOL。',
                skillId: 'media',
                initialValue: 2,
                condition: () => this.week > 3,
                effects: { 'money': 100 },
                type: 'skill'
            },
            {
                id: 'learn_art',
                title: '🎨 绘画副业',
                content: '你在二手群看到有人在约头像稿，一张50-200不等。你想起自己小时候学过画画。\n\n【是否学习"绘画"技能？】\n\n初级可以接头像稿，高级可以接商业插画。',
                skillId: 'art',
                initialValue: 1,
                condition: () => this.money < 1500,
                effects: { 'money': -100 },
                type: 'skill'
            },
            {
                id: 'learn_cosplay',
                title: '👘 漫展奇遇',
                content: '室友拉你去漫展，你出了个简单角色，被好几个摄影拍，还有人问接不接委托。\n\n【是否学习"Cosplay"技能？】\n\n初级可以接本地委托，高级可以当职业coser。',
                skillId: 'cosplay',
                initialValue: 1,
                condition: () => this.week > 4 && this.relations.roommate > 30,
                effects: { 'money': -200, 'relations.roommate': 5 },
                type: 'skill'
            },
            {
                id: 'learn_gaming',
                title: '🎮 代肝机会',
                content: '你在游戏公会被大佬私聊："你打得不错，要不要代肝？一单50-100。"\n\n【是否学习"游戏代肝"技能？】\n\n初级可以代日常，高级可以代打高难本/陪玩。',
                skillId: 'gaming',
                initialValue: 2,
                condition: () => this.relaxCount > 3,
                effects: { 'health': -5 },
                type: 'skill'
            },
            {
                id: 'learn_divination',
                title: '🔮 神秘学入门',
                content: '你在小红书发了条塔罗测试结果，评论区好多人求私占。你发现自己好像有点天赋。\n\n【是否学习"占卜"技能？】\n\n初级可以线上接占，高级可以开课教学。',
                skillId: 'divination',
                initialValue: 1,
                condition: () => this.idealism > 60,
                effects: { 'idealism': 5 },
                type: 'skill'
            },
            {
                id: 'learn_tutoring',
                title: '📚 家教机会',
                content: '你在学校论坛看到有人找语文家教，时薪80。你觉得可以试试。\n\n【是否学习"家教"技能？】\n\n初级可以教小学初中，高级可以教高中/竞赛。',
                skillId: 'tutoring',
                initialValue: 2,
                condition: () => this.academic > 2,
                effects: {},
                type: 'skill'
            },
            {
                id: 'learn_english',
                title: '🌍 英语提升',
                content: '你在闲鱼看到有人找英语陪练，时薪100。你四六级都过了，想试试。\n\n【是否学习"英语"技能？】\n\n初级可以做陪练，高级可以做翻译/同传。',
                skillId: 'english',
                initialValue: 2,
                condition: () => this.week > 3,
                effects: {},
                type: 'skill'
            },
            {
                id: 'learn_photography',
                title: '📷 摄影入门',
                content: '室友买了相机让你当模特，拍完后你觉得很有意思，借了相机拍了校园。\n\n【是否学习"摄影"技能？】\n\n初级可以接毕业照/活动跟拍，高级可以接商业拍摄。',
                skillId: 'photography',
                initialValue: 1,
                condition: () => this.relations.roommate > 40,
                effects: { 'money': -300 },
                type: 'skill'
            },
            {
                id: 'learn_design',
                title: '🎨 设计接单',
                content: '社团要做海报，你自告奋勇用Canva做了一个，居然还不错。有人问你接不接单。\n\n【是否学习"设计"技能？】\n\n初级可以做海报/PPT，高级可以做品牌设计。',
                skillId: 'design',
                initialValue: 1,
                condition: () => this.week > 2,
                effects: {},
                type: 'skill'
            },
            {
                id: 'learn_civil_service',
                title: '🏛️ 考公念头',
                content: '家里来电话，说表哥考公上岸了，五险一金齐全，工作稳定。爸妈问你要不要试试。\n\n【是否学习"考公"技能？】\n\n需要长期准备，上岸后进入体制内。',
                skillId: 'civilService',
                initialValue: 1,
                condition: () => this.anxiety > 60 || this.week > 10,
                effects: { 'anxiety': 3 },
                type: 'skill'
            }
        ];

        return skillEvents.filter(event => {
            if (this.eventsTriggered.includes(event.id)) return false;
            if (this.skills[event.skillId]) return false; // 已学会
            if (event.condition && !event.condition()) return false;
            return true;
        });
    }

    /**
     * 添加日志
     */
    addLog(message) {
        const weekStr = `大${this.getYearName()}第${this.week}周`;
        this.weekLog.push(`[${weekStr}] ${message}`);

        // 限制日志数量
        if (this.weekLog.length > 50) {
            this.weekLog.shift();
        }
    }

    /**
     * 清空本周日志
     */
    clearWeekLog() {
        this.weekLog = [];
    }

    /**
     * 检查是否是考试周
     */
    checkExamWeek() {
        // 期中：第8周
        // 期末：第16周
        if (this.week === 8) return 'midterm';
        if (this.week === 16) return 'final';
        return null;
    }

    /**
     * 获取考试结果（百分制）
     */
    getExamResult(examType) {
        const academic = this.academic;
        let result = {};

        if (examType === 'midterm') {
            // 期中考试
            if (academic >= 60) {
                result = {
                    grade: 'A',
                    title: '期中考试成绩优秀',
                    content: '你的期中论文得到了老师的高度评价，被当作范例在班上朗读。\n\n同学们向你投来复杂的目光，有羡慕，也有"卷王"的窃窃私语。\n\n绩点+5',
                    gpaBonus: 5,
                    effects: { 'idealism': 5, 'anxiety': -3 }
                };
            } else if (academic >= 40) {
                result = {
                    grade: 'B',
                    title: '期中考试成绩良好',
                    content: '你的成绩在班级中等偏上，老师批语"有进步空间"。\n\n不突出也不落后，就像你这个人一样。\n\n绩点+3',
                    gpaBonus: 3,
                    effects: { 'anxiety': 2 }
                };
            } else if (academic >= 20) {
                result = {
                    grade: 'C',
                    title: '期中考试成绩及格',
                    content: '你低空飘过，老师说"下次要努力"。\n\n你知道自己没怎么认真，但总觉得还可以再拖一拖。\n\n绩点+1',
                    gpaBonus: 1,
                    effects: { 'anxiety': 5, 'idealism': -3 }
                };
            } else {
                result = {
                    grade: 'D',
                    title: '期中考试不及格',
                    content: '你挂了。\n\n看着那个刺眼的分数，你陷入了深深的自我怀疑：是我太笨，还是这个专业不适合我？\n\n绩点-2',
                    gpaBonus: -2,
                    effects: { 'anxiety': 15, 'idealism': -8 }
                };
            }
        } else {
            // 期末考试
            if (academic >= 80) {
                result = {
                    grade: 'A+',
                    title: '期末考试成绩优异',
                    content: '你拿到了全班前10%，老师主动问你要不要考虑保研。\n\n爸妈在电话里喜极而泣，你终于成为了"别人家的孩子"。\n\n绩点+8',
                    gpaBonus: 8,
                    effects: { 'idealism': 10, 'anxiety': -5, 'money': 500 }
                };
            } else if (academic >= 60) {
                result = {
                    grade: 'B+',
                    title: '期末考试成绩良好',
                    content: '你考得不错，在班级中上游。\n\n虽然不够亮眼，但也对得起这一学期的努力。\n\n绩点+5',
                    gpaBonus: 5,
                    effects: { 'anxiety': -2 }
                };
            } else if (academic >= 40) {
                result = {
                    grade: 'B',
                    title: '期末考试成绩中等',
                    content: '你勉强过关，成绩平平无奇。\n\n你安慰自己：大学不挂科就是胜利。\n\n绩点+3',
                    gpaBonus: 3,
                    effects: { 'anxiety': 3 }
                };
            } else if (academic >= 20) {
                result = {
                    grade: 'C',
                    title: '期末考试成绩及格',
                    content: '你踩着及格线过了，感谢老师的"不杀之恩"。\n\n假期里你要好好想想，下学期还要这样混过去吗？\n\n绩点+1',
                    gpaBonus: 1,
                    effects: { 'anxiety': 8, 'idealism': -5 }
                };
            } else {
                result = {
                    grade: 'F',
                    title: '期末考试不及格',
                    content: '你挂科了。\n\n这意味着你要补考，甚至可能影响毕业。\n\n爸妈来电话时，你撒了谎。\n\n绩点-5',
                    gpaBonus: -5,
                    effects: { 'anxiety': 20, 'idealism': -10, 'relations.family': -10 }
                };
            }
        }

        // 应用效果
        if (result.effects) {
            for (let stat in result.effects) {
                this.modifyStat(stat, result.effects[stat]);
            }
        }

        // 更新GPA（百分制）
        this.gpa = Math.max(0, Math.min(100, this.gpa + result.gpaBonus));

        return result;
    }

    /**
     * 检查是否满足结局条件
     */
    checkEnding(examResult) {
        // 焦虑崩溃退学
        if (this.anxiety >= 100) {
            return {
                id: 'anxiety_dropout',
                title: '精神崩溃',
                icon: '😵',
                content: `你患上了严重的焦虑症、抑郁症和双向情感障碍。

每天早上醒来，你感到的只有无尽的恐惧和绝望。你无法起床，无法吃饭，无法与人交流。学业？工作？未来？这些词语对你而言就像来自另一个世界的噪音。

在辅导员的反复建议下，你办理了休学手续，随后转为退学。爸妈没有责怪你，只是默默地帮你收拾行李。

你离开学校的那天，天气很好，但你只觉得刺眼。`,
                tags: ['心理健康', '需要治疗', '重新开始']
            };
        }

        // 期末绩点过低退学（百分制：<60分退学）
        if (examResult && examResult === 'final' && this.gpa < 60) {
            return {
                id: 'gpa_dropout',
                title: '挂科太多被退学',
                icon: '📉',
                content: `在中国大学挂这么多科也是一种实力。

当学业警告通知书送到你手上时，你才意识到问题的严重性。但你已经没有补救的机会了——学校规定，连续两学期绩点低于60分将被退学处理。

你试图申诉，试图找老师求情，但一切都无济于事。

你成为了家里第一个被大学退学的人。年夜饭时，亲戚们问起你的学业，爸妈只能尴尬地笑一笑。

你开始了打工生涯，在奶茶店、便利店、外卖站之间流转。偶尔你会梦见自己还在学校上课，醒来后枕头总是湿的。`,
                tags: ['学业失败', '重新开始', '艰难求生']
            };
        }

        // 正常结束（到2月底）
        if (this.monthIndex >= 5) {
            return this.calculateEnding();
        }

        return null;
    }

    /**
     * 计算结局
     */
    calculateEnding() {
        const endings = [];

        // 根据已学技能判定结局
        const skills = this.skills;

        // 转码结局
        if (skills.coding >= 5) {
            endings.push({
                id: 'coder',
                title: '转码成功',
                content: `你利用课余时间自学编程，最终拿到了一家互联网公司的offer。虽然专业不对口，但你的代码能力得到了认可。起薪12k，在同学中算是不错的了。

同事们问你大学学的什么，你说"汉语言文学"。他们露出惊讶的表情，然后说："怪不得你文档写得这么好。"

你已经成功地从文科生变成了"伪理科生"。`,
                tags: ['自救成功', '技术路线', '高薪']
            });
        }

        // 自媒体/KOL结局
        if (skills.media >= 6) {
            endings.push({
                id: 'influencer',
                title: '自媒体博主',
                content: `你的账号粉丝突破了10万，开始接到品牌广告。虽然收入不稳定，好的时候一个月能有两三万，差的时候只有几千。

你成为了学弟学妹眼中的"成功人士"，只有你知道自己每天为数据焦虑到失眠。

"文科生最好的出路是做自媒体"，你在视频里这样说。`,
                tags: ['自媒体', '收入波动大', '表面光鲜']
            });
        }

        // 写作结局
        if (skills.writing >= 6) {
            endings.push({
                id: 'writer',
                title: '自由撰稿人',
                content: `你坚持写作，在各种平台积累了一定的粉丝。虽然收入不稳定，但你靠接文案、写专栏勉强能养活自己。

你的文章《一个文科生的自救》获得了不少共鸣。有人在评论区问："写作能养活自己吗？"

你回复："不能，但快乐。"

发完这条评论，你看了看这个月的账单，叹了口气。`,
                tags: ['理想主义', '自由职业', '穷困潦倒但快乐']
            });
        }

        // 考公上岸
        if (skills.civilService >= 6) {
            endings.push({
                id: 'civil_servant',
                title: '体制内上岸',
                content: `经过无数次模考和刷题，你终于考上了家乡的公务员。

月薪5k，五险一金齐全，工作稳定。爸妈终于松了一口气，在亲戚面前也有了谈资。

你的工作很无聊，每天写材料、开会、应付检查。但你也明白，在这个时代，"无聊"本身就是一种幸运。

偶尔你也会想起大学时的文学梦，然后继续写下一篇"关于贯彻落实XX精神的报告"。`,
                tags: ['体制内', '稳定', '父母满意']
            });
        }

        // 考公失败（学了但不够）
        if (skills.civilService && skills.civilService < 6) {
            endings.push({
                id: 'civil_failed',
                title: '考公落榜',
                content: `你花了大量时间准备考公，但竞争太激烈了。

你报考的岗位报录比是300:1，你考了第15名，连面试都没进。

看着其他人上岸，你开始怀疑自己：是我还不够努力，还是这条路本来就不适合我？

你决定再考一年，但心里也没底。`,
                tags: ['二战预备', '迷茫', '继续努力']
            });
        }

        // 艺术相关结局
        if (skills.art >= 5 || skills.photography >= 5 || skills.design >= 5) {
            endings.push({
                id: 'artist',
                title: '独立创作者',
                content: `你靠接单维持生计，头像、插画、摄影、设计...什么活儿都接。

收入时高时低，客户有的很好说话，有的改稿改到你想杀人。

但你至少在做自己喜欢的事情，虽然有时候也会怀疑"喜欢"是不是被高估了。

"搞艺术的，饿不死就行，"你安慰自己。`,
                tags: ['自由职业', '创作', '收入不稳定']
            });
        }

        // 家教/教育
        if (skills.tutoring >= 5 || skills.english >= 5) {
            endings.push({
                id: 'tutor',
                title: '教培从业者',
                content: `你进了一家教培机构，教初高中语文/英语。

工作很累，周末和晚上最忙，但收入还不错，好的时候能月入过万。

你学会了和家长打交道，学会了怎么让学生续费，学会了在高压下保持微笑。

"老师"这个称呼你已经听惯了，虽然你觉得自己更像是销售员。`,
                tags: ['教育行业', '高压', '收入尚可']
            });
        }

        // 游戏代肝结局
        if (skills.gaming >= 5) {
            endings.push({
                id: 'gamer',
                title: '游戏代练',
                content: `你成为了一名全职代练，每天打十几个小时游戏。

收入还可以，但颈椎和腰椎都出了问题，视力也下降得厉害。

你把爱好变成了工作，现在看到游戏就想吐。

"这是我应得的，"你想，"至少不用写文案了。"`,
                tags: ['游戏产业', '伤身', '爱好变工作']
            });
        }

        // 学生会/考公路线
        if (this.studentUnion && this.studentUnionLevel >= 3) {
            endings.push({
                id: 'student_union',
                title: '选调生',
                content: `凭借学生会的经历和不错的成绩，你考上了选调生。

这是公务员中的"精英路线"，起点比普通公务员高，晋升空间也更大。

回想起那些在学生会熬夜写材料、办活动的夜晚，你觉得值了。

你终于理解了那句话："学生会不是白干的。"`,
                tags: ['体制内', '精英路线', '学生会没白干']
            });
        }

        // 焦虑崩溃结局
        if (this.anxiety >= 80) {
            endings.push({
                id: 'burnout',
                title: '精神内耗',
                content: `你的焦虑已经到了无法自控的地步。失眠、暴食、对什么都提不起兴趣。你办理了休学，回家休养。

爸妈看着你欲言又止，最后只说："先把身体养好，其他的以后再说。"

你躺在家里，刷着招聘软件，不知道未来在哪里。

有时候你想，也许当初不读大学会更好？但你已经没有退路了。`,
                tags: ['需要休息', '心理健康', '暂停一下']
            });
        }

        // 躺平结局（没有突出技能）
        if (Object.keys(skills).length === 0 ||
            (Object.keys(skills).length > 0 && Math.max(...Object.values(skills)) < 4)) {
            endings.push({
                id: 'lay_flat',
                title: '灵活就业',
                content: `大学四年，你没有特别突出的技能，也没有找到明确的方向。毕业后，你成为了一名"灵活就业者"——其实就是没有固定工作。

今天做家教，明天发传单，后天帮朋友写个文案。收入时有时无，但你学会了用"躺平"来安慰自己。

"至少我还活着，"你对自己说，"而且精神状态还行。"

其实你也想努力，只是不知道往哪个方向努力。`,
                tags: ['生存模式', '未找到方向', '仍在探索']
            });
        }

        // 默认结局
        if (endings.length === 0) {
            endings.push({
                id: 'ordinary',
                title: '普通文科生',
                content: `你和大多数文科生一样，平平淡淡地度过了大学四年。绩点一般，技能一般，人脉一般。

毕业时你海投简历，最后进了一家小公司做行政。月薪4k，五险一金按最低标准交。

有时候你会想，如果当初多做点什么，现在会不会不一样。

但更多的时候，你只是埋头做着手头的工作，告诉自己：先活着吧。

"也许以后会好起来的。"你对自己说，虽然你自己也不太相信。`,
                tags: ['芸芸众生', '还在努力', 'Survival模式']
            });
        }

        // 返回第一个匹配的结局（优先级排序）
        return endings[0];
    }

    /**
     * 获取最终统计
     */
    getFinalStats() {
        return {
            money: this.money,
            anxiety: this.anxiety,
            idealism: this.idealism,
            skills: { ...this.skills },
            totalWeeks: this.totalWeeks,
            choicesMade: this.history.length
        };
    }

    /**
     * 存档
     */
    save() {
        const data = {
            major: this.major,
            year: this.year,
            monthIndex: this.monthIndex,
            day: this.day,
            semester: this.semester,
            totalActions: this.totalActions,
            actionsLeft: this.actionsLeft,
            money: this.money,
            monthlyIncome: this.monthlyIncome,
            anxiety: this.anxiety,
            idealism: this.idealism,
            skills: this.skills,
            skillSlots: this.skillSlots,
            maxSkills: this.maxSkills,
            academic: this.academic,
            gpa: this.gpa,
            relations: this.relations,
            network: this.network,
            previousNetworkLevel: this.previousNetworkLevel,
            studentUnion: this.studentUnion,
            studentUnionLevel: this.studentUnionLevel,
            contribution: this.contribution,
            isWinterBreak: this.isWinterBreak,
            history: this.history,
            eventsTriggered: this.eventsTriggered,
            flags: this.flags,
            relaxCount: this.relaxCount || 0,
            studyCount: this.studyCount || 0
        };

        localStorage.setItem('liberalArtsSurvival_save', JSON.stringify(data));
        return true;
    }

    /**
     * 读档
     */
    load() {
        const data = localStorage.getItem('liberalArtsSurvival_save');
        if (!data) return false;

        try {
            const saved = JSON.parse(data);
            Object.assign(this, saved);
            // 确保新属性存在
            if (!this.skills) this.skills = {};
            if (!this.skillSlots) this.skillSlots = [];
            if (!this.maxSkills) this.maxSkills = 3;
            if (!this.academic) this.academic = 30;
            if (!this.gpa) this.gpa = 70;
            if (this.studentUnion === undefined) this.studentUnion = false;
            if (!this.studentUnionLevel) this.studentUnionLevel = 1;
            if (!this.contribution) this.contribution = 0;
            if (!this.network) this.network = 25;
            if (this.previousNetworkLevel === undefined) this.previousNetworkLevel = this.getNetworkLevelIndex(this.network || 25);
            if (!this.months) this.months = ['9月', '10月', '11月', '12月', '1月', '2月'];
            if (!this.daysInMonth) this.daysInMonth = [30, 31, 30, 31, 31, 28];
            return true;
        } catch (e) {
            console.error('存档读取失败:', e);
            return false;
        }
    }
}

// 导出玩家实例
const player = new Player();
