/**
 * UI管理器 - 负责界面切换与管理
 */
import { GameController, GameState } from "../core/GameController";
import { SaveSystem } from "../core/SaveSystem";
import { BaseUI } from "./BaseUI";

// 主菜单界面
export class MainMenuUI extends BaseUI {
    constructor() {
        super("main-menu");
    }
    
    public init(): void {
        // 创建主菜单元素
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 添加标题
        const title = document.createElement("h1");
        title.textContent = "正合智育 - 中医模拟经营游戏";
        this.element.appendChild(title);
        
        // 创建按钮容器
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "menu-buttons";
        
        // 添加诊脉按钮
        const diagnosisButton = document.createElement("button");
        diagnosisButton.textContent = "诊脉开方";
        diagnosisButton.onclick = () => {
            GameController.getInstance().changeState(GameState.DIAGNOSIS);
        };
        
        // 添加药田按钮
        const gardenButton = document.createElement("button");
        gardenButton.textContent = "药材种植";
        gardenButton.onclick = () => {
            GameController.getInstance().changeState(GameState.HERB_GARDEN);
        };
        
        // 添加店铺按钮
        const shopButton = document.createElement("button");
        shopButton.textContent = "店铺经营";
        shopButton.onclick = () => {
            GameController.getInstance().changeState(GameState.SHOP_MANAGEMENT);
        };
        
        // 添加挑战按钮
        const challengeButton = document.createElement("button");
        challengeButton.textContent = "医术挑战";
        challengeButton.onclick = () => {
            GameController.getInstance().changeState(GameState.CHALLENGE);
        };
        
        // 添加设置按钮
        const settingsButton = document.createElement("button");
        settingsButton.textContent = "设置";
        settingsButton.onclick = () => {
            GameController.getInstance().changeState(GameState.SETTINGS);
        };
        
        // 添加存档按钮
        const saveButton = document.createElement("button");
        saveButton.textContent = "存档";
        saveButton.onclick = () => {
            GameController.getInstance().changeState(GameState.SAVE);
        };
        
        // 添加按钮到容器
        buttonContainer.appendChild(diagnosisButton);
        buttonContainer.appendChild(gardenButton);
        buttonContainer.appendChild(shopButton);
        buttonContainer.appendChild(challengeButton);
        buttonContainer.appendChild(settingsButton);
        buttonContainer.appendChild(saveButton);
        
        // 添加按钮容器到主菜单
        this.element.appendChild(buttonContainer);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        // 更新主菜单UI
    }
}

// 挑战界面
export class ChallengeUI extends BaseUI {
    constructor() {
        super("challenge-ui");
    }
    
    public init(): void {
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 添加标题
        const title = document.createElement("h1");
        title.textContent = "医术挑战";
        this.element.appendChild(title);
        
        // 创建挑战列表
        const challengeList = document.createElement("div");
        challengeList.className = "challenge-list";
        
        // 添加挑战项目
        const challenges = [
            { id: "challenge_001", name: "基础诊脉", difficulty: "简单", reward: "100金币" },
            { id: "challenge_002", name: "疑难杂症", difficulty: "中等", reward: "300金币" },
            { id: "challenge_003", name: "名医会诊", difficulty: "困难", reward: "500金币" }
        ];
        
        challenges.forEach(challenge => {
            const challengeItem = document.createElement("div");
            challengeItem.className = "challenge-item";
            
            const name = document.createElement("h3");
            name.textContent = challenge.name;
            
            const info = document.createElement("p");
            info.textContent = `难度: ${challenge.difficulty} | 奖励: ${challenge.reward}`;
            
            const startButton = document.createElement("button");
            startButton.textContent = "开始挑战";
            startButton.onclick = () => this.startChallenge(challenge.id);
            
            challengeItem.appendChild(name);
            challengeItem.appendChild(info);
            challengeItem.appendChild(startButton);
            
            challengeList.appendChild(challengeItem);
        });
        
        this.element.appendChild(challengeList);
        
        // 添加返回按钮
        const backButton = document.createElement("button");
        backButton.textContent = "返回主菜单";
        backButton.onclick = () => {
            GameController.getInstance().changeState(GameState.MAIN_MENU);
        };
        this.element.appendChild(backButton);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        // 更新挑战界面
    }
    
    private startChallenge(challengeId: string): void {
        // TODO: 实现挑战开始逻辑
        console.log(`开始挑战: ${challengeId}`);
    }
}

// 设置界面
export class SettingsUI extends BaseUI {
    constructor() {
        super("settings-ui");
    }
    
    public init(): void {
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 添加标题
        const title = document.createElement("h1");
        title.textContent = "游戏设置";
        this.element.appendChild(title);
        
        // 创建设置选项
        const settingsContainer = document.createElement("div");
        settingsContainer.className = "settings-container";
        
        // 音量设置
        const volumeSetting = document.createElement("div");
        volumeSetting.className = "setting-item";
        
        const volumeLabel = document.createElement("label");
        volumeLabel.textContent = "音量: ";
        
        const volumeSlider = document.createElement("input");
        volumeSlider.type = "range";
        volumeSlider.min = "0";
        volumeSlider.max = "100";
        volumeSlider.value = "50";
        
        volumeSetting.appendChild(volumeLabel);
        volumeSetting.appendChild(volumeSlider);
        
        // 画质设置
        const qualitySetting = document.createElement("div");
        qualitySetting.className = "setting-item";
        
        const qualityLabel = document.createElement("label");
        qualityLabel.textContent = "画质: ";
        
        const qualitySelect = document.createElement("select");
        ["低", "中", "高"].forEach(quality => {
            const option = document.createElement("option");
            option.value = quality;
            option.textContent = quality;
            qualitySelect.appendChild(option);
        });
        
        qualitySetting.appendChild(qualityLabel);
        qualitySetting.appendChild(qualitySelect);
        
        // 添加设置项到容器
        settingsContainer.appendChild(volumeSetting);
        settingsContainer.appendChild(qualitySetting);
        
        this.element.appendChild(settingsContainer);
        
        // 添加保存按钮
        const saveButton = document.createElement("button");
        saveButton.textContent = "保存设置";
        saveButton.onclick = () => this.saveSettings();
        
        // 添加返回按钮
        const backButton = document.createElement("button");
        backButton.textContent = "返回主菜单";
        backButton.onclick = () => {
            GameController.getInstance().changeState(GameState.MAIN_MENU);
        };
        
        this.element.appendChild(saveButton);
        this.element.appendChild(backButton);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        // 更新设置界面
    }
    
    private saveSettings(): void {
        // TODO: 实现设置保存逻辑
        console.log("保存设置");
    }
}

// 存档界面
export class SaveUI extends BaseUI {
    constructor() {
        super("save-ui");
    }
    
    public init(): void {
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 添加标题
        const title = document.createElement("h1");
        title.textContent = "游戏存档";
        this.element.appendChild(title);
        
        // 创建存档列表
        const saveList = document.createElement("div");
        saveList.className = "save-list";
        
        // 获取所有存档信息
        const saves = SaveSystem.getInstance().getAllSaves();
        if (saves.length > 0) {
            saves.forEach(save => {
                const saveItem = document.createElement("div");
                saveItem.className = "save-item";
                
                const saveTime = new Date(save.data.timestamp).toLocaleString();
                const saveName = document.createElement("h3");
                saveName.textContent = `存档 - ${save.data.playerData.name}`;
                
                const saveTimeText = document.createElement("p");
                saveTimeText.textContent = `保存时间: ${saveTime}`;
                
                const loadButton = document.createElement("button");
                loadButton.textContent = "加载存档";
                loadButton.onclick = () => this.loadSave(save.slot);
                
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "删除存档";
                deleteButton.onclick = () => this.deleteSave(save.slot);
                
                saveItem.appendChild(saveName);
                saveItem.appendChild(saveTimeText);
                saveItem.appendChild(loadButton);
                saveItem.appendChild(deleteButton);
                
                saveList.appendChild(saveItem);
            });
        } else {
            const noSaveText = document.createElement("p");
            noSaveText.textContent = "暂无存档";
            saveList.appendChild(noSaveText);
        }
        
        this.element.appendChild(saveList);
        
        // 添加返回按钮
        const backButton = document.createElement("button");
        backButton.textContent = "返回主菜单";
        backButton.onclick = () => {
            GameController.getInstance().changeState(GameState.MAIN_MENU);
        };
        this.element.appendChild(backButton);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        // 重新渲染存档界面
        if (this.element) {
            this.element.innerHTML = "";
            this.init();
        }
    }
    
    private loadSave(slot: number): void {
        if (SaveSystem.getInstance().loadGame(slot)) {
            alert("加载存档成功！");
            GameController.getInstance().changeState(GameState.MAIN_MENU);
        } else {
            alert("加载存档失败！");
        }
    }
    
    private deleteSave(slot: number): void {
        if (confirm("确定要删除存档吗？")) {
            if (SaveSystem.getInstance().deleteSave(slot)) {
                alert("删除存档成功！");
                this.update();
            } else {
                alert("删除存档失败！");
            }
        }
    }
}

import { DiagnosisUI } from "./DiagnosisUI";
import { HerbGardenUI } from "./HerbGardenUI";
import { ShopUI } from "./ShopUI";

// UI管理器
export class UIManager {
    private static instance: UIManager;
    private uiMap: Map<GameState, BaseUI> = new Map();
    
    private constructor() {
        this.initUI();
    }
    
    public static getInstance(): UIManager {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }
    
    private initUI(): void {
        // 初始化各界面
        this.uiMap.set(GameState.MAIN_MENU, new MainMenuUI());
        this.uiMap.set(GameState.DIAGNOSIS, new DiagnosisUI());
        this.uiMap.set(GameState.HERB_GARDEN, new HerbGardenUI());
        this.uiMap.set(GameState.SHOP_MANAGEMENT, new ShopUI());
        this.uiMap.set(GameState.CHALLENGE, new ChallengeUI());
        this.uiMap.set(GameState.SETTINGS, new SettingsUI());
        this.uiMap.set(GameState.SAVE, new SaveUI());
        
        // 初始化所有UI
        this.uiMap.forEach(ui => ui.init());
    }
    
    // 切换界面
    public switchUI(state: GameState, data?: any): void {
        // 隐藏所有UI
        this.uiMap.forEach(ui => ui.hide());
        
        // 显示目标UI
        const targetUI = this.uiMap.get(state);
        if (targetUI) {
            targetUI.show();
            targetUI.update(data);
        }
    }
    
    // 更新当前UI
    public updateCurrentUI(state: GameState, data: any): void {
        const ui = this.uiMap.get(state);
        if (ui) {
            ui.update(data);
        }
    }
}