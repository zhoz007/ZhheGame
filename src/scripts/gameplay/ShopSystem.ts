/**
 * 店铺经营系统
 */
import { HerbData } from "../data/HerbData";

// 顾客数据
export interface CustomerData {
    id: string;
    name: string;
    budget: number;         // 预算
    desiredHerbs: string[]; // 想要购买的药材ID
    patience: number;       // 耐心值 0-100
    loyalty: number;        // 忠诚度 0-100
}

// 店铺数据
export interface ShopData {
    level: number;          // 店铺等级
    reputation: number;     // 声望 0-100
    cash: number;           // 现金
    decorationLevel: number; // 装修等级
    employeeCount: number;   // 雇员数量
    dailyCustomers: number;  // 日均顾客数
}

export class ShopSystem {
    private static instance: ShopSystem;
    
    private shopData: ShopData;
    private currentCustomers: CustomerData[] = [];
    private inventory: Map<string, {herb: HerbData, price: number, stock: number}> = new Map();
    
    private constructor() {
        // 初始化店铺数据
        this.shopData = {
            level: 1,
            reputation: 50,
            cash: 1000,
            decorationLevel: 1,
            employeeCount: 1,
            dailyCustomers: 5
        };
    }
    
    public static getInstance(): ShopSystem {
        if (!ShopSystem.instance) {
            ShopSystem.instance = new ShopSystem();
        }
        return ShopSystem.instance;
    }
    
    // 获取店铺数据
    public getShopData(): ShopData {
        return this.shopData;
    }
    
    // 更新药材价格
    public updateHerbPrice(herbId: string, price: number): boolean {
        const item = this.inventory.get(herbId);
        if (item) {
            item.price = price;
            this.inventory.set(herbId, item);
            return true;
        }
        return false;
    }
    
    // 添加库存
    public addInventory(herb: HerbData, amount: number): void {
        const item = this.inventory.get(herb.id);
        
        if (item) {
            item.stock += amount;
            this.inventory.set(herb.id, item);
        } else {
            // 基础价格根据稀有度设定
            const basePrice = 10 * (herb.rarity + 1);
            this.inventory.set(herb.id, {
                herb,
                price: basePrice,
                stock: amount
            });
        }
    }
    
    // 生成顾客
    public generateCustomers(): CustomerData[] {
        // 清空当前顾客
        this.currentCustomers = [];
        
        // 根据店铺等级和声望生成顾客
        const customerCount = this.shopData.dailyCustomers + 
                             Math.floor(this.shopData.reputation / 20);
        
        // TODO: 实现顾客生成逻辑
        
        return this.currentCustomers;
    }
    
    // 处理顾客购买
    public processCustomerPurchase(customerId: string): number {
        // TODO: 实现顾客购买逻辑
        // 返回交易金额
        return 0;
    }
    
    // 升级店铺
    public upgradeShop(): boolean {
        const upgradeCost = this.shopData.level * 1000;
        
        if (this.shopData.cash >= upgradeCost) {
            this.shopData.cash -= upgradeCost;
            this.shopData.level += 1;
            this.shopData.dailyCustomers += 2;
            return true;
        }
        
        return false;
    }
    
    // 获取库存列表
    public getInventory(): {herb: HerbData, price: number, stock: number}[] {
        return Array.from(this.inventory.values());
    }
    
    // 获取当前顾客
    public getCurrentCustomers(): CustomerData[] {
        return this.currentCustomers;
    }
    
    // 雇佣员工
    public hireEmployee(): boolean {
        const hireCost = 500 * this.shopData.employeeCount;
        
        if (this.shopData.cash >= hireCost) {
            this.shopData.cash -= hireCost;
            this.shopData.employeeCount += 1;
            this.shopData.dailyCustomers += 1;
            return true;
        }
        
        return false;
    }
    
    // 升级装修
    public upgradeDecoration(): boolean {
        const upgradeCost = 800 * this.shopData.decorationLevel;
        
        if (this.shopData.cash >= upgradeCost) {
            this.shopData.cash -= upgradeCost;
            this.shopData.decorationLevel += 1;
            this.shopData.reputation += 10;
            return true;
        }
        
        return false;
    }
}