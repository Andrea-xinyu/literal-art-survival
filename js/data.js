/**
 * 游戏数据模块
 * 包含叙事文本、选择描述、事件等内容
 */

const GameData = {
    /**
     * 专业信息
     */
    majors: {
        chinese: {
            name: '汉语言文学',
            description: '"百无一用是书生，但你可以写得一手好文案"',
            icon: '📖',
            bonuses: {
                writing: 3,
                speaking: 2,
                thinking: 2
            },
            courses: ['古代文学', '现代文学', '写作训练', '语言学']
        }
    },

    /**
     * 选择描述
     */
    choices: {
        study: {
            title: '认真学习',
            icon: '📚',
            narrative: [
                '你泡了一天图书馆，看了三本专业书，做了满满一页笔记。',
                '晚上回宿舍时，你发现室友都在打游戏，而你脑子里全是《红楼梦》的人物关系。',
                '你有点孤独，但觉得这一天过得挺充实。',
                '你在自习室待到闭馆，保安大叔看了你一眼，眼神里带着怜悯。'
            ],
            effects: {
                'skills.writing': 0.3,
                'skills.thinking': 0.3,
                'anxiety': 5,
                'idealism': -2,
                'health': -2
            }
        },
        social: {
            title: '自由活动',
            icon: '🎉',
            narrative: [
                '你决定出门走走，看看这个城市。',
                '也许去咖啡馆坐坐，也许逛逛街，也许偶遇一些有趣的人和事。',
                '大学生活不该只有学习，对吧？',
                '你漫步在街头，不知道今天会遇到什么。'
            ],
            effects: {
                // 效果在代码中动态决定
            }
        },
        work: {
            title: '找份兼职',
            icon: '💼',
            narrative: [
                '你在朋友圈看到一个文案兼职，联系了对方。',
                '对方让你写一篇推广文案，改了五遍终于通过。',
                '虽然时薪不高，但你拿到了第一笔靠自己挣的钱。',
                '凌晨两点还在改稿的你，突然理解了什么叫"劳动异化"。'
            ],
            effects: {
                'money': 300,
                'skills.writing': 0.2,
                'skills.coding': 0.1,
                'anxiety': 8,
                'health': -5,
                'idealism': -5
            }
        },
        relax: {
            title: '躺平娱乐',
            icon: '🎮',
            narrative: [
                '你今天什么都不想做，躺在床上刷了一天短视频。',
                '看到别人的精彩生活，你先是羡慕，然后麻木。',
                '傍晚点了一份外卖，继续看剧。',
                '凌晨三点，你在黑暗中盯着天花板，觉得自己是个废物——但至少今天休息好了。'
            ],
            effects: {
                'anxiety': -10,
                'idealism': -2,
                'money': -50
            }
        },
        studentUnion: {
            title: '学生会工作',
            icon: '🏛️',
            narrative: [
                '你参加了学生会的例会，讨论了即将到来的校园活动。',
                '会后你帮忙整理材料，处理了一些琐碎的事务。',
                '虽然很累，但你感觉自己在组织中有了存在感。',
                '你看着那些高层干部，想着有一天自己也能站在那个位置。'
            ],
            effects: {
                'anxiety': 5,
                'idealism': -3,
                'gpa': -1,
                'contribution': 5,
                'relations': 2
            }
        }
    },

    /**
     * 周期性叙事（根据周数）
     */
    weeklyNarratives: {
        1: {
            default: '你站在大学校门口，手里拖着行李箱，望着来来往往的人群。\n\n四年的大学生活即将开始，你既期待又忐忑。\n\n"汉语言文学，"你默念着录取通知书上的专业名称，"听说毕业即失业？"'
        },
        2: {
            default: '军训终于结束了，你黑了一圈，也瘦了一圈。\n\n宿舍四个人终于聚齐，大家互相加了微信，建了群。\n\n你躺在床上，想着明天开始正式上课，突然有点不知所措。'
        },
        3: {
            default: '第一节专业课是古代文学，教授讲《诗经》，你听得昏昏欲睡。\n\n后排有人在讨论："学这个以后能干吗？"\n\n你假装没听见，认真记着笔记，但心里也在想这个问题。'
        },
        4: {
            default: '这个月的生活费到账了，¥1500。\n\n你算了算，吃饭¥800，话费¥50，书本费¥200，还剩不到五百。\n\n室友说要聚餐，你看了看余额，默默点了同意。'
        },
        5: {
            default: '中秋假期，你没有回家，因为车票太贵。\n\n一个人在宿舍待了三天，看完了三本书，吃了五桶泡面。\n\n你开始思考：大学就是这样吗？'
        },
        6: {
            default: '社团招新开始了，操场上人山人海。\n\n你转了一圈，拿到了十几张传单，最后只加了一个文学社的群。\n\n"反正我也只会写点东西了，"你自嘲地想。'
        },
        7: {
            default: '第一次期中作业是一篇3000字的文学评论。\n\n你熬了两个晚上写完了，交上去的时候手都在抖。\n\n一周后发下来，85分，评语是"有一定见解，但论证不够深入"。\n\n你不知道这是好是坏。'
        },
        8: {
            default: '天气转凉，你开始穿厚外套。\n\n这半个学期过得很快，你认识了一些人，上了一些课，但总觉得缺了点什么。\n\n深夜刷朋友圈，看到高中同学晒计算机课的作业，突然有点羡慕。'
        }
    },

    /**
     * 随机事件池
     */
    randomEvents: [
        {
            id: 'late_for_class',
            title: '上课迟到',
            content: '你睡过头了，赶到教室时老师已经开始讲课。你偷偷从后门溜进去，但还是被点名了。\n\n"那位同学，你来回答一下这个问题。"\n\n你站起来，大脑一片空白。',
            condition: (p) => p.health < 60,
            probability: 0.3,
            effects: { 'anxiety': 5, 'relations.professor': -5, 'health': 2 }
        },
        {
            id: 'essay_inspired',
            title: '文思泉涌',
            content: '深夜，你突然有了写作的灵感，一气呵成写了一篇短文。\n\n虽然明天早八，但你觉得很值。\n\n你把文章发到小号，有三个人点赞，其中一个还是你自己。',
            condition: (p) => p.skills.writing >= 3 && p.idealism > 60,
            probability: 0.2,
            effects: { 'skills.writing': 0.5, 'health': -3, 'idealism': 5 }
        },
        {
            id: 'part_time_offer',
            title: '兼职机会',
            content: '学长介绍了一个新媒体文案的兼职，时薪50块。\n\n"就是给公众号写情感文章，洗稿会吧？不会我教你。"\n\n你犹豫了一下，想到这个月的余额，还是答应了。',
            condition: (p) => p.week > 4 && p.skills.writing >= 2,
            probability: 0.25,
            effects: { 'money': 400, 'skills.writing': 0.3, 'anxiety': 5, 'idealism': -3 }
        },
        {
            id: 'existential_crisis',
            title: '存在危机',
            content: '刷到计算机专业同学的offer，月薪是你预期的三倍。\n\n你开始怀疑自己的选择...\n\n"我要是当初选了计算机..."\n\n但你连高数都学不明白，还是算了。',
            condition: (p) => p.anxiety > 50,
            probability: 0.4,
            effects: { 'anxiety': 10, 'idealism': -10, 'skills.coding': 0.2 }
        },
        {
            id: 'roommate_conflict',
            title: '宿舍矛盾',
            content: '室友晚上打游戏到三点，键盘声噼里啪啦。\n\n你终于忍不住爆发了："能不能小声点！"\n\n场面一度很尴尬。\n\n第二天你们装作什么都没发生，但空气中弥漫着微妙的气氛。',
            condition: (p) => p.anxiety > 60 && p.relations.roommate < 40,
            probability: 0.3,
            effects: { 'relations.roommate': -15, 'anxiety': -5, 'health': -5 }
        },
        {
            id: 'book_discovery',
            title: '书店奇遇',
            content: '在旧书店淘到一本绝版书，花了半个月生活费。\n\n但你觉得自己赚到了。\n\n"知识是无价的，"你安慰自己，同时决定接下来两周吃土。',
            condition: (p) => p.money > 500 && p.idealism > 50,
            probability: 0.15,
            effects: { 'money': -300, 'idealism': 10, 'skills.thinking': 0.3, 'skills.writing': 0.2 }
        },
        {
            id: 'viral_post',
            title: '文章小爆',
            content: '你随手发的一篇吐槽文科生的文章意外火了，阅读量10万+。\n\n评论区炸了：\n"太真实了！"\n"我也是文科生，泪目"\n"转码吧兄弟，我有教程"\n\n有人私信问你接不接广告。你看着那几百块的报价，陷入了沉思。',
            condition: (p) => p.skills.writing >= 4 && p.week > 6,
            probability: 0.1,
            effects: { 'skills.writing': 0.5, 'skills.social': 0.3, 'money': 200, 'idealism': -5 }
        },
        {
            id: 'family_pressure',
            title: '家里来电',
            content: '妈妈问你毕业打算干什么。\n\n你说："还在考虑，可能是编辑、记者、老师...或者考公？"\n\n电话那头沉默了三秒。\n\n"你表哥在华为，年薪30万。"\n\n你嗯了一声，不知道该说什么。',
            condition: (p) => p.week > 8,
            probability: 0.35,
            effects: { 'anxiety': 15, 'idealism': -5 }
        },
        {
            id: 'coffee_spill',
            title: '咖啡泼电脑',
            content: '你在图书馆打瞌睡，手一抖，咖啡泼在了电脑上。\n\n屏幕瞬间黑了。\n\n你愣在那里，脑子里第一个念头是："完了，我的钱..."\n\n去维修店一问，主板烧了，修理费800。',
            condition: (p) => p.health < 50,
            probability: 0.15,
            effects: { 'money': -800, 'anxiety': 20, 'health': -5 }
        },
        {
            id: 'professor_chat',
            title: '导师约谈',
            content: '导师找你谈话，问你最近的学业情况。\n\n"你有没有考虑过读研？现在本科就业不太容易。"\n\n你点点头，心里却在想：读研就能解决问题吗？\n\n但看着导师关切的眼神，你还是说："我会考虑的。"',
            condition: (p) => p.week > 10 && p.gpa > 3,
            probability: 0.2,
            effects: { 'relations.professor': 10, 'anxiety': 5, 'idealism': 3 }
        },
        {
            id: 'weekend_trip',
            title: '周末出游',
            content: '室友提议周末去周边城市玩，人均300。\n\n你想拒绝，但看着大家期待的眼神，还是咬牙答应了。\n\n那两天你玩得很开心，但回来看到余额，焦虑得失眠了一整晚。',
            condition: (p) => p.money > 400 && p.relations.roommate > 40,
            probability: 0.2,
            effects: { 'money': -300, 'relations.roommate': 10, 'anxiety': 10, 'health': 5, 'idealism': 5 }
        },
        {
            id: 'coding_tutorial',
            title: '编程教程',
            content: '深夜emo，你打开B站搜"文科生转码"，一口气看了三个教程。\n\n"Python很简单，一个月入门。"\n\n你信心满满的下载了软件，跟着打了两行代码，然后...睡着了。\n\n第二天醒来，桌面上多了个"hello.py"，你觉得至少是个开始。',
            condition: (p) => p.anxiety > 60,
            probability: 0.25,
            effects: { 'skills.coding': 0.3, 'anxiety': -3, 'health': -3 }
        }
    ],

    /**
     * 结局定义
     */
    endings: {
        coder: {
            title: '转码成功',
            icon: '💻',
            condition: (p) => p.skills.coding >= 3,
            content: `你利用课余时间自学编程，最终拿到了一家互联网公司的offer。虽然专业不对口，但你的代码能力得到了认可。

起薪12k，在同学中算是不错的了。

同事们问你大学学的什么，你说"汉语言文学"。他们露出惊讶的表情，然后说："怪不得你文档写得这么好。"

你笑了笑，没说话。`,
            tags: ['自救成功', '技术路线', '现实主义者'],
            stats: {
                income: '¥12,000/月',
                stability: '高',
                satisfaction: '中等'
            }
        },
        writer: {
            title: '自由撰稿人',
            icon: '✍️',
            condition: (p) => p.skills.writing >= 5 && p.idealism >= 50,
            content: `你坚持写作，在各种平台积累了一定的粉丝。虽然收入不稳定，但你靠接文案、写专栏勉强能养活自己。

你的文章《一个文科生的自救》获得了不少共鸣。有人在评论区问："写作能养活自己吗？"

你回复："不能，但快乐。"

发完这条评论，你看了看这个月的账单，叹了口气。`,
            tags: ['理想主义', '自由职业', '穷困潦倒但快乐'],
            stats: {
                income: '¥3,000-8,000/月（不稳定）',
                stability: '低',
                satisfaction: '高'
            }
        },
        burnout: {
            title: '精神内耗',
            icon: '😔',
            condition: (p) => p.anxiety >= 80,
            content: `你的焦虑已经到了无法自控的地步。失眠、暴食、对什么都提不起兴趣。

你办理了休学，回家休养。

爸妈看着你欲言又止，最后只说："先把身体养好，其他的以后再说。"

你躺在家里，刷着招聘软件，不知道未来在哪里。

有时候你想，也许当初不读大学会更好？但你已经没有退路了。`,
            tags: ['需要休息', '心理健康', '暂停一下'],
            stats: {
                income: '无',
                stability: '未知',
                satisfaction: '低'
            }
        },
        lay_flat: {
            title: '灵活就业',
            icon: '🛋️',
            condition: (p) => p.idealism <= 30 && p.skills.writing < 4 && p.skills.coding < 3,
            content: `大学四年，你没有特别突出的技能，也没有找到明确的方向。

毕业后，你成为了一名"灵活就业者"——其实就是没有固定工作。

今天做家教，明天发传单，后天帮朋友写个文案。收入时有时无，但你学会了用"躺平"来安慰自己。

"至少我还活着，"你对自己说，"而且精神状态还行。"

其实你也想努力，只是不知道往哪个方向努力。`,
            tags: ['生存模式', '未找到方向', '仍在探索'],
            stats: {
                income: '¥2,000-4,000/月',
                stability: '极低',
                satisfaction: '低'
            }
        },
        ordinary: {
            title: '普通文科生',
            icon: '👔',
            condition: () => true, // 默认结局
            content: `你和大多数文科生一样，平平淡淡地度过了大学四年。

绩点一般，技能一般，人脉一般。

毕业时你海投简历，最后进了一家小公司做行政。月薪4k，五险一金按最低标准交。

有时候你会想，如果当初多做点什么，现在会不会不一样。

但更多的时候，你只是埋头做着手头的工作，告诉自己：先活着吧。

"也许以后会好起来的。"你对自己说，虽然你自己也不太相信。`,
            tags: ['芸芸众生', '还在努力', ' Survival模式'],
            stats: {
                income: '¥4,000/月',
                stability: '中',
                satisfaction: '低'
            }
        }
    },

    /**
     * 获取当前周的叙事文本
     */
    getWeeklyNarrative(week, choiceType) {
        const weekData = this.weeklyNarratives[week];
        if (!weekData) {
            return this.getGenericNarrative(week, choiceType);
        }
        return weekData.default || this.getGenericNarrative(week, choiceType);
    },

    /**
     * 获取通用叙事文本
     */
    getGenericNarrative(week, choiceType) {
        const narratives = {
            study: [
                '这周你主要在学习中度过，图书馆成了你的第二个宿舍。',
                '你觉得自己在进步，虽然不知道这些知识以后用不用得上。',
                '看着厚厚的专业书，你突然理解了什么叫"知识的重量"。'
            ],
            social: [
                '这周你花了不少时间在社交上，认识了一些新朋友。',
                '聚餐、聊天、逛街，你觉得自己活得像个正常的大学生。',
                '但也隐隐担心，这样是不是太浪费时间了？'
            ],
            work: [
                '这周你忙着打工挣钱，学业只能勉强应付。',
                '虽然很累，但看着余额增加，你觉得值得。',
                '只是有时候深夜回来，会怀疑自己上大学的意义。'
            ],
            relax: [
                '这周你几乎什么都没做，就是睡觉、刷剧、发呆。',
                '你觉得很放松，但放松完之后是更深的空虚。',
                '时间在指尖溜走，而你抓不住任何东西。'
            ]
        };

        const list = narratives[choiceType] || narratives.study;
        return list[Math.floor(Math.random() * list.length)];
    },

    /**
     * 根据条件获取可能的随机事件
     */
    getPossibleEvents(player) {
        return this.randomEvents.filter(event => {
            if (player.eventsTriggered.includes(event.id)) return false;
            if (event.condition && !event.condition(player)) return false;
            return Math.random() < event.probability;
        });
    }
};
