import {
  MAXNUM,
  MINNUM,
  BasicYunqi,
  RareValue,
  EventCode,
  getRandom,
  defaultDefaultEvent,
  defaultNormalEvent,
  defaultPrEvent,
  defaultBindingEvent,
  defaultOptEvent,
  defaultMultiOptEvent,
  defaultPassiveEvent,
  defaultCertainEvent
} from './eventObjects'
export default {
  // 普通事件
  chusheng: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `${options.unitTimeInfo.chronology[0]} ${options.unitTimeInfo.date[0] + options.unitTimeInfo.chronology[1]}${options.unitTimeInfo.date[1] + options.unitTimeInfo.chronology[2]}${options.unitTimeInfo.date[2] + options.unitTimeInfo.chronology[3]}，你出生了，你${options.userInfo.babazaishi && options.userInfo.mamazaishi ? '的父母带上美好的祝福和希望，为你取名' : !options.userInfo.babazaishi && options.userInfo.mamazaishi ? '的妈妈带上美好的祝福和希望，为你取名' : options.userInfo.babazaishi && !options.userInfo.mamazaishi ? '的爸爸带上美好的祝福和希望，为你取名' : '被福利院随便取了个名字叫'}【${options.userInfo.name}】`,
    style: () => ({ backgroundColor: 'rgb(206, 240, 255)' }),
    times: (times = 1) => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 1] })
  },
  // 成就-必然事件
  nihenyongo: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——你很勇哦】在路上你遇到了杰哥，他觉得你很勇，邀请你到他的房子里康些好康的东西，你当然觉得你很勇，就跟着去了，结果...(魅力+10，体质-1，智力-1)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [12, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 10,
      tizhi: -1,
      zhili: -1
    })
  },
  nihenyongo2: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——勇个屁】在路上你遇到了杰哥，他觉得你很勇，邀请你到他的房子里康些好康的东西，你当然觉得你很勇，就跟着去了，结果他好像发现了什么，突然说：你勇个屁。然后吧你赶走了，你愣在了原地，不知所措(运气+4，魅力-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [-1, 0], age: [12, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yunqi: 4,
      meili: -2
    })
  },
  dashayifang: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——大杀一方】尖叫？不存在的，徒手擒拿南方大老鼠，手执拖鞋打遍南方大蟑螂，南方的老鼠蟑螂在你附近都能被你的气场震慑得当场去世，你的生活没有了老鼠蟑螂，再也不用担心脏乱差了(体质+8)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [4, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 8
    })
  },
  fayudebucuoma: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——发育得不错嘛】杰哥温柔地捏了你的大腿几下，说：发育得不错嘛，还蛮结实的喔。然后...(魅力+10，勇气-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [12, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 10,
      yongqi: -2
    })
  },
  nvhanzi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——女汉子】抱歉，男人是什么？有什么用？你并不是那种喊giegie的人，而是手拎起桶装水，肩扛煤气罐的超级女汉子(勇气+10，魅力-3)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [4, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 10,
      meili: -3
    })
  },
  kuihuabaodian: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——葵花宝典】葵花宝典大成，阴阳怪气天下无双，你的一套组合拳下去，连某博拳师都不敢轻易惹上你(体质+3，勇气+3，智力+2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [-1, 0], age: [4, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 3,
      tizhi: 3,
      zhili: 2
    })
  },
  baozugong: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `【家境达成100——包租${options.userInfo.sex === 1 ? '公' : options.userInfo.sex === 0 ? '婆' : ''}】你的钱多到花不完，北上广深已经没有一个地方你是没有房子的${options.userInfo.sex === 1 || options.userInfo.sex === -1 ? '，每天穿着人字拖，白背心，大裤衩' : '，每天穿着人字拖，花睡裙，卷着头发'}，天天家里蹲看着房价天天涨，不要太舒服(魅力+5，家境+3，体质-2)`,
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [18, MAXNUM], jiajing: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 5,
      jiajing: 3,
      tizhi: -2
    })
  },
  ouzhougou: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【运气达成100——欧洲狗】有一天，你发现自己无论走到哪都能捡到钱，最后你的运气好到连种族都变了，你变成了真正的欧洲狗，在大街上人人都想给你一矛吃，你被吓得不敢出门(家境+10，魅力-3，勇气-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM], yunqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 10,
      meili: -3,
      tizhi: -2
    })
  },
  changtiaorap: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【魅力达成100——唱跳Rap】你人不仅长得炫，唱跳Rap篮球还样样精通，就连练习两年半的练习生阿坤都对你佩服得五体投地，某博打榜你月月稳居第一，无人超越(家境+10，体质+2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM], meili: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 10,
      tizhi: 2
    })
  },
  laobideng: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【年龄达成100——老闭灯】你在家做健身体操的时候，常常会碰到家里灯的开关，你家里人开了你又不小心关上，开了你又关上，这时候你家里人经常会对你说：诶，你老闭灯噶蛤鸭(体质+5)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 5
    })
  },
  mutaidanshen_nan: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【母胎单身】汪汪汪(魅力-2，体质-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [30, MAXNUM], lianaicishu: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -2,
      tizhi: -2
    })
  },
  mutaidanshen_nv: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【母胎单身】汪汪汪(魅力-3)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [30, MAXNUM], lianaicishu: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -3
    })
  },
  kaizhi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【智力达成100——开智】你的大脑开发程度超越爱因斯坦，你除了五官之外还多了一种奇妙的神秘第六感，感知到了一种遍布世界却又从未曾感知到的神奇能量(开启灵力修炼)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [18, MAXNUM], zhili: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      linglixiulian: 1
    })
  },
  nanrendelangman: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【唯物主义等级达成30——男人的浪漫】你是个坚定的唯物主义，深谙马克思列宁主义，天不怕地不怕(勇气+8，智力+3)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, MAXNUM], dengji_weiwuzhuyi: [30, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 8,
      zhili: 3
    })
  },
  // 结束-必然事件
  siwang: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【Game Over】',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, tizhi: [MINNUM, -10], routibusi: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      siwang: 1,
      jieshu: 1
    })
  },
  // 普通-随机事件
  changzhangqi: {
    ...defaultNormalEvent,
    text: (options) => '你突然肚子很痛，大概是肠胀气，大半夜去了医院，好在没什么大问题，据说这是婴儿常见的问题',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = MAXNUM) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 5] })
  },
  xiyinwenzi: {
    ...defaultNormalEvent,
    text: (options) => '你的咿咿呀呀声莫名吸引蚊子，难道你上辈子是蚊子，懂蚊子的语言？',
    times: (initTimes = 1) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 2] })
  },
  lianshidaipi: {
    ...defaultNormalEvent,
    text: (options) => `${options.userInfo.mamazaishi ? '你妈妈' : options.userInfo.babazaishi ? '你爸爸' : '你身边的人'}给你换纸尿片，结果一掀开你当场崩了个连屎带屁，崩了人家一脸，你却咔咔笑得合不拢嘴`,
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 2) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 3] })
  },
  shuaidaotou: {
    ...defaultNormalEvent,
    text: (options) => `${options.userInfo.age < 3 ? '你学走路的时候，' : '你走在路上'}一不小心摔了一跤，头直接撞到桌角，你的脑袋似乎从此变得没那么灵光(智力-1)`,
    times: (initTimes = 3) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [1, MAXNUM] }),
    effectAttr: (attr = {}) => ({ ...attr, zhili: -1 })
  },
  zhuangdaojiaozhi: {
    ...defaultNormalEvent,
    text: (options) => `${options.userInfo.age < 3 ? '你学会了走路，还意外马上学会了跑步，在极度兴奋之下，一下子' : '你正打算上床睡觉，一不小心'}撞到了脚趾尾，那酸爽...`,
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = MAXNUM) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [1, MAXNUM] })
  },
  dayufangzhen: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `你${options.userInfo.babazaishi && options.userInfo.mamazaishi ? '父母' : options.userInfo.babazaishi && !options.userInfo.mamazaishi ? '爸爸' : !options.userInfo.babazaishi && options.userInfo.mamazaishi ? '妈妈' : '身边的人'}带你去打预防针，${options.userInfo.yongqi >= 6 ? '你邹起眉头，一副老成的样子，竟然出其地能够勇敢面对' : '还没开始打你就哭爹喊娘，好几个护士才终于成功把你给按住'}(体质+1)`,
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 9] }),
    effectAttr: (attr = {}) => ({ ...attr, tizhi: 1 })
  },
  caigoushi: {
    ...defaultNormalEvent,
    text: (options) => '你走在街上踩到了狗屎，心想肯定要走狗屎运了(运气+1)',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 2) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM] }),
    effectAttr: (attr = {}) => ({ ...attr, yunqi: 1 })
  },
  ganmao: {
    ...defaultNormalEvent,
    text: (options) => '你因为吹到冷风而发烧感冒，难顶(健康-1)',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 2) => times,
    triggerConditions: (attr = {}) => ({ ...attr, tizhi: [MINNUM, 30] }),
    effectAttr: (attr = {}) => ({ ...attr, jiankang: -1 })
  },
  babachaoren: {
    ...defaultNormalEvent,
    text: (options) => `今年生日，你爸特意买了个超人迪加的紧身衣为你庆祝生日，${options.userInfo.age > 8 ? `你看傻子一样的表情看着你爸，说：我都${options.userInfo.age}岁了，能不能别这么幼稚？` : '你不但没有给惊喜到，反而受到了惊吓，边哭边喊着：你不要过来啊！'}`,
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [5, 18], babazaishi: [1, MAXNUM] })
  },
  diyicishuohua: {
    ...defaultNormalEvent,
    text: (options) => `你出生以来第一次清晰地喊出${options.userInfo.babazaishi && options.userInfo.mamazaishi ? (getRandom() === 0 ? '妈咪，你妈妈喜极而泣' : '爸比，你爸猛男落泪') : options.userInfo.babazaishi ? '爸比，你爸猛男落泪' : options.userInfo.mamazaishi ? '妈咪，你妈妈喜极而泣' : 'hi，周围的人都惊呆了'}，大家都说你早说话，以后一定口齿伶俐`,
    times: (initTimes = 1) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [1, 2], dengji_koucai: [0, 1] }),
    effectAttr: (attr = {}) => ({ ...attr, dengji_koucai: 2 })
  },
  diyicishuohua2: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `你出生以来第一次清晰地喊出${options.userInfo.babazaishi && options.userInfo.mamazaishi ? (getRandom() === 0 ? '妈咪，你妈妈喜极而泣' : '爸比，你爸猛男落泪') : options.userInfo.babazaishi ? '爸比，你爸猛男落泪' : options.userInfo.mamazaishi ? '妈咪，你妈妈喜极而泣' : 'hi，周围的人都惊呆了'}，大家都说你晚说话，以后嘴巴可能会比较笨`,
    times: (initTimes = 1) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [2, 3], dengji_koucai: [0, 1] }),
    effectAttr: (attr = {}) => ({ ...attr, dengji_koucai: 1 })
  },
  // 选项/多选/绑定事件结果（注：一般都是被动事件）
  jiemojirouchuan_jieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    text: (options) => '【点了一串试试】你迫不及待咬下一口芥末鸡肉，那股上头劲儿...',
    bindEvents: (events = {}) => ({
      ...events,
      jiemojirouchuan_jieguo1_bangdingjieguo1: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [MINNUM, 7]
        }
      },
      jiemojirouchuan_jieguo1_bangdingjieguo2: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [7, MAXNUM]
        }
      }
    })
  },
  jiemojirouchuan_jieguo1_bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，你幻想着咬牙吞下去，结果差点被芥末刺杀，最后还是吐掉了，过了好一会依然心有余悸，心里暗骂到底谁才吃得下这玩意儿'
  },
  jiemojirouchuan_jieguo1_bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去(勇气+1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1
    })
  },
  jiemojirouchuan_jieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    text: (options) => '【一串怎么够，东北爷们儿当然直接是来十打】你迫不及待咬下一口芥末鸡肉，那股上头劲儿...(家境-1)',
    triggerConditions: (attr = {}) => ({
      jiajing: [5, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: -1
    }),
    bindEvents: (events = {}) => ({
      ...events,
      jiemojirouchuan_jieguo2_bangdingjieguo1: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [MINNUM, 7]
        }
      },
      jiemojirouchuan_jieguo2_bangdingjieguo2: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [7, 10]
        }
      },
      jiemojirouchuan_jieguo2_bangdingjieguo3: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [10, MAXNUM]
        }
      }
    })
  },
  jiemojirouchuan_jieguo2_bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，你幻想着咬牙吞下去，结果差点被芥末刺杀，最后还是吐掉了，过了好一会依然心有余悸，心里暗骂到底谁才吃得下这玩意儿，最后你一串串地把芥末挑走才吃完了'
  },
  jiemojirouchuan_jieguo2_bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去，但剩下的你再也吃下了，一串串地把芥末挑走才吃完了(勇气+1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1
    })
  },
  jiemojirouchuan_jieguo2_bangdingjieguo3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去，还把剩下的全都给吃完了，事后你去了医院，在家躺了一天才恢复过来(勇气+3，家境-1，体质-1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 3,
      tizhi: -1,
      jiajing: -1
    })
  },
  jiemojirouchuan_jieguo3: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【算了，不点】你和美味失之交臂'
  },
  shaoyanhua1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '看到其他小朋友们烧烟花烧得起劲，你走过去也想上去烧，结果因为穿得太穷酸，被嘲笑了一顿然后把你赶走了(魅力-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [5, 17],
      jiajing: [MINNUM, 5]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -1
    })
  },
  shaoyanhua2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '看到其他小朋友们烧烟花烧得起劲，你走过去也想上去烧，小朋友们看到你身上穿着崭新的高仿奶哥牌衣服，极为羡慕，过年这段时间你都成了这条guy最靓的崽(魅力+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [5, 17],
      jiajing: [5, 10]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 1
    })
  },
  shaoyanhua3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你爸给你买了一大堆烟花，附近的小朋友都羡慕极了，纷纷上前讨好你，好一段时间里他们都尊你为孩子王(魅力+2)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      babazaishi: [1, MAXNUM],
      zailaojia: [1, MAXNUM],
      age: [5, 17],
      jiajing: [10, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 2
    })
  },
  shaoyanhua4: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花噼啪响，百花齐放，但你好像完全不感兴趣',
    triggerConditions: (attr = {}) => ({
      ...attr,
      age: [5, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  shaoyanhua5: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你被吓出了屎，把你爸妈熏得够呛',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [MINNUM, 3]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  shaoyanhua6: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你却出其的镇定，大家都说你有大将之风(勇气+1, 魅力+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [5, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1,
      meili: 1
    })
  },
  shaoyanhua7: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你被吓哭了，但没多久又能平静下来，如此反复横跳了很久，你爸妈因此被折腾得不行',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [3, 5]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  mamadamajiang1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你跟着你妈去亲戚家打麻将，你在旁边大吵大闹影响了风水，亏惨了，于是你的红包被上缴了，还被骂了一顿(家境-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      mamazaishi: [1, MAXNUM],
      age: [5, 18]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      jiajing: -1
    })
  },
  mamadamajiang2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你妈去亲戚家打麻将，亏惨了，幸好你没跟着去，不然肯定少不了一顿迁怒',
    triggerConditions: (attr = {}) => ({
      ...attr,
      mamazaishi: [1, MAXNUM],
      age: [5, 18]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  mamadamajiang3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你跟着你妈去亲戚家打麻将，隐约中你仿佛感应到了什么，鬼使神差地坐在了你妈身后的某个角落，结果你妈打麻将赢麻了，还给了你一封大红包(家境+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      mamazaishi: [1, MAXNUM],
      zailaojia: [1, MAXNUM],
      age: [5, 18],
      jiajing: [10, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 1
    })
  },
  bbzhuazhou_jieguo12: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【这么迷信干嘛？不选】你看了看桌上的东西，一点兴趣也没有，小小年纪竟然能露出一脸不屑的神情，大家都被你逗乐了',
    effectAttr: (attr = {}) => ({
      ...attr,
      dengji_weiwuzhuyi: 1
    })
  },
  bbzhuazhou_jieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【笔】你周围的人都认为你块学习的料，以后高考当状元上电视，清华北大必定是任君选择(智力+2)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zhili: 2
    })
  },
  bbzhuazhou_jieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【木锤】你周围的人都认为你以后很可能就是第二个张三，想着以后一定要跟你搞好关系，以后要是跟恶势力斗争就得靠你了(魅力+1，勇气+1)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 1,
      yongqi: 1
    })
  },
  bbzhuazhou_jieguo3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【计算器】你周围的人认为你以后说不定能当个包租公，每天在家数钱，纷纷给你递来红包讨好(家境+1，魅力+1)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 1,
      meili: 1
    })
  },
  bbzhuazhou_jieguo4: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【钱】你周围的人觉得你未来一定会是个大老板，说不准会成为第二个巴菲特，纷纷给你递来红包讨好(家境+1，运气+1)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 1,
      yunqi: 1
    })
  },
  bbzhuazhou_jieguo5: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【画】你周围的人觉得以后你很可能是个艺术生，不是明星就是大画家，虽然你还不会写字签名，但他们全都一拥而上，取而代之的是拿着你的脚丫子印了大半天(魅力+2)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 2
    })
  },
  bbzhuazhou_jieguo6: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【印章】你周围的人一看到你抓了个印章，就仿佛认定了你以后会是个做官的，纷纷给你递来红包讨好(家境+2)',
    triggerConditions: (attr = {}) => ({
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 2
    })
  },
  bbzhuazhou_jieguo7: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【爸爸的电脑】你周围的人看到你选电脑，以后不是个总爱玩游戏的，就是个秃头程序猿，对你失去了兴趣(智力+4，魅力-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zhili: [8, MAXNUM],
      babazaishi: [1, MAXNUM],
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zhili: 4,
      meili: -1
    })
  },
  bbzhuazhou_jieguo8: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【木剑】这虽然只是一把粗劣的木剑，但你仿佛天生对这种剑形状的东西异常敏感，根本无法克制它对你的吸引力(体质+4)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      tizhi: [5, MAXNUM],
      tianfu_jianshu: [2, MAXNUM],
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 4,
      tianfu_jianshu: 1
    })
  },
  bbzhuazhou_jieguo9: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【???】你在众目睽睽之下，竟然爬到了一个阴暗角落，徒手一抓，也不知道抓到了什么，周围的人瞬间被吓坏了(体质+8，勇气+3，智力-4)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      tezhi_weizhi: 1
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 8,
      yongqi: 3,
      zhili: -4
    })
  },
  bbzhuazhou_jieguo10: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【妈妈的口红】你妈妈的口红不小心掉了下来，眼疾手快的你一下子就把口红给抓住了，大家都说爱美的女人运气不会太差(魅力+2，运气+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      meili: [8, MAXNUM],
      mamazaishi: [1, MAXNUM],
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 2,
      yunqi: 1
    })
  },
  bbzhuazhou_jieguo11: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '【仙女棒】这虽然只是一把粗劣的塑料玩具，但你仿佛天生对魔法棒这种东西异常敏感，仿佛拥有魔力一般将你吸引住(智力+4)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zhili: [5, MAXNUM],
      tianfu_mofa: [2, MAXNUM],
      dengji_weiwuzhuyi: [0, 4]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zhili: 4,
      tianfu_mofa: 1
    })
  },

  // 测试示例事件
  putong1: {
    ...defaultNormalEvent,
    text: (options) => '【普通事件】'
  },
  beidong_putong1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: (options) => '【被动普通事件】'
  },
  passive1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【概率事件结果1】'
  },
  passive2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【概率事件结果2】'
  },
  bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【绑定事件结果1】'
  },
  bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【绑定事件结果2】'
  },
  xuanxiangshijian1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【选项事件结果1】'
  },
  xuanxiangshijian2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【选项事件结果2】'
  },
  duoxuanshijian1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【多选事件结果1】'
  },
  duoxuanshijian2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【多选事件结果2】'
  }
}
