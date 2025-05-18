/**
 * 诊脉界面 - 实现望闻问切和开方功能
 */
import { BaseUI } from "./BaseUI";
import { DiagnosisSystem, PatientData, PrescriptionData } from "../gameplay/DiagnosisSystem";
import { HerbSystem } from "../gameplay/HerbSystem";
import { HerbData } from "../data/HerbData";

export class DiagnosisUI extends BaseUI {
    private patientElement: HTMLElement | null = null;
    private symptomsElement: HTMLElement | null = null;
    private herbsElement: HTMLElement | null = null;
    private prescriptionElement: HTMLElement | null = null;
    
    private diagnosisSystem = DiagnosisSystem.getInstance();
    private herbSystem = HerbSystem.getInstance();
    
    private currentPatient: PatientData | null = null;
    private selectedHerbs: HerbData[] = [];
    
    constructor() {
        super("diagnosis-ui");
    }
    
    public init(): void {
        // 创建诊脉界面
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 患者信息区域
        this.patientElement = document.createElement("div");
        this.patientElement.className = "patient-info";
        
        // 症状显示区域
        this.symptomsElement = document.createElement("div");
        this.symptomsElement.className = "symptoms";
        
        // 药材选择区域
        this.herbsElement = document.createElement("div");
        this.herbsElement.className = "herbs-selection";
        
        // 药方区域
        this.prescriptionElement = document.createElement("div");
        this.prescriptionElement.className = "prescription";
        
        // 添加确认按钮
        const confirmButton = document.createElement("button");
        confirmButton.textContent = "确认药方";
        confirmButton.onclick = () => this.confirmPrescription();
        
        // 添加到主界面
        this.element.appendChild(this.patientElement);
        this.element.appendChild(this.symptomsElement);
        this.element.appendChild(this.herbsElement);
        this.element.appendChild(this.prescriptionElement);
        this.element.appendChild(confirmButton);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
            this.generateNewPatient();
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        // 更新诊脉界面
        this.updateHerbsList();
    }
    
    // 生成新患者
    private generateNewPatient(): void {
        this.currentPatient = this.diagnosisSystem.generatePatient(1);
        this.selectedHerbs = [];
        
        // 更新患者信息显示
        if (this.patientElement && this.currentPatient) {
            this.patientElement.innerHTML = `
                <h3>患者信息</h3>
                <p>姓名: ${this.currentPatient.name}</p>
                <p>年龄: ${this.currentPatient.age}岁</p>
            `;
        }
        
        // 更新症状显示
        this.updateSymptomsDisplay();
    }
    
    // 更新症状显示
    private updateSymptomsDisplay(): void {
        if (!this.symptomsElement || !this.currentPatient) return;
        
        this.symptomsElement.innerHTML = '<h3>症状</h3>';
        
        if (this.currentPatient.symptoms.length === 0) {
            this.symptomsElement.innerHTML += '<p>暂无症状信息，请进行望闻问切</p>';
            
            // 添加望闻问切按钮
            const diagnoseButton = document.createElement("button");
            diagnoseButton.textContent = "望闻问切";
            diagnoseButton.onclick = () => this.performDiagnosis();
            this.symptomsElement.appendChild(diagnoseButton);
        } else {
            // 显示已知症状
            const symptomsList = document.createElement("ul");
            this.currentPatient.symptoms.forEach(symptom => {
                const item = document.createElement("li");
                item.textContent = `${symptom.name}: ${symptom.description}`;
                symptomsList.appendChild(item);
            });
            this.symptomsElement.appendChild(symptomsList);
        }
    }
    
    // 执行望闻问切
    private performDiagnosis(): void {
        // TODO: 实现望闻问切小游戏
        console.log("执行望闻问切...");
        
        // 模拟发现症状
        if (this.currentPatient) {
            this.currentPatient.symptoms.push({
                id: "symptom_001",
                name: "头痛",
                description: "疼痛剧烈，以太阳穴为主",
                severity: 3,
                requiredNatures: [2, 3], // 平性或温性
                requiredFlavors: [2, 3]  // 甘味或辛味
            });
            
            this.updateSymptomsDisplay();
        }
    }
    
    // 更新药材列表
    private updateHerbsList(): void {
        if (!this.herbsElement) return;
        
        this.herbsElement.innerHTML = '<h3>可用药材</h3>';
        
        // 获取玩家拥有的药材
        const playerHerbs = this.herbSystem.getPlayerHerbs();
        
        if (playerHerbs.length === 0) {
            this.herbsElement.innerHTML += '<p>暂无可用药材</p>';
            return;
        }
        
        // 创建药材列表
        const herbsList = document.createElement("div");
        herbsList.className = "herbs-list";
        
        playerHerbs.forEach(({herb, count}) => {
            const herbItem = document.createElement("div");
            herbItem.className = "herb-item";
            herbItem.innerHTML = `
                <img src="${herb.imageUrl}" alt="${herb.name}" />
                <p>${herb.name} x${count}</p>
                <p>${herb.description}</p>
            `;
            
            // 点击添加到药方
            herbItem.onclick = () => this.addHerbToPrescription(herb);
            
            herbsList.appendChild(herbItem);
        });
        
        this.herbsElement.appendChild(herbsList);
    }
    
    // 添加药材到药方
    private addHerbToPrescription(herb: HerbData): void {
        // 检查是否已经在药方中
        const existingIndex = this.selectedHerbs.findIndex(h => h.id === herb.id);
        if (existingIndex >= 0) {
            console.log("该药材已在药方中");
            return;
        }
        
        // 添加到选中药材
        this.selectedHerbs.push(herb);
        
        // 更新药方显示
        this.updatePrescriptionDisplay();
    }
    
    // 更新药方显示
    private updatePrescriptionDisplay(): void {
        if (!this.prescriptionElement) return;
        
        this.prescriptionElement.innerHTML = '<h3>当前药方</h3>';
        
        if (this.selectedHerbs.length === 0) {
            this.prescriptionElement.innerHTML += '<p>请选择药材组成药方</p>';
            return;
        }
        
        // 显示已选药材
        const prescriptionList = document.createElement("ul");
        this.selectedHerbs.forEach((herb, index) => {
            const item = document.createElement("li");
            item.textContent = herb.name;
            
            // 添加移除按钮
            const removeButton = document.createElement("button");
            removeButton.textContent = "移除";
            removeButton.onclick = (e) => {
                e.stopPropagation();
                this.removeHerbFromPrescription(index);
            };
            
            item.appendChild(removeButton);
            prescriptionList.appendChild(item);
        });
        
        this.prescriptionElement.appendChild(prescriptionList);
    }
    
    // 从药方中移除药材
    private removeHerbFromPrescription(index: number): void {
        this.selectedHerbs.splice(index, 1);
        this.updatePrescriptionDisplay();
    }
    
    // 确认药方
    private confirmPrescription(): void {
        if (this.selectedHerbs.length === 0) {
            alert("请先选择药材组成药方");
            return;
        }
        
        // 创建药方
        const prescription: PrescriptionData = {
            id: `prescription_${Date.now()}`,
            herbs: this.selectedHerbs,
            effectiveness: 0
        };
        
        // 评估药方
        const effectiveness = this.diagnosisSystem.evaluatePrescription(prescription);
        prescription.effectiveness = effectiveness;
        
        // 显示结果
        alert(`药方评分: ${effectiveness}分`);
        
        // 生成新患者
        this.generateNewPatient();
    }
}