/**
 * 药材种植界面 - 实现药材种植、采集功能
 */
import { BaseUI } from "./UIManager";
import { HerbSystem } from "../gameplay/HerbSystem";
import { HerbData, HerbRarity } from "../data/HerbData";

// 药田数据
interface PlotData {
    id: string;
    herbId: string | null;
    plantTime: number | null;
    growthProgress: number; // 0-100
    isLocked: boolean;
}

export class HerbGardenUI extends BaseUI {
    private plotsElement: HTMLElement | null = null;
    private herbsElement: HTMLElement | null = null;
    private infoElement: HTMLElement | null = null;
    
    private herbSystem = HerbSystem.getInstance();
    private plots: PlotData[] = [];
    
    constructor() {
        super("herb-garden-ui");
    }
    
    public init(): void {
        // 创建药材种植界面
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 药田区域
        this.plotsElement = document.createElement("div");
        this.plotsElement.className = "plots-area";
        
        // 药材选择区域
        this.herbsElement = document.createElement("div");
        this.herbsElement.className = "herbs-selection";
        
        // 信息显示区域
        this.infoElement = document.createElement("div");
        this.infoElement.className = "info-panel";
        
        // 添加到主界面
        this.element.appendChild(this.plotsElement);
        this.element.appendChild(this.herbsElement);
        this.element.appendChild(this.infoElement);
        
        document.body.appendChild(this.element);
        
        // 初始化药田
        this.initPlots();
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
            this.updatePlotsDisplay();
            this.updateHerbsList();
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        this.updatePlotsDisplay();
        this.updateHerbsList();
    }
    
    // 初始化药田
    private initPlots(): void {
        // 初始提供6块药田，其中2块锁定
        for (let i = 0; i < 6; i++) {
            this.plots.push({
                id: `plot_${i}`,
                herbId: null,
                plantTime: null,
                growthProgress: 0,
                isLocked: i >= 4 // 最后两块锁定
            });
        }
    }
    
    // 更新药田显示
    private updatePlotsDisplay(): void {
        if (!this.plotsElement) return;
        
        this.plotsElement.innerHTML = '<h3>药田</h3>';
        
        const plotsGrid = document.createElement("div");
        plotsGrid.className = "plots-grid";
        
        this.plots.forEach((plot, index) => {
            const plotElement = document.createElement("div");
            plotElement.className = `plot ${plot.isLocked ? 'locked' : ''}`;
            
            if (plot.isLocked) {
                // 锁定的药田
                plotElement.innerHTML = `
                    <div class="lock-icon">🔒</div>
                    <p>需要解锁</p>
                `;
                
                // 解锁按钮
                const unlockButton = document.createElement("button");
                unlockButton.textContent = "解锁";
                unlockButton.onclick = () => this.unlockPlot(index);
                plotElement.appendChild(unlockButton);
            } else if (plot.herbId) {
                // 已种植药材的药田
                const herb = this.herbSystem.getHerbById(plot.herbId);
                if (herb) {
                    plotElement.innerHTML = `
                        <img src="${herb.imageUrl}" alt="${herb.name}" />
                        <p>${herb.name}</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${plot.growthProgress}%"></div>
                        </div>
                        <p>${plot.growthProgress}%</p>
                    `;
                    
                    // 如果生长完成，显示收获按钮
                    if (plot.growthProgress >= 100) {
                        const harvestButton = document.createElement("button");
                        harvestButton.textContent = "收获";
                        harvestButton.onclick = () => this.harvestHerb(index);
                        plotElement.appendChild(harvestButton);
                    }
                }
            } else {
                // 空药田
                plotElement.innerHTML = `
                    <p>空药田</p>
                    <p>点击种植</p>
                `;
                
                // 点击空药田显示可种植的药材
                plotElement.onclick = () => this.showPlantOptions(index);
            }
            
            plotsGrid.appendChild(plotElement);
        });
        
        this.plotsElement.appendChild(plotsGrid);
    }
    
    // 更新药材列表
    private updateHerbsList(): void {
        if (!this.herbsElement) return;
        
        // 只在选择种植时显示
        this.herbsElement.style.display = "none";
    }
    
    // 显示种植选项
    private showPlantOptions(plotIndex: number): void {
        if (!this.herbsElement) return;
        
        this.herbsElement.style.display = "block";
        this.herbsElement.innerHTML = '<h3>选择要种植的药材</h3>';
        
        // 获取可种植的药材
        const availableHerbs = this.herbSystem.getPlantableHerbs();
        
        if (availableHerbs.length === 0) {
            this.herbsElement.innerHTML += '<p>暂无可种植的药材</p>';
            return;
        }
        
        const herbsList = document.createElement("div");
        herbsList.className = "herbs-list";
        
        availableHerbs.forEach(herb => {
            const herbItem = document.createElement("div");
            herbItem.className = "herb-item";
            herbItem.innerHTML = `
                <img src="${herb.imageUrl}" alt="${herb.name}" />
                <p>${herb.name}</p>
                <p>生长时间: ${herb.growthTime}分钟</p>
                <p>${herb.description}</p>
            `;
            
            // 点击种植
            herbItem.onclick = () => this.plantHerb(plotIndex, herb.id);
            
            herbsList.appendChild(herbItem);
        });
        
        this.herbsElement.appendChild(herbsList);
    }
    
    // 种植药材
    private plantHerb(plotIndex: number, herbId: string): void {
        const plot = this.plots[plotIndex];
        if (!plot || plot.isLocked || plot.herbId) return;
        
        // 更新药田数据
        plot.herbId = herbId;
        plot.plantTime = Date.now();
        plot.growthProgress = 0;
        
        // 隐藏药材选择
        if (this.herbsElement) {
            this.herbsElement.style.display = "none";
        }
        
        // 更新显示
        this.updatePlotsDisplay();
        
        // 启动生长计时器
        this.startGrowthTimer(plotIndex);
    }
    
    // 启动生长计时器
    private startGrowthTimer(plotIndex: number): void {
        const plot = this.plots[plotIndex];
        if (!plot || !plot.herbId || !plot.plantTime) return;
        
        const herb = this.herbSystem.getHerbById(plot.herbId);
        if (!herb) return;
        
        // 计算生长时间（实际游戏中应该是分钟，这里为了演示用秒）
        const growthTimeMs = herb.growthTime * 1000; // 秒为单位
        
        // 更新进度的间隔
        const updateInterval = growthTimeMs / 100;
        
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - plot.plantTime!;
            
            // 计算进度
            plot.growthProgress = Math.min(100, Math.floor((elapsedTime / growthTimeMs) * 100));
            
            // 更新显示
            this.updatePlotsDisplay();
            
            // 如果生长完成，清除定时器
            if (plot.growthProgress >= 100) {
                clearInterval(intervalId);
            }
        }, updateInterval);
    }
    
    // 收获药材
    private harvestHerb(plotIndex: number): void {
        const plot = this.plots[plotIndex];
        if (!plot || !plot.herbId || plot.growthProgress < 100) return;
        
        // 收获药材
        const amount = this.herbSystem.harvestHerb(plot.herbId);
        
        // 显示收获信息
        if (this.infoElement) {
            const herb = this.herbSystem.getHerbById(plot.herbId);
            if (herb) {
                this.infoElement.innerHTML = `
                    <h3>收获成功!</h3>
                    <p>获得 ${herb.name} x${amount}</p>
                `;
                
                // 3秒后清除信息
                setTimeout(() => {
                    if (this.infoElement) {
                        this.infoElement.innerHTML = '';
                    }
                }, 3000);
            }
        }
        
        // 重置药田
        plot.herbId = null;
        plot.plantTime = null;
        plot.growthProgress = 0;
        
        // 更新显示
        this.updatePlotsDisplay();
    }
    
    // 解锁药田
    private unlockPlot(plotIndex: number): void {
        const plot = this.plots[plotIndex];
        if (!plot || !plot.isLocked) return;
        
        // TODO: 检查玩家金币是否足够
        const unlockCost = 500 * (plotIndex - 3); // 简单计算解锁费用
        
        // 解锁药田
        plot.isLocked = false;
        
        // 更新显示
        this.updatePlotsDisplay();
    }
}