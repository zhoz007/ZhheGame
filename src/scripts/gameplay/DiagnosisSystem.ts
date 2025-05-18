/**
 * 诊脉系统 - 核心玩法
 */
import { HerbData } from "../data/HerbData";

// 症状数据结构
export interface SymptomData {
    id: string;
    name: string;
    description: string;
    severity: number;      // 严重程度 1-5
    requiredNatures: number[]; // 需要的药性
    requiredFlavors: number[]; // 需要的药味
}

// 患者数据
export interface PatientData {
    id: string;
    name: string;
    age: number;
    symptoms: SymptomData[];
    satisfaction: number;  // 满意度 0-100
}

// 药方数据
export interface PrescriptionData {
    id: string;
    herbs: HerbData[];
    effectiveness: number; // 药方有效性 0-100
}

// 常见症状库
const COMMON_SYMPTOMS: SymptomData[] = [
    {
        id: "symptom_001",
        name: "发热",
        description: "体温升高，伴有口渴",
        severity: 3,
        requiredNatures: [2], // 寒性
        requiredFlavors: [1]  // 苦味
    },
    {
        id: "symptom_002",
        name: "咳嗽",
        description: "干咳无痰，咽喉不适",
        severity: 2,
        requiredNatures: [1], // 温性
        requiredFlavors: [2]  // 甘味
    },
    {
        id: "symptom_003",
        name: "头痛",
        description: "头部胀痛，伴有眩晕",
        severity: 2,
        requiredNatures: [2], // 寒性
        requiredFlavors: [3]  // 辛味
    }
];

export class DiagnosisSystem {
    private static instance: DiagnosisSystem;
    
    private currentPatient: PatientData | null = null;
    private availableHerbs: HerbData[] = [];
    
    private constructor() {}
    
    public static getInstance(): DiagnosisSystem {
        if (!DiagnosisSystem.instance) {
            DiagnosisSystem.instance = new DiagnosisSystem();
        }
        return DiagnosisSystem.instance;
    }
    
    // 生成随机患者
    public generatePatient(difficulty: number): PatientData {
        // 根据难度生成患者和症状
        const numSymptoms = Math.min(3, Math.max(1, Math.floor(difficulty / 2)));
        const symptoms: SymptomData[] = [];
        
        // 随机选择症状
        for (let i = 0; i < numSymptoms; i++) {
            const randomIndex = Math.floor(Math.random() * COMMON_SYMPTOMS.length);
            symptoms.push({...COMMON_SYMPTOMS[randomIndex]});
        }
        
        this.currentPatient = {
            id: `patient_${Date.now()}`,
            name: this.generateRandomName(),
            age: 20 + Math.floor(Math.random() * 60),
            symptoms: symptoms,
            satisfaction: 50
        };
        
        return this.currentPatient;
    }
    
    // 评估药方
    public evaluatePrescription(prescription: PrescriptionData): number {
        if (!this.currentPatient) {
            return 0;
        }
        
        let effectiveness = 0;
        const symptoms = this.currentPatient.symptoms;
        
        // 对每个症状进行评估
        for (const symptom of symptoms) {
            let symptomEffectiveness = 0;
            
            // 检查每种药材对症状的疗效
            for (const herb of prescription.herbs) {
                // 检查药性匹配
                const natureMatch = symptom.requiredNatures.includes(herb.nature);
                // 检查药味匹配
                const flavorMatch = symptom.requiredFlavors.includes(herb.flavor);
                
                if (natureMatch && flavorMatch) {
                    symptomEffectiveness += 40; // 完全匹配
                } else if (natureMatch || flavorMatch) {
                    symptomEffectiveness += 20; // 部分匹配
                }
            }
            
            // 考虑症状严重程度
            symptomEffectiveness *= (6 - symptom.severity) / 5;
            
            effectiveness += symptomEffectiveness;
        }
        
        // 计算平均疗效
        effectiveness = Math.min(100, Math.max(0, effectiveness / symptoms.length));
        
        // 更新患者满意度
        if (this.currentPatient) {
            this.currentPatient.satisfaction = Math.min(100, 
                this.currentPatient.satisfaction + (effectiveness - 50) / 2);
        }
        
        return effectiveness;
    }
    
    // 生成随机患者姓名
    private generateRandomName(): string {
        const surnames = ["张", "王", "李", "赵", "陈", "刘", "杨", "黄", "周", "吴"];
        const names = ["明", "华", "强", "伟", "芳", "娜", "秀", "英", "敏", "静"];
        
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        
        return surname + name;
    }
    
    // 获取当前患者
    public getCurrentPatient(): PatientData | null {
        return this.currentPatient;
    }
    
    // 设置可用药材
    public setAvailableHerbs(herbs: HerbData[]): void {
        this.availableHerbs = herbs;
    }
    
    // 获取可用药材
    public getAvailableHerbs(): HerbData[] {
        return this.availableHerbs;
    }
}