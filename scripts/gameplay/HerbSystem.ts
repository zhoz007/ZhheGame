/**
 * 药材系统 - 种植、采集、管理
 */
import { HerbData, HerbRarity, HerbNature, HerbFlavor } from "../data/HerbData";

export class HerbSystem {
    private static instance: HerbSystem;
    
    private herbs: Map<string, HerbData> = new Map();
    private playerHerbs: Map<string, number> = new Map(); // 玩家拥有的药材及数量
    
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
        // 示例药材数据
        const sampleHerbs: HerbData[] = [
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
            }
            // 更多药材...
        ];
        
        // 添加到药材库
        sampleHerbs.forEach(herb => {
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
        // TODO: 实现种植逻辑，考虑土地、时间等因素
        return true;
    }
    
    // 收获药材
    public harvestHerb(herbId: string): number {
        // TODO: 实现收获逻辑，返回收获数量
        const amount = 1 + Math.floor(Math.random() * 3);
        
        // 更新玩家库存
        const currentAmount = this.playerHerbs.get(herbId) || 0;
        this.playerHerbs.set(herbId, currentAmount + amount);
        
        return amount;
    }
    
    // 获取药材信息
    public getHerbById(herbId: string): HerbData | undefined {
        return this.herbs.get(herbId);
    }
    
    // 获取可种植的药材
    public getPlantableHerbs(): HerbData[] {
        // 简单实现：返回所有已解锁的药材
        return Array.from(this.herbs.values()).filter(herb => herb.unlocked);
    }
}