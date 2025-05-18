/**
 * 存档系统 - 负责游戏数据的保存和加载
 */
import { GameController } from "./GameController";

export interface SaveData {
    playerData: {
        name: string;
        level: number;
        exp: number;
        gold: number;
        reputation: number;
    };
    timestamp: number;
    version: string;
}

export class SaveSystem {
    private static instance: SaveSystem;
    private readonly SAVE_KEY_PREFIX = "zhhe_game_save_";
    private readonly CURRENT_VERSION = "1.0.0";
    
    private constructor() {}
    
    public static getInstance(): SaveSystem {
        if (!SaveSystem.instance) {
            SaveSystem.instance = new SaveSystem();
        }
        return SaveSystem.instance;
    }
    
    // 保存游戏
    public saveGame(slot: number): boolean {
        try {
            const gameController = GameController.getInstance();
            const saveData: SaveData = {
                playerData: gameController.getPlayerData(),
                timestamp: Date.now(),
                version: this.CURRENT_VERSION
            };
            
            localStorage.setItem(
                this.SAVE_KEY_PREFIX + slot,
                JSON.stringify(saveData)
            );
            
            return true;
        } catch (error) {
            console.error("保存游戏失败:", error);
            return false;
        }
    }
    
    // 加载游戏
    public loadGame(slot: number): boolean {
        try {
            const saveDataStr = localStorage.getItem(this.SAVE_KEY_PREFIX + slot);
            if (!saveDataStr) {
                return false;
            }
            
            const saveData: SaveData = JSON.parse(saveDataStr);
            
            // 检查版本兼容性
            if (saveData.version !== this.CURRENT_VERSION) {
                console.warn("存档版本不匹配，可能无法正确加载");
            }
            
            const gameController = GameController.getInstance();
            gameController.updatePlayerData(saveData.playerData);
            
            return true;
        } catch (error) {
            console.error("加载游戏失败:", error);
            return false;
        }
    }
    
    // 删除存档
    public deleteSave(slot: number): boolean {
        try {
            localStorage.removeItem(this.SAVE_KEY_PREFIX + slot);
            return true;
        } catch (error) {
            console.error("删除存档失败:", error);
            return false;
        }
    }
    
    // 获取所有存档信息
    public getAllSaves(): { slot: number; data: SaveData }[] {
        const saves: { slot: number; data: SaveData }[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.SAVE_KEY_PREFIX)) {
                try {
                    const slot = parseInt(key.replace(this.SAVE_KEY_PREFIX, ""));
                    const saveData: SaveData = JSON.parse(localStorage.getItem(key) || "");
                    saves.push({ slot, data: saveData });
                } catch (error) {
                    console.error("读取存档信息失败:", error);
                }
            }
        }
        
        return saves.sort((a, b) => b.data.timestamp - a.data.timestamp);
    }
} 