// 信誉分等级系统
// 根据分数返回对应等级名称和描述

export interface CreditLevel {
    name: string;       // 等级名称
    description: string; // 等级描述
    minScore: number;   // 最低分数
    color: string;      // 显示颜色
}

// 等级定义（从低到高）
export const CREDIT_LEVELS: CreditLevel[] = [
    {
        name: '场务级',
        description: '负责搬砖和买盒饭，能把东西凑齐就是胜利',
        minScore: 0,
        color: 'text-gray-500'
    },
    {
        name: '群演级',
        description: '随大流组织，别人怎么干我就怎么干，重在参与',
        minScore: 10,
        color: 'text-blue-500'
    },
    {
        name: '剪辑级',
        description: '擅长化腐朽为神奇，能把凌乱的过程修饰成体面的结果',
        minScore: 30,
        color: 'text-green-500'
    },
    {
        name: '导演级',
        description: '拥有清晰的剧本（方案），能调动各部门演员（同事）各就其位',
        minScore: 60,
        color: 'text-purple-500'
    },
    {
        name: '制片级',
        description: '算得清成本，控得住风险，在预算范围内玩出最高性价比',
        minScore: 100,
        color: 'text-orange-500'
    },
    {
        name: '奥斯卡级',
        description: '无论剧本多烂（资源多差），都能组织出一场载入史册的经典大片',
        minScore: 150,
        color: 'text-yellow-500'
    }
];

// 根据分数获取等级信息
export const getCreditLevel = (score: number): CreditLevel => {
    // 从高到低遍历，找到第一个满足条件的等级
    for (let i = CREDIT_LEVELS.length - 1; i >= 0; i--) {
        if (score >= CREDIT_LEVELS[i].minScore) {
            return CREDIT_LEVELS[i];
        }
    }
    // 默认返回最低等级
    return CREDIT_LEVELS[0];
};

// 获取等级名称（简化版）
export const getCreditLevelName = (score: number): string => {
    return getCreditLevel(score).name;
};
