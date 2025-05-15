/**
 * 游戏主控制器
 */
import { DiagnosisSystem } from "../gameplay/DiagnosisSystem";
import { HerbSystem } from "../gameplay/HerbSystem";
import { ShopSystem } from "../gameplay/ShopSystem";
import { UIManager } from "../ui/UIManager";

export enum GameState {
    MAIN_MENU,
    DIAGNOSIS,
    HERB_GARDEN,
    SHOP_MANAGEMENT,
    CHALLENGE,
    SETTINGS
}

export class GameController {
    private static instance: GameController;
    
    private currentState: GameState = GameState.MAIN_MENU;
    private playerData = {
        name: "玩家",
        level: 1,
        exp: 0,
        gold: 1000,
        reputation: 50
    };
    
    private constructor() {}
    
    public static getInstance(): GameController {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }
    
    // 初始化游戏
    public initGame(): void {
        console.log("游戏初始化中...");
        
        // 初始化各系统
        DiagnosisSystem.getInstance();
        HerbSystem.getInstance();
        ShopSystem.getInstance();
        
        // 初始化UI管理器
        const uiManager = UIManager.getInstance();
        
        // 显示主菜单
        uiManager.switchUI(GameState.MAIN_MENU);
        
        console.log("游戏初始化完成!");
    }
    
    // 切换游戏状态
    public changeState(newState: GameState): void {
        this.currentState = newState;
        
        // 切换UI
        UIManager.getInstance().switchUI(newState);
    }
    
    // 获取当前状态
    public getCurrentState(): GameState {
        return this.currentState;
    }
    
    // 获取玩家数据
    public getPlayerData(): any {
        return this.playerData;
    }
    
    // 更新玩家数据
    public updatePlayerData(data: Partial<typeof this.playerData>): void {
        this.playerData = {...this.playerData, ...data};
    }
    
    // 保存游戏
    public saveGame(): boolean {
        // TODO: 实现存档功能
        return true;
    }
    
    // 加载游戏
    public loadGame(): boolean {
        // TODO: 实现读档功能
        return true;
    }
}