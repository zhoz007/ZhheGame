/**
 * 药材数据模型
 */
export enum HerbRarity {
    COMMON = 0,   // 普通
    UNCOMMON = 1, // 少见
    RARE = 2,     // 稀有
    EPIC = 3,     // 珍贵
    LEGENDARY = 4 // 传说
}

export enum HerbNature {
    COLD = 0,     // 寒性
    COOL = 1,     // 凉性
    NEUTRAL = 2,  // 平性
    WARM = 3,     // 温性
    HOT = 4       // 热性
}

export enum HerbFlavor {
    SOUR = 0,     // 酸
    BITTER = 1,   // 苦
    SWEET = 2,    // 甘
    SPICY = 3,    // 辛
    SALTY = 4     // 咸
}

export interface HerbData {
    id: string;           // 药材唯一ID
    name: string;         // 药材名称
    description: string;  // 药材描述
    rarity: HerbRarity;   // 稀有度
    nature: HerbNature;   // 四性（寒热温凉平）
    flavors: HerbFlavor[]; // 五味（酸苦甘辛咸）
    growthTime: number;   // 生长时间（分钟）
    effects: string[];    // 功效列表
    imageUrl: string;     // 图片资源路径
    unlocked: boolean;    // 是否已解锁
    level: number;        // 药材等级
    exp: number;          // 当前经验值
}