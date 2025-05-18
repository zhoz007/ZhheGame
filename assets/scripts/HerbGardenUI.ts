import { _decorator, Component, Node, Button, Label, Prefab, instantiate, Sprite, Color } from 'cc';
import { DataManager, HerbData } from './DataManager';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

// 药田状态
enum PlotState {
    EMPTY,
    GROWING,
    READY_TO_HARVEST
}

// 药田数据
interface PlotData {
    id: number;
    state: PlotState;
    herbId: string | null;
    growthProgress: number;
    startTime: number;
}

@ccclass('HerbGardenUI')
export class HerbGardenUI extends Component {
    @property(Node)
    plotsContainer: Node = null!;
    
    @property(Node)
    herbsPanel: Node = null!;
    
    @property(Label)
    infoLabel: Label = null!;
    
    @property(Button)
    backButton: Button = null!;
    
    private plots: PlotData[] = [];
    private selectedPlotId: number = -1;
    
    start() {
        // 绑定按钮事件
        this.backButton.node.on(Button.EventType.CLICK, () => {
            GameManager.getInstance().switchState(GameState.MAIN_MENU);
        });
        
        // 初始化药田
        this.initPlots();
        
        // 开始定时更新药田状态
        this.schedule(this.updatePlots, 1);
    }
    
    // 初始化药田
    private initPlots() {
        // 创建6个药田
        for (let i = 0; i < 6; i++) {
            this.plots.push({
                id: i,
                state: PlotState.EMPTY,
                herbId: null,
                growthProgress: 0,
                startTime: 0
            });
            
            // 创建药田UI
            const plotNode = new Node(`Plot_${i}`);
            const sprite = plotNode.addComponent(Sprite);
            sprite.color = new Color(150, 75, 0, 255); // 棕色代表土地
            
            // 药田标签
            const label = new Node('Label');
            const plotLabel = label.addComponent(Label);
            plotLabel.string = "空药田";
            plotNode.addChild(label);
            
            // 设置点击事件
            plotNode.on(Node.EventType.TOUCH_END, () => {
                this.onPlotClick(i);
            });
            
            this.plotsContainer.addChild(plotNode);
        }
    }
    
    // 点击药田
    private onPlotClick(plotId: number) {
        const plot = this.plots[plotId];
        
        switch (plot.state) {
            case PlotState.EMPTY:
                // 显示可种植药材
                this.selectedPlotId = plotId;
                this.showHerbsPanel();
                break;
            case PlotState.GROWING:
                // 显示生长进度
                this.infoLabel.string = `生长进度: ${plot.growthProgress.toFixed(1)}%`;
                break;
            case PlotState.READY_TO_HARVEST:
                // 收获药材
                this.harvestHerb(plotId);
                break;
        }
    }
    
    // 显示药材面板
    private showHerbsPanel() {
        this.herbsPanel.removeAllChildren();
        this.herbsPanel.active = true;
        
        const herbs = DataManager.getInstance().getAllHerbs();
        
        for (const herb of herbs) {
            const herbNode = new Node('HerbItem');
            
            // 添加名称标签
            const nameLabel = new Node('NameLabel');
            const label = nameLabel.addComponent(Label);
            label.string = herb.name;
            herbNode.addChild(nameLabel);
            
            // 添加效果标签
            const effectLabel = new Node('EffectLabel');
            const effectLbl = effectLabel.addComponent(Label);
            effectLbl.string = herb.effect;
            herbNode.addChild(effectLabel);
            
            // 添加种植按钮
            const plantButton = new Node('PlantButton');
            const button = plantButton.addComponent(Button);
            const buttonLabel = new Node('Label');
            const btnLabel = buttonLabel.addComponent(Label);
            btnLabel.string = "种植";
            plantButton.addChild(buttonLabel);
            
            // 设置点击事件
            plantButton.on(Button.EventType.CLICK, () => {
                this.plantHerb(this.selectedPlotId, herb.id);
                this.herbsPanel.active = false;
            });
            
            herbNode.addChild(plantButton);
            this.herbsPanel.addChild(herbNode);
        }
    }
    
    // 种植药材
    private plantHerb(plotId: number, herbId: string) {
        if (plotId < 0 || plotId >= this.plots.length) return;
        
        const plot = this.plots[plotId];
        if (plot.state !== PlotState.EMPTY) return;
        
        // 更新药田状态
        plot.state = PlotState.GROWING;
        plot.herbId = herbId;
        plot.growthProgress = 0;
        plot.startTime = Date.now();
        
        // 更新UI
        this.updatePlotUI(plotId);
    }
    
    // 收获药材
    private harvestHerb(plotId: number) {
        if (plotId < 0 || plotId >= this.plots.length) return;
        
        const plot = this.plots[plotId];
        if (plot.state !== PlotState.READY_TO_HARVEST || !plot.herbId) return;
        
        // 获取药材
        const herb = DataManager.getInstance().getAllHerbs().find(h => h.id === plot.herbId);
        if (!herb) return;
        
        // 添加到库存
        DataManager.getInstance().addHerb(plot.herbId);
        
        // 显示收获信息
        this.infoLabel.string = `收获了1份${herb.name}`;
        
        // 重置药田
        plot.state = PlotState.EMPTY;
        plot.herbId = null;
        plot.growthProgress = 0;
        plot.startTime = 0;
        
        // 更新UI
        this.updatePlotUI(plotId);
    }
    
    // 更新所有药田
    private updatePlots() {
        for (let i = 0; i < this.plots.length; i++) {
            const plot = this.plots[i];
            
            if (plot.state === PlotState.GROWING && plot.herbId) {
                const herb = DataManager.getInstance().getAllHerbs().find(h => h.id === plot.herbId);
                if (!herb) continue;
                
                // 计算生长进度
                const currentTime = Date.now();
                const elapsedTime = (currentTime - plot.startTime) / 1000; // 转换为秒
                const growthTimeInSeconds = herb.growthTime;
                plot.growthProgress = (elapsedTime / growthTimeInSeconds) * 100;
                
                // 检查是否完成生长
                if (plot.growthProgress >= 100) {
                    plot.state = PlotState.READY_TO_HARVEST;
                    plot.growthProgress = 100;
                }
                
                // 更新UI
                this.updatePlotUI(i);
            }
        }
    }
    
    // 更新药田UI
    private updatePlotUI(plotId: number) {
        const plot = this.plots[plotId];
        const plotNode = this.plotsContainer.getChildByName(`Plot_${plotId}`);
        if (!plotNode) return;
        
        const label = plotNode.getChildByName('Label')?.getComponent(Label);
        if (!label) return;
        
        const sprite = plotNode.getComponent(Sprite);
        if (!sprite) return;
        
        switch (plot.state) {
            case PlotState.EMPTY:
                label.string = "空药田";
                sprite.color = new Color(150, 75, 0, 255); // 棕色
                break;
            case PlotState.GROWING:
                const herb = DataManager.getInstance().getAllHerbs().find(h => h.id === plot.herbId);
                if (herb) {
                    label.string = `${herb.name} (${plot.growthProgress.toFixed(1)}%)`;
                    sprite.color = new Color(100, 200, 100, 255); // 绿色
                }
                break;
            case PlotState.READY_TO_HARVEST:
                const readyHerb = DataManager.getInstance().getAllHerbs().find(h => h.id === plot.herbId);
                if (readyHerb) {
                    label.string = `${readyHerb.name} (可收获)`;
                    sprite.color = new Color(200, 200, 0, 255); // 黄色
                }
                break;
        }
    }
} 