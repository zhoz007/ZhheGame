import { _decorator, Component, Node, Button } from 'cc';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenuUI')
export class MainMenuUI extends Component {
    start() {
        // 获取所有按钮
        const buttons = this.getComponentsInChildren(Button);
        
        // 绑定按钮点击事件
        for (const button of buttons) {
            const buttonName = button.node.name;
            
            button.node.on(Button.EventType.CLICK, () => {
                switch (buttonName) {
                    case 'DiagnosisButton':
                        GameManager.getInstance().switchState(GameState.DIAGNOSIS);
                        break;
                    case 'HerbGardenButton':
                        GameManager.getInstance().switchState(GameState.HERB_GARDEN);
                        break;
                    case 'ShopButton':
                        GameManager.getInstance().switchState(GameState.SHOP_MANAGEMENT);
                        break;
                }
            });
        }
    }
} 