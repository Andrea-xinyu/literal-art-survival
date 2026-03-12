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
        this.monthlySummaryShown = false;  // 本月度总结是否已显示

        // 技能学习叙事文案
        this.skillNarratives = {
            writing: {
                learn: '你决定接受公众号编辑的邀请，开始定期供稿。\n\n刚开始写得很慢，一篇稿子要改七八遍。但渐渐地，你找到了自己的节奏——什么标题能吸引人点进来，什么开头能让人读下去，什么时候该抛出一个金句让读者转发。\n\n你开始理解，写作不只是表达，更是沟通。你的文字在别人手机里划过，留下那么几秒钟的共鸣，这就够了。',
                forget: '你把文档一个个关闭，删除了那些为了阅读量而写的标题党文章。\n\n"写作应该是纯粹的，"你对自己说，"不是为了十万加，而是为了说出真正重要的话。"\n\n也许以后没人看你的文章了，但至少，你找回了自己写字的初心。'
            },
            coding: {
                learn: '你下载了Python，跟着教程敲下了第一行"Hello World"。\n\n报错。改。再报错。再改。终于运行成功的那一刻，你对着黑框框傻笑了好久。\n\n室友说你一个文科生学什么代码，你说："听说这是最好的出路。"但内心深处，你其实是想证明——我也可以。',
                forget: '你卸载了Python，删除了那些写着注释的.py文件。\n\n"我不是学这个的料，"你承认道，"而且，也许我不需要成为程序员才能活下去。"\n\n屏幕上的代码消失了，但那些逻辑思维的训练，已经悄悄改变了你看世界的方式。'
            },
            media: {
                learn: '你认真研究了那些爆款内容的规律——什么时间点发，怎么写钩子，怎么引导互动。\n\n你的粉丝数慢慢涨了起来，从几百到几千，再到上万。评论区开始有人叫"博主"，有人问你接不接推广。\n\n你看着自己创造的内容被算法推送给成千上万人，既兴奋又恐惧：他们喜欢的，到底是真实的我，还是表演出来的那个我？',
                forget: '你把那些精心策划的内容都删了，账号设为私密。\n\n"我不想再讨好算法了，"你说，"每一条内容都要考虑会不会火，太累了。"\n\n粉丝数停止增长的那一刻，你感到一阵轻松。也许真正的表达，本来就不该有KPI。'
            },
            art: {
                learn: '你重新拾起了画笔，从最简单的头像开始练起。\n\n第一张稿子只收了30块，对方还要求改了三遍。但你没有放弃，一张接一张地画，从头像到半身到插画。\n\n当你的画能让陌生人说出"这就是我想要的"时，那种成就感比任何分数都真实。艺术不是无用，只是它的价值不能拿工资衡量。',
                forget: '你收起了画板，把颜料送给了社团的学弟妹。\n\n"画得再好，也养不活自己，"你苦笑着，"也许真正的艺术，确实不该被当成谋生工具。"\n\n但深夜翻到自己曾经的作品，你还是会停下来看很久。那些色彩还在你心里，只是暂时被收起来了。'
            },
            cosplay: {
                learn: '你第一次出cos去漫展，紧张得手心全是汗。但当你被认出来是哪个角色，当有人找你合影，当评论区有人喊"神仙coser"——你突然找到了一种奇怪的归属感。\n\n原来在这个世界里，扮演别人反而能让你成为自己。你学会了做道具、修假发、后期修图，每一样都是从头学起。\n\n这不是不务正业，这是你为自己开辟的小天地。',
                forget: '你把cos服挂上了闲鱼，假发收进了箱底。\n\n"玩够了，该长大了，"你对自己说。但看到漫展的宣传海报，你心里还是会动一下。\n\n那些为了还原角色熬夜修道具的日子，那些被人认出来时的雀跃，都是真的。只是现在，你要去扮演一个叫"成年人"的角色了。'
            },
            gaming: {
                learn: '你接下了第一单代肝，帮一个上班族清游戏日常。\n\n从此你的生活分成两半：白天是上课的学生，晚上是别人账号里的"打工仔"。你熟悉每一个副本的机制，每一个角色的配装，每一个时间点的最优路线。\n\n有人说这是在浪费生命，但你算了一笔账：一个月能多赚几百块，而且打游戏总比发传单强。',
                forget: '你把代肝群都退了，删除了那些记录满老板需求的便签。\n\n"我不想再为了别人的账号熬夜了，"你说，"游戏应该是快乐的，不是工作。"\n\n重新用自己的账号登录游戏的那一刻，你发现原来不赶时间地探索一个地图，是这么轻松的事。'
            },
            divination: {
                learn: '你买了一副塔罗牌，开始认真地学习每一张牌的含义。\n\n刚开始只是给朋友随便算算，后来居然真的有人付费来问。你惊讶地发现，很多人来占卜不是为了知道未来，只是为了有人倾听。\n\n你在解读牌面的过程中，学会了观察人性，学会了说既不绝对又不敷衍的话。这是一门古老的技术，而你是它在现代的传承者之一。',
                forget: '你把塔罗牌收进了抽屉最深处，删除了那些占卜群。\n\n"我不能靠这个谋生，"你理智地分析，"而且，也许不应该用别人的焦虑来赚钱。"\n\n但你依然会记得那些深夜的倾诉，那些你说中了对方心事时TA惊讶的眼神。有些东西的价值，本来就不该用金钱衡量。'
            },
            tutoring: {
                learn: '你站在讲台上，看着下面那个走神的中学生。\n\n你想起自己也曾是这样，觉得课本上的东西枯燥无味。于是你试着把知识点编进故事里，用他们听得懂的语言解释。当孩子突然"哦"了一声说"我懂了"的时候，你体会到了一种做老师的快乐。\n\n你的专业也许就业困难，但至少，你可以把它教给下一代。',
                forget: '你拒绝了那个长期家教的邀请，把参考书送给了别人。\n\n"我不适合做老师，"你承认，"每次看到学生走神，我都会想起那个曾经在课堂上发呆的自己。"\n\n但你知道，那些你真正教会的东西，会以某种方式留在他们心里。教育就是这样，播下的种子，不知道什么时候会发芽。'
            },
            english: {
                learn: '你重新捡起了英语，从背单词开始，每天听BBC、看TED。\n\n刚开始很痛苦，一段话要查十几个词。但慢慢地，你能听懂原声电影了，能和外国人简单对话了，能在闲鱼接到陪练的单子了。\n\n你意识到语言是一扇门，打开之后，你能看到更大的世界。那些外文资料、原版书籍、国际视野，都不再是遥不可及的东西。',
                forget: '你把单词APP卸载了，英文书收进了书架最上层。\n\n"反正不出国，学那么好干嘛，"你安慰自己。但看到那些中英文混杂的招聘信息，你心里还是会有点遗憾。\n\n语言是一种肌肉记忆，长时间不用就会退化。但那些你曾经读懂过的文字，那些你能听懂的对话，都是真实存在过的证明。'
            },
            photography: {
                learn: '你借来的相机很重，举久了手腕会酸。但当你透过取景框看世界，一切都变得不一样了——光有了形状，影有了层次，平凡的场景突然有了故事感。\n\n你开始在校园里到处拍，给同学拍写真，接毕业照的单子。每一次按下快门，都是在捕捉时间的一个切片。\n\n你学会了观察光线，学会了等待时机，学会了在混乱的场景里找到那个决定性的瞬间。',
                forget: '你把相机还给了室友，删掉了电脑里那些Lightroom预设。\n\n"器材太贵了，而且，"你看着那些没约到拍的空档期，"这不是一个稳定的工作。"\n\n但你还是会习惯性地观察光线，看到好看的场景时下意识地举起并不存在的相机。有些习惯，一旦养成就很难改掉。'
            },
            design: {
                learn: '你从Canva开始，学着排版、配色、选字体。\n\n第一张海报被甲方退了五遍，你差点放弃。但当成品终于被认可，当你的设计出现在活动现场、朋友圈、甚至路边灯箱上时，那种成就感无法形容。\n\n你开始理解，设计不是"好看就行"，而是解决问题。每一个像素的位置，都有它的意义。',
                forget: '你卸载了设计软件，把作品集文件夹拖进了回收站。\n\n"我不是设计师，"你对自己说，"那些规范、网格、色彩理论，本来就不属于我。"\n\n但看到街边那些丑得离谱的海报，你还是会下意识地想：如果让我来做，我会换一种字体，调整一下行距……有些眼光，一旦打开就回不去了。'
            },
            civilService: {
                learn: '你买了行测和申论的教材，开始每天刷题。\n\n这些题目很枯燥——言语理解、数量关系、判断推理、资料分析。但你告诉自己，这是为了稳定，为了五险一金，为了"上岸"。\n\n你加入了考公群，大家互相分享资料、吐槽题目、祈祷上岸。在这个不确定的世界里，考公成了你抓住的一根稻草。',
                forget: '你把那堆教材卖给了二手书店，退出了所有考公群。\n\n"我不想过那种一眼望到头的生活，"你说，"即使稳定，那也不是我想要的。"\n\n但看到那些上岸的同学晒工作证，你心里还是会晃一下。在这个不确定的世界里，放弃确定的选项，需要很大的勇气。'
            }
        };
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
        this.isProcessing = false; // 重置处理状态
        this.monthlySummaryShown = false; // 重置月度总结标记
        // 显示开场动画
        this.showOpeningScene();
    }

    /**
     * 显示开场动画
     */
    showOpeningScene() {
        this.ui.switchScreen('opening');

        const openingTexts = [
            "你选了文科。",
            "不是因为数学不好。",
            "是因为你相信，语言能抵达数字到不了的地方。",
            "后来你发现，",
            "那个地方叫做——就业市场的边缘。",
            "",
            "这是一个关于「理想与现实」的游戏。",
            "关于在一个不太需要你的世界里，",
            "找到一个需要你的理由。"
        ];

        const openingTextEl = document.getElementById('opening-text');
        const openingScreen = document.getElementById('opening-screen');
        let currentLine = 0;
        this.openingSkipped = false;
        this.openingTimers = [];

        // 清除之前的点击事件
        openingScreen.onclick = null;

        const clearOpeningTimers = () => {
            this.openingTimers.forEach(timer => clearTimeout(timer));
            this.openingTimers = [];
        };

        const finishOpening = () => {
            if (this.openingSkipped) return;
            this.openingSkipped = true;
            clearOpeningTimers();
            openingScreen.onclick = null;
            this.ui.switchScreen('start');
            this.showMajorSelection();
        };

        // 点击跳过
        openingScreen.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            finishOpening();
        };

        // 键盘跳过
        const keyHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                document.removeEventListener('keydown', keyHandler);
                finishOpening();
            }
        };
        document.addEventListener('keydown', keyHandler);
        this.openingTimers.push(setTimeout(() => {
            document.removeEventListener('keydown', keyHandler);
        }, openingTexts.length * 1200 + 3000));

        const showNextLine = () => {
            if (this.openingSkipped) return;

            if (currentLine < openingTexts.length) {
                const line = openingTexts[currentLine];
                if (line === "") {
                    openingTextEl.innerHTML += "<br>";
                } else {
                    const isHighlight = line.includes('理想与现实') || line.includes('就业市场的边缘');
                    const lineClass = isHighlight ? 'highlight' : '';
                    openingTextEl.innerHTML += `<div class="${lineClass}" style="opacity: 0; transition: opacity 1s ease;">${line}</div>`;
                    // 触发动画
                    const timer = setTimeout(() => {
                        if (this.openingSkipped) return;
                        const lines = openingTextEl.querySelectorAll('div');
                        if (lines[lines.length - 1]) {
                            lines[lines.length - 1].style.opacity = '1';
                        }
                    }, 50);
                    this.openingTimers.push(timer);
                }
                currentLine++;
                const timer = setTimeout(showNextLine, 1200);
                this.openingTimers.push(timer);
            } else {
                // 开场白结束，显示专业选择
                const timer = setTimeout(() => {
                    finishOpening();
                }, 2000);
                this.openingTimers.push(timer);
            }
        };

        openingTextEl.innerHTML = '';
        const startTimer = setTimeout(showNextLine, 500);
        this.openingTimers.push(startTimer);
    }

    /**
     * 显示专业选择
     */
    showMajorSelection() {
        this.ui.showModal('major');
    }

    /**
     * 选择专业
     */
    selectMajor(majorId) {
        this.ui.hideModal('major');
        this.player.selectMajor(majorId);
        this.ui.switchScreen('main');
        this.ui.updateStats(this.player);

        // 重置处理状态，确保游戏可以正常进行
        this.isProcessing = false;

        // 显示初始叙事
        this.ui.addLog('游戏开始 - 选择了汉语言文学专业');
        this.ui.updateNarrative('你拖着行李箱走进校园，看着来来往往的人群，心中充满了期待和忐忑。\n\n接下来四年，你会成为什么样的人呢？');

        // 显示入学弹窗
        setTimeout(() => {
            this.ui.showModal('welcome');
        }, 500);
    }

    /**
     * 开始新手引导
     */
    startTutorial() {
        this.ui.hideModal('welcome');

        // 引导步骤
        this.tutorialSteps = [
            {
                element: '.date-display',
                position: 'bottom',
                content: '这里是日期显示，记录你在大学的时光。每次行动会推进3天左右。'
            },
            {
                element: '.core-stats',
                position: 'bottom',
                content: '这是你的核心属性：生活费、绩点、焦虑和理想。保持平衡很重要。'
            },
            {
                element: '.narrative-box',
                position: 'top',
                content: '这里是故事叙述区，你的选择和遭遇会在这里呈现。'
            },
            {
                element: '.study-btn',
                position: 'top',
                content: '认真学习：提升绩点，但会增加焦虑。'
            },
            {
                element: '.social-btn',
                position: 'top',
                content: '自由活动：提升人脉，可能触发随机事件。'
            },
            {
                element: '.work-btn',
                position: 'top',
                content: '找份兼职：赚取生活费，但会消耗精力。'
            },
            {
                element: '.relax-btn',
                position: 'top',
                content: '躺平娱乐：降低焦虑，但可能让理想褪色。'
            },
            {
                element: null,
                position: 'center',
                content: '每次行动消耗120元生活费。如果钱不够了，你只能回家，但会付出代价。'
            }
        ];

        this.currentTutorialStep = 0;
        this.showTutorialStep();
    }

    /**
     * 显示当前引导步骤
     */
    showTutorialStep() {
        if (this.currentTutorialStep >= this.tutorialSteps.length) {
            // 引导结束
            this.endTutorial();
            return;
        }

        const step = this.tutorialSteps[this.currentTutorialStep];
        const overlay = document.getElementById('tutorial-overlay');
        const tooltip = document.getElementById('tutorial-tooltip');

        overlay.classList.remove('hidden');

        // 设置内容
        tooltip.querySelector('.tutorial-content').textContent = step.content;

        // 设置位置
        if (step.element) {
            const element = document.querySelector(step.element);
            if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = document.getElementById('game-container').getBoundingClientRect();

                let top, left;

                if (step.position === 'bottom') {
                    top = rect.bottom - containerRect.top + 10;
                    left = rect.left - containerRect.left + (rect.width / 2) - 140;
                    tooltip.className = 'tutorial-tooltip top';
                } else {
                    top = rect.top - containerRect.top - tooltip.offsetHeight - 10;
                    left = rect.left - containerRect.left + (rect.width / 2) - 140;
                    tooltip.className = 'tutorial-tooltip bottom';
                }

                // 确保不超出边界
                left = Math.max(20, Math.min(left, containerRect.width - 300));

                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
            }
        } else {
            // 居中显示
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.className = 'tutorial-tooltip';
        }
    }

    /**
     * 下一步引导
     */
    nextTutorial() {
        this.currentTutorialStep++;
        this.showTutorialStep();
    }

    /**
     * 结束新手引导
     */
    endTutorial() {
        document.getElementById('tutorial-overlay').classList.add('hidden');

        // 显示学生会加入弹窗
        setTimeout(() => {
            this.showStudentUnionPrompt();
        }, 300);
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
                <button class="game-btn primary" onclick="game.joinStudentUnion(true)">加入学生会</button>
                <button class="game-btn" onclick="game.joinStudentUnion(false)">不加入</button>
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
            this.ui.updateNarrative('你填写了报名表，成为了学生会的一名干事。\n\n看着那张登记表，你不知道这是不是一个正确的选择。但至少，你的大学生活似乎有了更多的可能性。\n\n现在你可以开始进行大学生活了！选择下方的行动按钮来度过你的四年。');
        } else {
            this.ui.addLog('选择不加入学生会');
            this.ui.updateNarrative('你婉拒了邀请。\n\n"学生会就是给老师打杂的，"室友这样说，"不去也罢。"\n\n你点点头，但心里有点不确定。\n\n现在你可以开始进行大学生活了！选择下方的行动按钮来度过你的四年。');
        }

        this.ui.updateStats(this.player);
        // 确保更新行动按钮显示（添加学生会按钮如果加入了）
        this.ui.updateChoiceButtons(this.player);
    }

    /**
     * 玩家做出选择
     */
    makeChoice(choiceId) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // 特殊处理自由行动 - 显示子菜单
        if (choiceId === 'social') {
            this.showSocialSubMenu();
            return;
        }

        // 记录次数（用于触发某些事件）
        if (choiceId === 'relax') {
            this.player.relaxCount = (this.player.relaxCount || 0) + 1;
        } else if (choiceId === 'study') {
            this.player.studyCount = (this.player.studyCount || 0) + 1;
        }

        // 记录月度行动
        const choiceData = this.data.choices[choiceId];
        this.player.recordMonthlyAction(choiceId, choiceData?.title || '行动');

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

        // 获取叙事文本（choiceData已在上方声明）
        let narrative = choiceData ? this.getRandomNarrative(choiceData.narrative) : '';

        // 处理认真学习时的理想变化描述
        if (choiceId === 'study' && appliedEffects.idealismValue !== undefined) {
            const idealismText = this.player.getStudyIdealismText(appliedEffects.idealismValue);
            narrative += '\n\n' + idealismText;
        }

        // 处理学生会工作 - 显示专门弹窗
        if (choiceId === 'studentUnion') {
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
            // 记录到叙事区
            this.logChoiceToNarrative(choiceId, choiceData, narrative, oldStats);
            // 显示学生会工作弹窗
            this.handleStudentUnionChoice();
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

        // 记录到叙事区
        this.logChoiceToNarrative(choiceId, choiceData, narrative, oldStats);

        // 显示结果弹窗
        this.showActionResult(choiceId, choiceData, appliedEffects, oldStats, narrative);
    }

    /**
     * 记录选择到叙事区
     */
    logChoiceToNarrative(choiceId, choiceData, narrative, oldStats) {
        const player = this.player;

        // 计算数值变化
        const changes = [];
        const statNames = {
            gpa: '绩点',
            academic: '专业',
            anxiety: '焦虑',
            money: '金钱',
            idealism: '理想',
            network: '人脉',
            contribution: '奉献'
        };

        for (let stat in statNames) {
            const diff = player[stat] - (oldStats[stat] || 0);
            if (Math.abs(diff) > 0.01) {
                changes.push({ name: statNames[stat], value: Math.round(diff) });
            }
        }

        // 室友关系
        if (player.relations.roommate !== oldStats.relations?.roommate) {
            const diff = player.relations.roommate - (oldStats.relations?.roommate || 0);
            changes.push({ name: '室友关系', value: Math.round(diff) });
        }

        // 添加到叙事区
        this.ui.addLog({
            action: choiceId,
            title: choiceData?.title || '行动',
            narrative: narrative,
            changes: changes,
            date: player.getDateString()
        });
    }

    /**
     * 显示自由行动子菜单
     */
    showSocialSubMenu() {
        const hasSkills = Object.keys(this.player.skills).length > 0;

        let practiceBtnHtml = '';
        if (hasSkills) {
            practiceBtnHtml = `
                <button class="game-btn" onclick="game.selectSocialOption('practice')" style="flex: 1;">
                    <div style="font-size: 16px;">🎯</div>
                    <div style="font-size: 14px; margin-top: 5px;">钻研技能</div>
                    <div style="font-size: 11px; color: #888; margin-top: 3px;">提升技能熟练度</div>
                </button>
            `;
        } else {
            practiceBtnHtml = `
                <button class="game-btn" disabled style="flex: 1; opacity: 0.5; cursor: not-allowed;">
                    <div style="font-size: 16px;">🎯</div>
                    <div style="font-size: 14px; margin-top: 5px;">钻研技能</div>
                    <div style="font-size: 11px; color: #666; margin-top: 3px;">暂无技能可钻研</div>
                </button>
            `;
        }

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🎉 自由活动</h3>
            <p style="margin-bottom: 20px; color: #888;">你有一段空闲时间，打算怎么度过？</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="game-btn primary" onclick="game.selectSocialOption('relax')" style="flex: 1;">
                    <div style="font-size: 16px;">🌟</div>
                    <div style="font-size: 14px; margin-top: 5px;">出去放松</div>
                    <div style="font-size: 11px; color: #888; margin-top: 3px;">社交/娱乐/随机事件</div>
                </button>
                ${practiceBtnHtml}
            </div>
            <button class="game-btn" onclick="game.ui.hideModal('custom'); game.isProcessing = false;" style="margin-top: 15px;">取消</button>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 处理自由行动子选项
     */
    selectSocialOption(option) {
        this.ui.hideModal('custom');

        if (option === 'relax') {
            // 原本的"自由活动"逻辑
            this.doSocialRelax();
        } else if (option === 'practice') {
            // 钻研技能
            this.showPracticeSkillMenu();
        }
    }

    /**
     * 执行出去放松（原本的自由活动逻辑）
     */
    doSocialRelax() {
        // 记录月度行动
        this.player.recordMonthlyAction('social', '自由活动');

        const oldStats = {
            gpa: this.player.gpa,
            academic: this.player.academic,
            anxiety: this.player.anxiety,
            money: this.player.money,
            idealism: this.player.idealism,
            network: this.player.network,
            contribution: this.player.contribution,
            relations: { ...this.player.relations }
        };

        // 应用自由活动效果
        const appliedEffects = this.player.applyChoice('social');

        // 获取叙事文本
        const choiceData = this.data.choices['social'];
        let narrative = choiceData ? this.getRandomNarrative(choiceData.narrative) : '';

        // 处理金钱不足
        if (appliedEffects.noMoney) {
            this.showNoMoneyPrompt(oldStats);
            return;
        }

        // 处理触发技能事件
        if (appliedEffects.skillEvent) {
            this.showActionResult('social', choiceData, appliedEffects, oldStats, narrative, true);
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

        // 记录到叙事区
        this.logChoiceToNarrative('social', choiceData, narrative, oldStats);

        // 显示结果
        this.showActionResult('social', choiceData, appliedEffects, oldStats, narrative);
    }

    /**
     * 显示钻研技能菜单
     */
    showPracticeSkillMenu() {
        const skillNames = {
            writing: '写作', coding: '代码', media: '自媒体', art: '绘画',
            cosplay: 'Cosplay', gaming: '游戏代肝', divination: '占卜',
            tutoring: '家教', english: '英语', photography: '摄影',
            design: '设计', civilService: '考公', thinking: '思辨'
        };

        const skills = this.player.skills;
        let skillsHtml = '';

        for (let skillId in skills) {
            const level = skills[skillId];
            const proficiency = this.player.getSkillProficiency(skillId);
            const levelName = this.player.getSkillLevelName(level);

            skillsHtml += `
                <button class="game-btn" onclick="game.practiceSkill('${skillId}')" style="margin: 5px; text-align: left; padding: 10px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${skillNames[skillId] || skillId}</span>
                        <span style="font-size: 12px; color: #888;">${levelName} Lv.${level}</span>
                    </div>
                    <div style="margin-top: 5px; font-size: 11px; color: #666;">
                        熟练度: ${proficiency}/100
                        <div style="background: #333; height: 4px; border-radius: 2px; margin-top: 3px;">
                            <div style="background: #dda0dd; height: 100%; border-radius: 2px; width: ${proficiency}%;"></div>
                        </div>
                    </div>
                </button>
            `;
        }

        const content = `
            <h3 style="color: #dda0dd; margin-bottom: 10px;">🎯 钻研技能</h3>
            <p style="margin-bottom: 15px; color: #888; font-size: 12px;">选择一个技能进行钻研，每次钻研熟练度+2</p>
            <p style="margin-bottom: 15px; color: #666; font-size: 11px;">消耗: 焦虑+3 | 收益: 理想+1, 熟练度+2</p>
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto;">
                ${skillsHtml}
            </div>
            <button class="game-btn" onclick="game.ui.hideModal('custom'); game.isProcessing = false;" style="margin-top: 15px;">取消</button>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 钻研特定技能
     */
    practiceSkill(skillId) {
        const skillNames = {
            writing: '写作', coding: '代码', media: '自媒体', art: '绘画',
            cosplay: 'Cosplay', gaming: '游戏代肝', divination: '占卜',
            tutoring: '家教', english: '英语', photography: '摄影',
            design: '设计', civilService: '考公', thinking: '思辨'
        };

        const oldStats = {
            gpa: this.player.gpa,
            anxiety: this.player.anxiety,
            idealism: this.player.idealism
        };

        // 执行钻研
        const result = this.player.practiceSkill(skillId);

        if (!result.success) {
            alert(result.message);
            this.isProcessing = false;
            return;
        }

        // 记录月度行动
        this.player.recordMonthlyAction('practice', `钻研${skillNames[skillId]}`);

        // 记录到叙事区
        const narrative = `你花了整整一天时间钻研${skillNames[skillId]}技巧。\n\n从基础练习到进阶技巧，你一遍遍地重复、调整、改进。当夜幕降临时，你感觉自己对这项技能的理解又深了一层。`;

        this.ui.addLog({
            action: 'practice',
            title: `钻研: ${skillNames[skillId]}`,
            narrative: narrative,
            changes: [
                { name: '熟练度', value: `+2 (${result.newProficiency}/100)` },
                { name: '焦虑', value: '+3' },
                { name: '理想', value: '+1' }
            ],
            date: this.player.getDateString()
        });

        this.ui.hideModal('custom');
        this.ui.updateStats(this.player);

        // 显示钻研结果弹窗
        setTimeout(() => {
            const content = `
                <h3 style="color: #dda0dd; margin-bottom: 15px;">🎯 技能钻研</h3>
                <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                    你专注地钻研了一整天的${skillNames[skillId]}。
                </p>
                <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                    <div style="color: #888; margin-bottom: 8px;">熟练度变化：</div>
                    <div style="font-size: 18px; color: #dda0dd; margin-bottom: 10px;">
                        ${result.oldProficiency} → ${result.newProficiency}
                    </div>
                    <div style="background: #333; height: 8px; border-radius: 4px;">
                        <div style="background: linear-gradient(90deg, #dda0dd, #ff69b4); height: 100%; border-radius: 4px; width: ${result.newProficiency}%;"></div>
                    </div>
                </div>
                <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                    <div style="color: #888; margin-bottom: 8px;">本次行动影响：</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <span style="background: #331111; padding: 3px 8px; font-size: 12px; border-radius: 3px;">焦虑 +3</span>
                        <span style="background: #113311; padding: 3px 8px; font-size: 12px; border-radius: 3px;">理想 +1</span>
                        <span style="background: #113311; padding: 3px 8px; font-size: 12px; border-radius: 3px;">熟练度 +2</span>
                    </div>
                </div>
                <button class="game-btn primary" onclick="game.closePracticePrompt()">确定</button>
            `;
            this.ui.showCustomModal(content);
        }, 100);
    }

    /**
     * 关闭钻研技能弹窗
     */
    closePracticePrompt() {
        this.ui.hideModal('custom');
        this.advanceTime();
    }

    /**
     * 处理学生会工作选择（专门处理，确保弹窗）
     */
    handleStudentUnionChoice() {
        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🏛️ 学生会工作</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                你参加了学生会的例会，讨论了即将到来的校园活动。<br><br>
                会后你帮忙整理材料，处理了一些琐碎的事务。<br><br>
                虽然很累，但你感觉自己在组织中有了存在感。
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                <div style="color: #888; margin-bottom: 8px;">本次行动影响：</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <span style="background: #331111; padding: 3px 8px; font-size: 12px; border-radius: 3px;">绩点 -1</span>
                    <span style="background: #331111; padding: 3px 8px; font-size: 12px; border-radius: 3px;">焦虑 +5</span>
                    <span style="background: #331111; padding: 3px 8px; font-size: 12px; border-radius: 3px;">理想 -3</span>
                    <span style="background: #113311; padding: 3px 8px; font-size: 12px; border-radius: 3px;">奉献 +5</span>
                    <span style="background: #113311; padding: 3px 8px; font-size: 12px; border-radius: 3px;">人脉 +2</span>
                </div>
            </div>
            <button class="game-btn primary" onclick="game.closeStudentUnionPrompt()">确定</button>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 关闭学生会工作弹窗
     */
    closeStudentUnionPrompt() {
        this.ui.hideModal('custom');
        // 检查是否有待处理的事件
        setTimeout(() => {
            if (this.pendingNetworkChange && this.pendingNetworkChange.changed) {
                this.showNetworkLevelChange();
            } else if (this.pendingUnionPromo && this.pendingUnionPromo.promoted) {
                this.showUnionPromotion();
            } else {
                this.processActionEnd();
            }
        }, 300);
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
            <button class="game-btn primary" onclick="game.closeNoMoneyPrompt()">确定</button>
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
            let diff = player[stat] - oldStats[stat];
            // 自由活动单独处理金钱显示，只显示活动消费（200或300），不包括基础生活费120
            if (choiceId === 'social' && stat === 'money' && appliedEffects.moneyCost) {
                diff = -appliedEffects.moneyCost;
            }
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
            specialNote = '<div style="color: #c9a227; font-size: 11px; margin-top: 5px;">理想变化：' + (appliedEffects.idealismValue > 0 ? '+' : '') + appliedEffects.idealismValue + '</div>';
        }
        if (choiceId === 'social' && appliedEffects.socialResult) {
            specialNote = '<div style="color: #4fc9c9; font-size: 11px; margin-top: 5px;">' + appliedEffects.socialDesc + '</div>';
            specialNote += '<div style="color: #888; font-size: 10px; margin-top: 3px;">金钱-' + appliedEffects.moneyCost + ' 理想+' + appliedEffects.idealismGain + ' 人脉+' + appliedEffects.networkGain + '</div>';
        }

        const content = `
            <h3 style="color: #c9a227; margin-bottom: 15px;">${choiceData.title}</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 10px; font-size: 13px;">${narrative.replace(/\n/g, '<br>')}</p>
            ${specialNote}
            <div style="background: #1a1a1a; padding: 12px; margin: 15px 0; text-align: left;">
                <div style="color: #888; font-size: 11px; margin-bottom: 8px;">本次行动影响：</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${changes.map(c => `<span style="background: ${c.includes('-') ? '#331111' : '#113311'}; padding: 2px 6px; font-size: 11px; border-radius: 2px;">${c}</span>`).join('')}
                    ${changes.length === 0 ? '<span style="color: #666; font-size: 11px;">无明显变化</span>' : ''}
                </div>
            </div>
            <button class="game-btn primary" onclick="game.closeActionResult(${hasSkillEvent})">${hasSkillEvent ? '继续' : '确定'}</button>
        `;

        this.ui.showCustomModal(content);
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
            <button class="game-btn primary" onclick="game.closeNetworkLevelChange()">确定</button>
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
            <button class="game-btn primary" onclick="game.closeUnionPromotion()">确定</button>
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
                this.player.currentEvent = event;
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
     * 显示期末考试（12月30日）
     */
    showExam(examType) {
        const gpa = this.player.gpa;
        let grade, title, content;

        // 根据绩点显示评价
        if (gpa < 60) {
            grade = 'F';
            title = '咋全挂了';
            content = '你的成绩单上是一片刺眼的红色。辅导员找你谈话，语气里满是失望。\n\n"你是不是该考虑一下，这个专业真的适合你吗？"\n\n你无言以对。';
        } else if (gpa < 70) {
            grade = 'C';
            title = '挂科警告';
            content = '你低空飘过，有几门课差点挂了。看着那些60分的成绩，你心有余悸。\n\n"下学期一定要努力，"你对自己说，但心里也没底。';
        } else if (gpa < 80) {
            grade = 'B';
            title = '中流学生';
            content = '你的成绩在班级中等，不好不坏。\n\n就像你这个人一样，没什么存在感，但也不至于被点名批评。\n\n"普普通通也挺好的，"你安慰自己。';
        } else if (gpa < 90) {
            grade = 'A';
            title = '前20%！';
            content = '你考进了班级前20%！爸妈在电话里很高兴，问你想要什么奖励。\n\n你其实没什么想要的，但听到他们的笑声，你觉得这一学期的努力值了。';
        } else if (gpa < 95) {
            grade = 'A+';
            title = '前10%！';
            content = '你考进了班级前10%！奖学金稳了。\n\n室友看你的眼神有点复杂，但你不在乎。\n\n这是你应得的。';
        } else {
            grade = 'S';
            title = '满绩传说';
            content = '满分！你是这个学期的传说！\n\n老师当着全班的面表扬你，学弟学妹们议论纷纷，猜测你是何方神圣。\n\n你表面淡定，内心爽翻了。';
        }

        const examContent = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">📋 期末考试成绩</h3>
            <div style="font-size: 14px; color: #888; margin-bottom: 10px;">
                大${this.player.getYearName()}${this.player.semester === 1 ? '上' : '下'}学期 · 12月30日
            </div>
            <div style="font-size: 48px; margin: 20px 0; color: ${gpa >= 80 ? '#90ee90' : gpa >= 60 ? '#ff69b4' : '#ff4444'};">${grade}</div>
            <div style="font-size: 18px; color: #ffb6c1; margin-bottom: 15px;">${title}</div>
            <p style="margin-bottom: 20px; line-height: 1.8; text-align: left; padding: 0 20px;">${content}</p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0;">
                <div>当前绩点: <span style="color: #ff69b4;">${Math.round(gpa)}</span></div>
                <div style="font-size: 11px; color: #666; margin-top: 5px;">
                    ${gpa < 60 ? '绩点<60：咋全挂了' : gpa < 70 ? '60<绩点<70：挂科警告' : gpa < 80 ? '70<绩点<80：中流学生' : gpa < 90 ? '80<绩点<90：前20%！' : gpa < 95 ? '90<绩点<95：前10%！' : '绩点>95：满绩传说'}
                </div>
            </div>
            <button class="game-btn primary" onclick="game.closeExam()">确定</button>
        `;

        this.ui.showCustomModal(examContent);
        this.ui.addLog(`12月30日完成期末考试，绩点${Math.round(gpa)}，评价：${title}`);
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
            <h3 style="color: #c9a227; margin-bottom: 15px;">${event.title}</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left;">${event.content.replace(/\n/g, '<br>')}</p>
            ${warning}
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button class="game-btn primary" onclick="game.learnSkill(true)">学习技能</button>
                <button class="game-btn" onclick="game.learnSkill(false)">放弃</button>
            </div>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 处理技能学习
     */
    learnSkill(learn) {
        this.ui.hideModal('custom');

        try {
            if (learn) {
                const success = this.player.learnSkillFromEvent(true);
                if (success) {
                    const event = this.player.currentEvent;
                    if (event) {
                        this.ui.addLog(`学会了新技能: ${event.skillId}`);
                        // 记录到月度统计
                        this.player.recordMonthlySkill(event.skillId);
                        // 使用特定技能的叙事文案，如果没有则使用默认文案
                        const narrative = this.skillNarratives[event.skillId]?.learn
                            || `你决定尝试学习"${event.title.replace(/^.+?\s/, '')}"\n\n虽然不知道这条路会通向哪里，但至少是一个开始。`;
                        this.ui.updateNarrative(narrative);
                    }
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
        } catch (e) {
            console.error('学习技能时出错:', e);
            // 使用更友好的错误信息
            const event = this.player.currentEvent;
            const skillName = event?.skillId ? ({
                writing: '写作', coding: '代码', media: '自媒体', art: '绘画',
                cosplay: 'Cosplay', gaming: '游戏代肝', divination: '占卜',
                tutoring: '家教', english: '英语', photography: '摄影',
                design: '设计', civilService: '考公', thinking: '思辨'
            }[event.skillId] || '新技能') : '新技能';
            this.ui.updateNarrative(`你尝试学习${skillName}，但遇到了一些困难。\n\n"也许需要更多时间，"你对自己说，"但至少我迈出了第一步。"`);
        }

        // 确保状态被重置并推进时间
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
            civilService: '考公',
            thinking: '思辨'
        };

        let skillsHtml = '';
        for (let skillId in this.player.skills) {
            const level = this.player.skills[skillId];
            const levelName = this.player.getSkillLevelName(level);
            skillsHtml += `<button class="game-btn" onclick="game.forgetAndLearn('${skillId}')" style="margin: 5px;">${skillNames[skillId] || skillId} (${levelName})</button>`;
        }

        const content = `
            <h3 style="color: #c9a227; margin-bottom: 15px;">技能槽已满</h3>
            <p style="margin-bottom: 15px; font-size: 13px;">你需要遗忘一个已有技能才能学习新技能。</p>
            <p style="margin-bottom: 15px; color: #888; font-size: 12px;">选择要遗忘的技能：</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                ${skillsHtml}
            </div>
            <button class="game-btn" onclick="game.forgetAndLearn(null)" style="margin-top: 15px;">取消</button>
        `;

        this.ui.showCustomModal(content);
    }

    /**
     * 遗忘技能并学习新技能
     */
    forgetAndLearn(skillToForget) {
        this.ui.hideModal('custom');

        try {
            if (skillToForget) {
                // 获取被遗忘技能的叙事文案
                const forgetNarrative = this.skillNarratives[skillToForget]?.forget || '';

                this.player.forgetSkill(skillToForget);
                this.ui.addLog(`遗忘了技能: ${skillToForget}`);

                // 现在学习新技能
                const success = this.player.learnSkillFromEvent(true);
                if (success) {
                    const event = this.player.currentEvent;
                    if (event) {
                        this.ui.addLog(`学会了新技能: ${event.skillId}`);
                        // 组合遗忘和学习的叙事
                        const learnNarrative = this.skillNarratives[event.skillId]?.learn
                            || `你决定尝试学习"${event.title.replace(/^.+?\s/, '')}"`;

                        let fullNarrative = '';
                        if (forgetNarrative) {
                            fullNarrative = forgetNarrative + '\n\n---\n\n' + learnNarrative;
                        } else {
                            fullNarrative = `你决定放弃原来的技能，学习"${event.title.replace(/^.+?\s/, '')}"\n\n有时候，放弃也是一种选择。\n\n---\n\n` + learnNarrative;
                        }
                        this.ui.updateNarrative(fullNarrative);
                    }
                }
            } else {
                // 取消学习
                this.player.learnSkillFromEvent(false);
                this.ui.updateNarrative('你最终没有做出改变。\n\n也许保守一点更安全，但你心里有些遗憾。');
            }

            this.ui.updateStats(this.player);
        } catch (e) {
            console.error('遗忘技能时出错:', e);
            // 使用更友好的错误信息
            const event = this.player.currentEvent;
            const skillName = event?.skillId ? ({
                writing: '写作', coding: '代码', media: '自媒体', art: '绘画',
                cosplay: 'Cosplay', gaming: '游戏代肝', divination: '占卜',
                tutoring: '家教', english: '英语', photography: '摄影',
                design: '设计', civilService: '考公', thinking: '思辨'
            }[event.skillId] || '新技能') : '新技能';
            this.ui.updateNarrative(`你尝试调整技能方向，但遇到了一些困难。\n\n"改变从来不容易，"你对自己说，"但至少我尝试过。"`);
        }

        // 确保状态被重置并推进时间
        this.advanceTime();
    }

    /**
     * 触发随机事件
     */
    triggerRandomEvent() {
        const possibleEvents = this.data.getPossibleEvents(this.player);

        if (possibleEvents.length > 0) {
            const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

            // 记录事件到月度统计
            this.player.recordMonthlyEvent(event.title);

            // 应用事件效果（技能事件不在此处应用效果，在学习时应用）
            if (event.effects && event.type !== 'skill') {
                for (let stat in event.effects) {
                    this.player.modifyStat(stat, event.effects[stat]);
                }
            }

            // 记录已触发（技能事件在学习后才记录）
            if (event.type !== 'skill') {
                this.player.eventsTriggered.push(event.id);
            }

            // 如果是技能事件，设置到player.currentEvent
            if (event.type === 'skill') {
                this.player.currentEvent = event;
            }

            return event;
        }

        return null;
    }

    /**
     * 关闭事件弹窗，进入下一周
     */
    closeEvent() {
        this.ui.hideModal('custom');
        this.advanceTime();
    }

    /**
     * 推进时间
     */
    advanceTime() {
        this.isProcessing = false;

        // 推进时间并检查结果
        const timeResult = this.player.advanceTime();

        // 检查生活费归零
        if (timeResult.outOfMoney) {
            this.showOutOfMoneyPrompt();
            return;
        }

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

        // 检查春季学期开学
        if (timeResult.springStart) {
            this.showSpringStartPrompt();
            return;
        }

        // 检查寒假开始
        if (timeResult.winterBreak) {
            this.showWinterBreakPrompt();
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

        // 检查是否需要显示月度总结（每月30日或即将进入新月）
        if (this.player.day >= 27 && this.player.actionsLeft <= 3 && !this.monthlySummaryShown) {
            this.showMonthlySummary();
            this.monthlySummaryShown = true;
            return;
        }

        // 重置月度总结标记（进入新月后）
        if (timeResult.newMonth) {
            this.monthlySummaryShown = false;
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
     * 显示月度总结
     */
    showMonthlySummary() {
        const summary = this.player.generateMonthlySummary();
        if (!summary) {
            this.monthlySummaryShown = false;
            this.ui.updateStats(this.player);
            return;
        }

        // 生成数值变化HTML
        let changesHtml = '';
        const changeItems = [];

        if (summary.changes.money !== 0) {
            const color = summary.changes.money > 0 ? '#90ee90' : '#ff6666';
            const sign = summary.changes.money > 0 ? '+' : '';
            changeItems.push(`<span style="color: ${color};">资金 ${sign}${summary.changes.money}</span>`);
        }
        if (summary.changes.anxiety !== 0) {
            const color = summary.changes.anxiety > 0 ? '#ff6666' : '#90ee90';
            const sign = summary.changes.anxiety > 0 ? '+' : '';
            changeItems.push(`<span style="color: ${color};">焦虑 ${sign}${summary.changes.anxiety}</span>`);
        }
        if (summary.changes.idealism !== 0) {
            const color = summary.changes.idealism > 0 ? '#90ee90' : '#ff6666';
            const sign = summary.changes.idealism > 0 ? '+' : '';
            changeItems.push(`<span style="color: ${color};">理想 ${sign}${summary.changes.idealism}</span>`);
        }
        if (summary.changes.gpa !== 0) {
            const color = summary.changes.gpa > 0 ? '#90ee90' : '#ff6666';
            const sign = summary.changes.gpa > 0 ? '+' : '';
            changeItems.push(`<span style="color: ${color};">绩点 ${sign}${Math.round(summary.changes.gpa)}</span>`);
        }
        if (summary.changes.network !== 0) {
            const color = summary.changes.network > 0 ? '#90ee90' : '#ff6666';
            const sign = summary.changes.network > 0 ? '+' : '';
            changeItems.push(`<span style="color: ${color};">人脉 ${sign}${summary.changes.network}</span>`);
        }

        if (changeItems.length > 0) {
            changesHtml = `
                <div style="background: #1a1a1a; padding: 12px; margin: 12px 0; text-align: center;">
                    <div style="color: #888; font-size: 12px; margin-bottom: 8px;">本月变化</div>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 13px;">
                        ${changeItems.join('')}
                    </div>
                </div>
            `;
        }

        // 生成警报HTML
        let alertsHtml = '';
        if (summary.alerts && summary.alerts.length > 0) {
            const alertItems = summary.alerts.map(alert => {
                const bgColor = alert.type === 'danger' ? '#331111' : alert.type === 'warning' ? '#333311' : '#113311';
                const borderColor = alert.type === 'danger' ? '#ff4444' : alert.type === 'warning' ? '#ffaa00' : '#44ff44';
                return `<div style="background: ${bgColor}; border-left: 3px solid ${borderColor}; padding: 8px 12px; margin: 6px 0; font-size: 12px; text-align: left;">${alert.msg}</div>`;
            }).join('');

            alertsHtml = `
                <div style="margin: 12px 0;">
                    ${alertItems}
                </div>
            `;
        }

        // 生成当前状态速览
        const currentStatus = `
            <div style="background: #1a1a1a; padding: 12px; margin: 12px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; text-align: left;">
                <div>💰 资金: ¥${this.player.money}</div>
                <div>📊 绩点: ${Math.round(this.player.gpa)}</div>
                <div>😰 焦虑: ${this.player.anxiety}%</div>
                <div>✨ 理想: ${this.player.idealism}%</div>
                <div>🤝 人脉: ${this.player.network}/100</div>
                <div>📚 技能: ${Object.keys(this.player.skills).length}个</div>
            </div>
        `;

        const content = `
            <h3 style="color: #c9a227; margin-bottom: 10px;">📅 ${summary.month}度总结</h3>

            <div style="background: #1a1a1a; padding: 15px; margin: 12px 0; text-align: left; font-size: 13px; line-height: 1.6; border-left: 3px solid #c9a227;">
                ${summary.description.replace(/\n/g, '<br>')}
            </div>

            ${changesHtml}
            ${alertsHtml}
            ${currentStatus}

            <button class="game-btn primary" onclick="game.closeMonthlySummary()" style="margin-top: 15px;">继续游戏</button>
        `;

        this.ui.showCustomModal(content);

        // 重置月度统计
        this.player.resetMonthlyStats();
    }

    /**
     * 关闭月度总结
     */
    closeMonthlySummary() {
        this.ui.hideModal('custom');
        this.ui.updateStats(this.player);
        this.ui.updateChoiceButtons(this.player);

        // 检查是否即将进入新月，如果是则推进时间
        if (this.player.actionsLeft <= 0) {
            const timeResult = this.player.advanceTime();

            // 检查各种状态
            if (timeResult.outOfMoney) {
                this.showOutOfMoneyPrompt();
                return;
            }

            const ending = this.player.checkEnding(timeResult.exam);
            if (ending) {
                this.showEnding(ending);
                return;
            }

            if (timeResult.exam) {
                this.showExam(timeResult.exam);
                return;
            }

            if (timeResult.springStart) {
                this.showSpringStartPrompt();
                return;
            }

            if (timeResult.winterBreak) {
                this.showWinterBreakPrompt();
                return;
            }

            // 重置月度总结标记
            this.monthlySummaryShown = false;

            // 显示新月提示
            this.ui.addLog(`===== 进入${this.player.months[this.player.monthIndex]} =====`);
            if (timeResult.winterBreak) {
                this.ui.addLog('🎉 寒假开始！有更多时间培养技能');
            }
        }
    }

    /**
     * 显示生活费归零弹窗
     */
    showOutOfMoneyPrompt() {
        const survivalCheck = this.player.checkMoneyForSurvival();
        const content = `
            <h3 style="color: #ff4444; margin-bottom: 15px;">💸 生活费耗尽</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                你没有生活费了。钱包空空如也，接下来的日子怎么过？
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                <p style="color: #ff6666; margin-bottom: 10px;">你可以选择回家，但代价是：</p>
                <ul style="margin-left: 20px; color: #888;">
                    <li>翘掉剩下的所有课</li>
                    <li>本月剩余时间不能行动</li>
                    <li>绩点 <span style="color: #ff4444;">-10</span></li>
                    <li>人脉 <span style="color: #ff4444;">-5</span></li>
                </ul>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button class="game-btn primary" onclick="game.goHome()">回家</button>
            </div>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 玩家选择回家
     */
    goHome() {
        this.ui.hideModal('custom');

        // 应用惩罚
        this.player.gpa = Math.max(0, this.player.gpa - 10);
        this.player.network = Math.max(0, this.player.network - 5);
        this.player.actionsLeft = 0; // 清空剩余行动点

        // 显示回家弹窗
        setTimeout(() => {
            const content = `
                <h3 style="color: #ff69b4; margin-bottom: 15px;">🏠 你回家了</h3>
                <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                    你回家了，挨了父母好一顿训斥——<br><br>
                    <em style="color: #ffb6c1;">还好，至少在家里蹲的时候你不用花钱。</em>
                </p>
                <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                    <div style="color: #ff4444;">绩点 -10</div>
                    <div style="color: #ff4444;">人脉 -5</div>
                </div>
                <button class="game-btn primary" onclick="game.closeGoHomePrompt()">进入下个月</button>
            `;
            this.ui.showCustomModal(content);
        }, 300);
    }

    /**
     * 关闭回家弹窗，进入下个月
     */
    closeGoHomePrompt() {
        this.ui.hideModal('custom');
        this.ui.addLog('生活费耗尽，被迫回家，绩点-10，人脉-5');
        this.ui.updateStats(this.player);

        // 直接进入下个月
        setTimeout(() => {
            this.player.actionsLeft = 0;
            const timeResult = this.player.advanceTime();

            // 检查结局
            const ending = this.player.checkEnding(timeResult.exam);
            if (ending) {
                this.showEnding(ending);
                return;
            }

            // 更新UI
            this.ui.updateStats(this.player);
            this.ui.updateChoiceButtons(this.player);
        }, 300);
    }

    /**
     * 显示寒假开始弹窗
     */
    showWinterBreakPrompt() {
        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">❄️ 寒假开始</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                1月3日，寒假开始了！
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px; color: #888;">
                <p style="color: #ffb6c1; margin-bottom: 10px;">提示：</p>
                <p>寒假期间随机事件出现概率更高，你有更多时间培养技能！</p>
            </div>
            <button class="game-btn primary" onclick="game.closeWinterBreakPrompt()">确定</button>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 关闭寒假弹窗
     */
    closeWinterBreakPrompt() {
        this.ui.hideModal('custom');
        this.ui.addLog('🎉 寒假开始！随机事件概率提升');
        this.ui.updateStats(this.player);
    }

    /**
     * 显示春季学期开学弹窗
     */
    showSpringStartPrompt() {
        const yearName = this.player.getYearName();
        const oldGpa = this.player.gpa;

        // 刷新绩点
        this.player.refreshGPA();
        const newGpa = this.player.gpa;

        const content = `
            <h3 style="color: #ff69b4; margin-bottom: 15px;">🌸 大${yearName}下学期开始</h3>
            <p style="margin-bottom: 15px; line-height: 1.8; text-align: left; padding: 0 20px;">
                3月3日，春季学期开学了。新的学期，新的开始！
            </p>
            <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; text-align: left; font-size: 12px;">
                <div style="color: #888; margin-bottom: 10px;">绩点已根据专业水平刷新：</div>
                <div style="font-size: 18px; color: #ffb6c1;">
                    ${Math.round(oldGpa)} → ${Math.round(newGpa)}
                </div>
                <div style="color: #666; margin-top: 10px; font-size: 11px;">
                    专业水平 ${Math.round(this.player.academic)}：
                    ${this.player.academic < 50 ? '绩点开局 60' : this.player.academic <= 75 ? '绩点开局 80' : '绩点开局 90'}
                </div>
            </div>
            <button class="game-btn primary" onclick="game.closeSpringStartPrompt()">开始新学期</button>
        `;
        this.ui.showCustomModal(content);
    }

    /**
     * 关闭春季学期弹窗
     */
    closeSpringStartPrompt() {
        this.ui.hideModal('custom');
        this.ui.addLog(`大${this.player.getYearName()}下学期开始，绩点已刷新`);
        this.ui.updateStats(this.player);
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
                <button class="game-btn primary" onclick="game.runForPresident(true)">参加竞选</button>
                <button class="game-btn" onclick="game.runForPresident(false)">放弃</button>
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
        this.monthlySummaryShown = false;
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
        // 如果当前在start界面，显示专业选择
        const startScreen = document.getElementById('start-screen');
        if (startScreen && startScreen.classList.contains('active')) {
            this.showMajorSelection();
        }
    }

    /**
     * 切换技能面板
     */
    toggleSkillsPanel() {
        // 技能面板功能占位
        this.ui.showCustomModal(`
            <h3>技能栏</h3>
            <p style="color: #888;">当前掌握的技能会在这里显示</p>
            <button class="game-btn primary" onclick="game.ui.hideModal('custom')">关闭</button>
        `);
    }

    /**
     * 切换关系面板
     */
    toggleRelationsPanel() {
        // 关系面板功能占位
        const player = this.player;
        const roommateLevel = player.relations.roommate >= 86 ? '死党' :
                              player.relations.roommate >= 66 ? '亲密' :
                              player.relations.roommate >= 46 ? '熟悉' :
                              player.relations.roommate >= 31 ? '陌生人' :
                              player.relations.roommate >= 16 ? '紧张' : '互相厌恶';

        this.ui.showCustomModal(`
            <h3>社交关系</h3>
            <div style="text-align: left; margin: 16px 0;">
                <div style="margin-bottom: 12px;">
                    <div style="color: #888; font-size: 12px;">室友关系</div>
                    <div>${roommateLevel} (${player.relations.roommate})</div>
                </div>
                <div>
                    <div style="color: #888; font-size: 12px;">人脉</div>
                    <div>${Math.round(player.network)}</div>
                </div>
            </div>
            <button class="game-btn primary" onclick="game.ui.hideModal('custom')">关闭</button>
        `);
    }
}

// 创建游戏实例并导出
const game = new Game();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
