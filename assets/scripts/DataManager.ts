import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

// 药材数据
export interface HerbData {
    id: string;
    name: string;
    effect: string;
    growthTime: number;
    price: number;
    count: number;
}

// 症状数据
export interface SymptomData {
    id: string;
    name: string;
    description: string;
    suitableHerbs: string[]; // 适合的药材ID列表
}

// 患者数据
export interface PatientData {
    id: string;
    name: string;
    symptomIds: string[]; // 症状ID列表
    satisfaction: number; // 满意度
}

// 店铺数据
export interface ShopData {
    level: number;
    cash: number;
    reputation: number;
    inventory: {herbId: string, count: number, price: number}[];
}

@ccclass('DataManager')
export class DataManager extends Component {
    private static instance: DataManager | null = null;
    
    // 游戏数据
    private herbs: Map<string, HerbData> = new Map();
    private symptoms: Map<string, SymptomData> = new Map();
    private patients: Map<string, PatientData> = new Map();
    private shop: ShopData = {
        level: 1,
        cash: 100,
        reputation: 50,
        inventory: []
    };
    
    public static getInstance(): DataManager {
        return DataManager.instance!;
    }
    
    start() {
        DataManager.instance = this;
        this.initGameData();
    }
    
    private initGameData() {
        // 初始化药材数据
        this.herbs.set('herb001', {id: 'herb001', name: '人参', effect: '补气', growthTime: 10, price: 50, count: 0});
        this.herbs.set('herb002', {id: 'herb002', name: '当归', effect: '补血', growthTime: 8, price: 30, count: 0});
        this.herbs.set('herb003', {id: 'herb003', name: '黄芪', effect: '提高免疫力', growthTime: 6, price: 20, count: 0});
        
        // 初始化症状数据
        this.symptoms.set('symp001', {id: 'symp001', name: '头痛', description: '头部疼痛，疼痛剧烈', suitableHerbs: ['herb002']});
        this.symptoms.set('symp002', {id: 'symp002', name: '乏力', description: '全身乏力，精神不振', suitableHerbs: ['herb001', 'herb003']});
        this.symptoms.set('symp003', {id: 'symp003', name: '发热', description: '体温升高，面色潮红', suitableHerbs: ['herb002']});
    }
    
    // 获取所有药材
    public getAllHerbs(): HerbData[] {
        return Array.from(this.herbs.values());
    }
    
    // 获取所有症状
    public getAllSymptoms(): SymptomData[] {
        return Array.from(this.symptoms.values());
    }
    
    // 获取随机症状
    public getRandomSymptom(): SymptomData {
        const symptoms = Array.from(this.symptoms.values());
        return symptoms[Math.floor(Math.random() * symptoms.length)];
    }
    
    // 获取店铺数据
    public getShopData(): ShopData {
        return this.shop;
    }
    
    // 更新店铺数据
    public updateShopData(shopData: Partial<ShopData>) {
        this.shop = {...this.shop, ...shopData};
    }
    
    // 增加药材数量
    public addHerb(herbId: string, count: number = 1) {
        const herb = this.herbs.get(herbId);
        if (herb) {
            herb.count += count;
        }
    }
    
    // 创建新患者
    public createNewPatient(): PatientData {
        const id = 'patient' + Date.now();
        const names = ['张三', '李四', '王五', '赵六'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        // 随机选择1-3个症状
        const symptomCount = Math.floor(Math.random() * 3) + 1;
        const allSymptoms = Array.from(this.symptoms.values());
        const symptomIds: string[] = [];
        
        for (let i = 0; i < symptomCount; i++) {
            const randomSymptom = allSymptoms[Math.floor(Math.random() * allSymptoms.length)];
            if (!symptomIds.includes(randomSymptom.id)) {
                symptomIds.push(randomSymptom.id);
            }
        }
        
        const patient: PatientData = {
            id,
            name,
            symptomIds,
            satisfaction: 50
        };
        
        this.patients.set(id, patient);
        return patient;
    }
    
    // 评估处方
    public evaluatePrescription(patientId: string, herbIds: string[]): number {
        const patient = this.patients.get(patientId);
        if (!patient) return 0;
        
        let score = 0;
        const patientSymptoms = patient.symptomIds.map(id => this.symptoms.get(id)!);
        
        // 检查每个症状是否有对应的药材
        for (const symptom of patientSymptoms) {
            const hasMatchingHerb = herbIds.some(herbId => symptom.suitableHerbs.includes(herbId));
            if (hasMatchingHerb) {
                score += 25; // 每匹配一个症状加25分
            }
        }
        
        return score;
    }
} 