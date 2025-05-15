/**
 * UI管理器 - 负责界面切换与管理
 */
import { GameController, GameState } from "../core/GameController";

// UI界面基类
export abstract class BaseUI {
    protected element: HTMLElement | null = null;
    
    constructor(protected id: string) {}
    
    public abstract init(): void;
    public abstract show(): void;
    public abstract hide(): void;
    public abstract update(data?: any): void;
}

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
        
        // 添加按钮到容器
        buttonContainer.appendChild(diagnosisButton);
        buttonContainer.appendChild(gardenButton);
        buttonContainer.appendChild(shopButton);
        buttonContainer.appendChild(challengeButton);
        buttonContainer.appendChild(settingsButton);
        
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
        // TODO: 添加挑战界面
        
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