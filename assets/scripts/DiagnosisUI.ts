import { _decorator, Component, Node, Button, Label, Prefab, instantiate, Sprite, Color } from 'cc';
import { DataManager, PatientData, SymptomData, HerbData } from './DataManager';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('DiagnosisUI')
export class DiagnosisUI extends Component {
    @property(Label)
    patientNameLabel: Label = null!;
    
    @property(Node)
    symptomsContainer: Node = null!;
    
    @property(Node)
    herbsContainer: Node = null!;
    
    @property(Node)
    prescriptionContainer: Node = null!;
    
    @property(Label)
    resultLabel: Label = null!;
    
    @property(Button)
    diagnoseButton: Button = null!;
    
    @property(Button)
    prescribeButton: Button = null!;
    
    @property(Button)
    backButton: Button = null!;
    
    @property(Prefab)
    herbItemPrefab: Prefab = null!;
    
    private currentPatient: PatientData | null = null;
    private selectedHerbs: string[] = [];
    
    start() {
        // 绑定按钮事件
        this.diagnoseButton.node.on(Button.EventType.CLICK, this.diagnosePatient, this);
        this.prescribeButton.node.on(Button.EventType.CLICK, this.evaluatePrescription, this);
        this.backButton.node.on(Button.EventType.CLICK, () => {
            GameManager.getInstance().switchState(GameState.MAIN_MENU);
        });
        
        // 初始显示
        this.resetDiagnosisUI();
    }
    
    // 重置界面
    private resetDiagnosisUI() {
        this.patientNameLabel.string = "请点击诊脉按钮开始";
        this.symptomsContainer.removeAllChildren();
        this.prescriptionContainer.removeAllChildren();
        this.resultLabel.string = "";
        this.currentPatient = null;
        this.selectedHerbs = [];
        this.updateHerbsList();
    }
    
    // 诊断患者
    private diagnosePatient() {
        // 创建新患者
        this.currentPatient = DataManager.getInstance().createNewPatient();
        this.patientNameLabel.string = `患者：${this.currentPatient.name}`;
        
        // 显示症状
        this.symptomsContainer.removeAllChildren();
        const symptoms = this.currentPatient.symptomIds.map(id => DataManager.getInstance().getAllSymptoms().find(s => s.id === id)!);
        
        for (const symptom of symptoms) {
            const symptomLabel = new Node('SymptomLabel');
            const label = symptomLabel.addComponent(Label);
            label.string = `${symptom.name}：${symptom.description}`;
            this.symptomsContainer.addChild(symptomLabel);
        }
        
        // 更新药材列表
        this.updateHerbsList();
    }
    
    // 更新药材列表
    private updateHerbsList() {
        this.herbsContainer.removeAllChildren();
        const herbs = DataManager.getInstance().getAllHerbs();
        
        for (const herb of herbs) {
            const herbNode = instantiate(this.herbItemPrefab);
            const nameLabel = herbNode.getChildByName('NameLabel')?.getComponent(Label);
            if (nameLabel) {
                nameLabel.string = herb.name;
            }
            
            const effectLabel = herbNode.getChildByName('EffectLabel')?.getComponent(Label);
            if (effectLabel) {
                effectLabel.string = herb.effect;
            }
            
            // 设置点击事件
            herbNode.on(Node.EventType.TOUCH_END, () => {
                this.selectHerb(herb);
            });
            
            this.herbsContainer.addChild(herbNode);
        }
    }
    
    // 选择药材
    private selectHerb(herb: HerbData) {
        if (!this.currentPatient) return;
        
        // 检查是否已选择
        if (this.selectedHerbs.includes(herb.id)) {
            return;
        }
        
        // 添加药材到处方
        this.selectedHerbs.push(herb.id);
        
        // 更新处方显示
        this.updatePrescriptionDisplay();
    }
    
    // 更新处方显示
    private updatePrescriptionDisplay() {
        this.prescriptionContainer.removeAllChildren();
        
        for (const herbId of this.selectedHerbs) {
            const herb = DataManager.getInstance().getAllHerbs().find(h => h.id === herbId)!;
            
            const herbNode = new Node('HerbItem');
            
            // 添加名称标签
            const nameLabel = new Node('NameLabel');
            const label = nameLabel.addComponent(Label);
            label.string = herb.name;
            herbNode.addChild(nameLabel);
            
            // 添加移除按钮
            const removeButton = new Node('RemoveButton');
            const button = removeButton.addComponent(Button);
            const buttonLabel = new Node('Label');
            const btnLabel = buttonLabel.addComponent(Label);
            btnLabel.string = "移除";
            removeButton.addChild(buttonLabel);
            
            // 设置点击事件
            removeButton.on(Button.EventType.CLICK, () => {
                this.removeHerb(herbId);
            });
            
            herbNode.addChild(removeButton);
            this.prescriptionContainer.addChild(herbNode);
        }
    }
    
    // 移除药材
    private removeHerb(herbId: string) {
        const index = this.selectedHerbs.indexOf(herbId);
        if (index !== -1) {
            this.selectedHerbs.splice(index, 1);
            this.updatePrescriptionDisplay();
        }
    }
    
    // 评估处方
    private evaluatePrescription() {
        if (!this.currentPatient || this.selectedHerbs.length === 0) {
            this.resultLabel.string = "请选择药材";
            return;
        }
        
        // 评估处方有效性
        const score = DataManager.getInstance().evaluatePrescription(this.currentPatient.id, this.selectedHerbs);
        
        // 显示结果
        if (score >= 75) {
            this.resultLabel.string = `处方评分: ${score}分，非常有效！`;
        } else if (score >= 50) {
            this.resultLabel.string = `处方评分: ${score}分，比较有效。`;
        } else if (score > 0) {
            this.resultLabel.string = `处方评分: ${score}分，效果一般。`;
        } else {
            this.resultLabel.string = `处方评分: ${score}分，无效处方。`;
        }
        
        // 3秒后重置界面
        this.scheduleOnce(() => {
            this.resetDiagnosisUI();
        }, 3);
    }
} 