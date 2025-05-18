/**
 * 用户认证管理器 - 处理用户登录、注册和认证
 */
import { NetworkManager, MessageType } from "../network/NetworkManager";
import { EventEmitter } from "../EventEmitter";

// 认证事件类型
export enum AuthEvent {
    LOGIN_SUCCESS = "login_success",
    LOGIN_FAILED = "login_failed",
    REGISTER_SUCCESS = "register_success",
    REGISTER_FAILED = "register_failed",
    LOGOUT = "logout",
    TOKEN_EXPIRED = "token_expired"
}

// 用户信息接口
export interface UserInfo {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    level: number;
    exp: number;
    gold: number;
    reputation: number;
    lastLoginTime: number;
}

export class AuthManager {
    private static instance: AuthManager;
    private eventEmitter = new EventEmitter();
    private currentUser: UserInfo | null = null;
    private token: string | null = null;
    
    private constructor() {
        // 从本地存储加载token
        this.token = localStorage.getItem("auth_token");
        if (this.token) {
            // TODO: 验证token有效性
            this.validateToken();
        }
    }
    
    public static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }
    
    // 用户登录
    public async login(username: string, password: string): Promise<boolean> {
        try {
            // 发送登录请求
            NetworkManager.getInstance().sendMessage(MessageType.SYSTEM, {
                action: "login",
                username,
                password
            });
            
            // TODO: 等待服务器响应
            // 模拟登录成功
            this.currentUser = {
                id: "user_001",
                username,
                nickname: "测试用户",
                avatar: "assets/avatars/default.png",
                level: 1,
                exp: 0,
                gold: 1000,
                reputation: 0,
                lastLoginTime: Date.now()
            };
            
            this.token = "dummy_token";
            localStorage.setItem("auth_token", this.token);
            
            this.eventEmitter.emit(AuthEvent.LOGIN_SUCCESS, this.currentUser);
            return true;
        } catch (error) {
            console.error("登录失败:", error);
            this.eventEmitter.emit(AuthEvent.LOGIN_FAILED, error);
            return false;
        }
    }
    
    // 用户注册
    public async register(username: string, password: string, nickname: string): Promise<boolean> {
        try {
            // 发送注册请求
            NetworkManager.getInstance().sendMessage(MessageType.SYSTEM, {
                action: "register",
                username,
                password,
                nickname
            });
            
            // TODO: 等待服务器响应
            // 模拟注册成功
            this.eventEmitter.emit(AuthEvent.REGISTER_SUCCESS);
            return true;
        } catch (error) {
            console.error("注册失败:", error);
            this.eventEmitter.emit(AuthEvent.REGISTER_FAILED, error);
            return false;
        }
    }
    
    // 用户登出
    public logout(): void {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem("auth_token");
        this.eventEmitter.emit(AuthEvent.LOGOUT);
    }
    
    // 获取当前用户信息
    public getCurrentUser(): UserInfo | null {
        return this.currentUser;
    }
    
    // 获取认证token
    public getToken(): string | null {
        return this.token;
    }
    
    // 检查是否已登录
    public isLoggedIn(): boolean {
        return this.currentUser !== null && this.token !== null;
    }
    
    // 添加事件监听
    public on(event: AuthEvent, callback: Function): void {
        this.eventEmitter.on(event, callback);
    }
    
    // 移除事件监听
    public off(event: AuthEvent, callback: Function): void {
        this.eventEmitter.off(event, callback);
    }
    
    // 验证token
    private async validateToken(): Promise<boolean> {
        try {
            // 发送token验证请求
            NetworkManager.getInstance().sendMessage(MessageType.SYSTEM, {
                action: "validate_token",
                token: this.token
            });
            
            // TODO: 等待服务器响应
            // 模拟token有效
            return true;
        } catch (error) {
            console.error("Token验证失败:", error);
            this.token = null;
            localStorage.removeItem("auth_token");
            this.eventEmitter.emit(AuthEvent.TOKEN_EXPIRED);
            return false;
        }
    }
} 