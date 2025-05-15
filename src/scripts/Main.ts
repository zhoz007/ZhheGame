/**
 * 游戏入口文件
 */
import { GameController } from "./core/GameController";

// 游戏启动函数
export function startGame() {
    console.log("《正合智育》中医模拟经营游戏启动中...");
    
    // 初始化游戏控制器
    const gameController = GameController.getInstance();
    gameController.initGame();
    
    console.log("游戏启动完成!");
}

// 自动启动游戏
startGame();