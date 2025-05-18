import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

export enum GameState {
    MAIN_MENU,
    DIAGNOSIS,
    HERB_GARDEN,
    SHOP_MANAGEMENT
}

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager | null = null;
    
    @property(Node)
    mainMenuNode: Node = null!;
    
    @property(Node)
    diagnosisNode: Node = null!;
    
    @property(Node)
    herbGardenNode: Node = null!;
    
    @property(Node)
    shopNode: Node = null!;
    
    private currentState: GameState = GameState.MAIN_MENU;
    
    public static getInstance(): GameManager {
        return GameManager.instance!;
    }
    
    start() {
        GameManager.instance = this;
        this.switchState(GameState.MAIN_MENU);
    }
    
    public switchState(state: GameState) {
        this.currentState = state;
        
        // 隐藏所有节点
        this.mainMenuNode.active = false;
        this.diagnosisNode.active = false;
        this.herbGardenNode.active = false;
        this.shopNode.active = false;
        
        // 根据状态显示对应节点
        switch (state) {
            case GameState.MAIN_MENU:
                this.mainMenuNode.active = true;
                break;
            case GameState.DIAGNOSIS:
                this.diagnosisNode.active = true;
                break;
            case GameState.HERB_GARDEN:
                this.herbGardenNode.active = true;
                break;
            case GameState.SHOP_MANAGEMENT:
                this.shopNode.active = true;
                break;
        }
    }
} 