/**
 * 药材系统 - 种植、采集、管理
 */
import { HerbData, HerbRarity, HerbNature, HerbFlavor } from "../data/HerbData";

// 药材生长状态
export enum HerbGrowthState {
    SEEDED,     // 已播种
    GROWING,    // 生长中
    MATURE,     // 成熟
    WILTED      // 枯萎
}

// 药材生长数据
interface HerbGrowthData {
    herbId: string;
    state: HerbGrowthState;
    startTime: number;
    waterLevel: number;    // 水分 0-100
    health: number;        // 健康度 0-100
}

export class HerbSystem {
    private static instance: HerbSystem;
    
    private herbs: Map<string, HerbData> = new Map();
    private playerHerbs: Map<string, number> = new Map(); // 玩家拥有的药材及数量
    private growingHerbs: Map<string, HerbGrowthData> = new Map(); // 正在生长的药材
    
    private constructor() {
        this.initializeHerbs();
    }
    
    public static getInstance(): HerbSystem {
        if (!HerbSystem.instance) {
            HerbSystem.instance = new HerbSystem();
        }
        return HerbSystem.instance;
    }
    
    // 初始化药材数据库
    private initializeHerbs(): void {
        // 药材数据
        const herbData: HerbData[] = [
            {
                id: "herb_001",
                name: "当归",
                description: "补血活血，调经止痛",
                rarity: HerbRarity.UNCOMMON,
                nature: HerbNature.WARM,
                flavors: [HerbFlavor.SWEET, HerbFlavor.SPICY],
                growthTime: 60,
                effects: ["补血", "活血", "调经"],
                imageUrl: "assets/herbs/danggui.png",
                unlocked: true,
                level: 1,
                exp: 0
            },
            {
                id: "herb_002",
                name: "白芍",
                description: "养血柔肝，缓中止痛",
                rarity: HerbRarity.COMMON,
                nature: HerbNature.COOL,
                flavors: [HerbFlavor.BITTER, HerbFlavor.SOUR],
                growthTime: 45,
                effects: ["养血", "柔肝", "止痛"],
                imageUrl: "assets/herbs/baishao.png",
                unlocked: true,
                level: 1,
                exp: 0
            },
            {
                id: "herb_003",
                name: "人参",
                description: "大补元气，复脉固脱",
                rarity: HerbRarity.RARE,
                nature: HerbNature.WARM,
                flavors: [HerbFlavor.SWEET, HerbFlavor.BITTER],
                growthTime: 120,
                effects: ["补气", "固脱", "生津"],
                imageUrl: "assets/herbs/renshen.png",
                unlocked: false,
                level: 1,
                exp: 0
            },
            {
                id: "herb_004",
                name: "黄连",
                description: "清热燥湿，泻火解毒",
                rarity: HerbRarity.COMMON,
                nature: HerbNature.COLD,
                flavors: [HerbFlavor.BITTER],
                growthTime: 30,
                effects: ["清热", "燥湿", "解毒"],
                imageUrl: "assets/herbs/huanglian.png",
                unlocked: true,
                level: 1,
                exp: 0
            }
        ];
        
        // 添加到药材库
        herbData.forEach(herb => {
            this.herbs.set(herb.id, herb);
        });
    }
    
    // 获取所有药材
    public getAllHerbs(): HerbData[] {
        return Array.from(this.herbs.values());
    }
    
    // 获取玩家拥有的药材
    public getPlayerHerbs(): {herb: HerbData, count: number}[] {
        const result: {herb: HerbData, count: number}[] = [];
        
        this.playerHerbs.forEach((count, herbId) => {
            const herb = this.herbs.get(herbId);
            if (herb) {
                result.push({herb, count});
            }
        });
        
        return result;
    }
    
    // 种植药材
    public plantHerb(herbId: string): boolean {
        const herb = this.herbs.get(herbId);
        if (!herb || !herb.unlocked) {
            return false;
        }
        
        // 检查玩家是否有种子
        const seedCount = this.playerHerbs.get(herbId) || 0;
        if (seedCount <= 0) {
            return false;
        }
        
        // 创建生长数据
        const growthData: HerbGrowthData = {
            herbId: herbId,
            state: HerbGrowthState.SEEDED,
            startTime: Date.now(),
            waterLevel: 80,
            health: 100
        };
        
        // 添加到生长列表
        this.growingHerbs.set(herbId, growthData);
        
        // 扣除种子
        this.playerHerbs.set(herbId, seedCount - 1);
        
        return true;
    }
    
    // 浇水
    public waterHerb(herbId: string): boolean {
        const growthData = this.growingHerbs.get(herbId);
        if (!growthData || growthData.state === HerbGrowthState.MATURE) {
            return false;
        }
        
        growthData.waterLevel = Math.min(100, growthData.waterLevel + 20);
        return true;
    }
    
    // 更新生长状态
    public updateGrowth(): void {
        const now = Date.now();
        
        this.growingHerbs.forEach((growthData, herbId) => {
            const herb = this.herbs.get(herbId);
            if (!herb) return;
            
            // 计算生长时间
            const growthTime = (now - growthData.startTime) / 1000; // 转换为秒
            
            // 更新水分和健康度
            growthData.waterLevel = Math.max(0, growthData.waterLevel - 0.1);
            if (growthData.waterLevel < 30) {
                growthData.health = Math.max(0, growthData.health - 0.2);
            }
            
            // 更新生长状态
            if (growthTime >= herb.growthTime) {
                growthData.state = HerbGrowthState.MATURE;
            } else if (growthTime >= herb.growthTime * 0.7) {
                growthData.state = HerbGrowthState.GROWING;
            }
            
            // 检查是否枯萎
            if (growthData.health <= 0) {
                growthData.state = HerbGrowthState.WILTED;
            }
        });
    }
    
    // 收获药材
    public harvestHerb(herbId: string): number {
        const growthData = this.growingHerbs.get(herbId);
        if (!growthData || growthData.state !== HerbGrowthState.MATURE) {
            return 0;
        }
        
        // 计算收获数量
        let amount = 1;
        const herb = this.herbs.get(herbId);
        if (herb) {
            // 根据健康度计算收获量
            amount = Math.floor(1 + (growthData.health / 100) * 2);
        }
        
        // 更新玩家库存
        const currentAmount = this.playerHerbs.get(herbId) || 0;
        this.playerHerbs.set(herbId, currentAmount + amount);
        
        // 移除生长数据
        this.growingHerbs.delete(herbId);
        
        return amount;
    }
    
    // 获取药材信息
    public getHerbById(herbId: string): HerbData | undefined {
        return this.herbs.get(herbId);
    }
    
    // 获取可种植的药材
    public getPlantableHerbs(): HerbData[] {
        return Array.from(this.herbs.values()).filter(herb => herb.unlocked);
    }
    
    // 获取正在生长的药材
    public getGrowingHerbs(): {herb: HerbData, growth: HerbGrowthData}[] {
        const result: {herb: HerbData, growth: HerbGrowthData}[] = [];
        
        this.growingHerbs.forEach((growthData, herbId) => {
            const herb = this.herbs.get(herbId);
            if (herb) {
                result.push({herb, growth: growthData});
            }
        });
        
        return result;
    }
    
    // 解锁新药材
    public unlockHerb(herbId: string): boolean {
        const herb = this.herbs.get(herbId);
        if (!herb) {
            return false;
        }
        
        herb.unlocked = true;
        return true;
    }
}