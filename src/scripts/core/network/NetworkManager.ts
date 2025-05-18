/**
 * 网络管理器 - 负责处理所有网络通信
 */
import { EventEmitter } from "../EventEmitter";

// 网络事件类型
export enum NetworkEvent {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error",
    RECONNECTING = "reconnecting",
    MESSAGE = "message"
}

// 消息类型
export enum MessageType {
    // 系统消息
    SYSTEM = "system",
    // 游戏状态同步
    STATE_SYNC = "state_sync",
    // 玩家操作
    PLAYER_ACTION = "player_action",
    // 聊天消息
    CHAT = "chat",
    // 交易请求
    TRADE_REQUEST = "trade_request",
    // 交易响应
    TRADE_RESPONSE = "trade_response"
}

// 消息接口
export interface NetworkMessage {
    type: MessageType;
    data: any;
    timestamp: number;
}

export class NetworkManager {
    private static instance: NetworkManager;
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // 1秒
    private eventEmitter = new EventEmitter();
    
    private constructor() {}
    
    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }
    
    // 连接到服务器
    public connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(url);
                
                this.ws.onopen = () => {
                    console.log("WebSocket连接成功");
                    this.reconnectAttempts = 0;
                    this.eventEmitter.emit(NetworkEvent.CONNECTED);
                    resolve();
                };
                
                this.ws.onclose = () => {
                    console.log("WebSocket连接关闭");
                    this.eventEmitter.emit(NetworkEvent.DISCONNECTED);
                    this.handleDisconnect();
                };
                
                this.ws.onerror = (error) => {
                    console.error("WebSocket错误:", error);
                    this.eventEmitter.emit(NetworkEvent.ERROR, error);
                    reject(error);
                };
                
                this.ws.onmessage = (event) => {
                    try {
                        const message: NetworkMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error("消息解析错误:", error);
                    }
                };
            } catch (error) {
                console.error("WebSocket连接失败:", error);
                reject(error);
            }
        });
    }
    
    // 断开连接
    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    
    // 发送消息
    public sendMessage(type: MessageType, data: any): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error("WebSocket未连接");
            return;
        }
        
        const message: NetworkMessage = {
            type,
            data,
            timestamp: Date.now()
        };
        
        this.ws.send(JSON.stringify(message));
    }
    
    // 添加事件监听
    public on(event: NetworkEvent, callback: Function): void {
        this.eventEmitter.on(event, callback);
    }
    
    // 移除事件监听
    public off(event: NetworkEvent, callback: Function): void {
        this.eventEmitter.off(event, callback);
    }
    
    // 处理断开连接
    private handleDisconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.eventEmitter.emit(NetworkEvent.RECONNECTING, this.reconnectAttempts);
            
            setTimeout(() => {
                // TODO: 实现重连逻辑
                console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }
    
    // 处理接收到的消息
    private handleMessage(message: NetworkMessage): void {
        this.eventEmitter.emit(NetworkEvent.MESSAGE, message);
        
        // 根据消息类型分发处理
        switch (message.type) {
            case MessageType.STATE_SYNC:
                this.handleStateSync(message.data);
                break;
            case MessageType.PLAYER_ACTION:
                this.handlePlayerAction(message.data);
                break;
            case MessageType.CHAT:
                this.handleChatMessage(message.data);
                break;
            case MessageType.TRADE_REQUEST:
                this.handleTradeRequest(message.data);
                break;
            case MessageType.TRADE_RESPONSE:
                this.handleTradeResponse(message.data);
                break;
            default:
                console.warn("未知消息类型:", message.type);
        }
    }
    
    // 处理状态同步
    private handleStateSync(data: any): void {
        // TODO: 实现状态同步逻辑
        console.log("收到状态同步:", data);
    }
    
    // 处理玩家操作
    private handlePlayerAction(data: any): void {
        // TODO: 实现玩家操作处理逻辑
        console.log("收到玩家操作:", data);
    }
    
    // 处理聊天消息
    private handleChatMessage(data: any): void {
        // TODO: 实现聊天消息处理逻辑
        console.log("收到聊天消息:", data);
    }
    
    // 处理交易请求
    private handleTradeRequest(data: any): void {
        // TODO: 实现交易请求处理逻辑
        console.log("收到交易请求:", data);
    }
    
    // 处理交易响应
    private handleTradeResponse(data: any): void {
        // TODO: 实现交易响应处理逻辑
        console.log("收到交易响应:", data);
    }
} 