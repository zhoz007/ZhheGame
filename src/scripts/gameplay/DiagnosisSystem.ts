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
        // TODO: 根据难度生成患者和症状
        this.currentPatient = {
            id: `patient_${Date.now()}`,
            name: "测试患者",
            age: 30 + Math.floor(Math.random() * 40),
            symptoms: [],
            satisfaction: 50
        };
        
        return this.currentPatient;
    }
    
    // 评估药方
    public evaluatePrescription(prescription: PrescriptionData): number {
        if (!this.currentPatient) {
            return 0;
        }
        
        // TODO: 实现药方评估算法，根据症状和药材属性计算有效性
        // 这里是简单示例
        let effectiveness = 50; // 基础分
        
        // 返回有效性评分
        return effectiveness;
    }
}