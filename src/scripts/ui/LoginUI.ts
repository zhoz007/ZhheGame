/**
 * 登录界面 - 处理用户登录和注册
 */
import { GameController, GameState } from "../core/GameController";
import { AuthManager, AuthEvent } from "../core/auth/AuthManager";

export class LoginUI {
    private element: HTMLElement | null = null;
    private loginForm: HTMLElement | null = null;
    private registerForm: HTMLElement | null = null;
    
    constructor() {
        this.init();
    }
    
    private init(): void {
        // 创建主容器
        this.element = document.createElement("div");
        this.element.id = "login-ui";
        this.element.style.display = "none";
        
        // 添加标题
        const title = document.createElement("h1");
        title.textContent = "正合智育 - 中医模拟经营游戏";
        this.element.appendChild(title);
        
        // 创建登录表单
        this.loginForm = this.createLoginForm();
        this.element.appendChild(this.loginForm);
        
        // 创建注册表单
        this.registerForm = this.createRegisterForm();
        this.registerForm.style.display = "none";
        this.element.appendChild(this.registerForm);
        
        // 添加切换按钮
        const switchButton = document.createElement("button");
        switchButton.textContent = "没有账号？点击注册";
        switchButton.onclick = () => this.toggleForms();
        this.element.appendChild(switchButton);
        
        document.body.appendChild(this.element);
        
        // 监听认证事件
        const authManager = AuthManager.getInstance();
        authManager.on(AuthEvent.LOGIN_SUCCESS, () => {
            GameController.getInstance().changeState(GameState.MAIN_MENU);
        });
        
        authManager.on(AuthEvent.LOGIN_FAILED, (error) => {
            alert("登录失败：" + error.message);
        });
        
        authManager.on(AuthEvent.REGISTER_SUCCESS, () => {
            alert("注册成功！请登录");
            this.toggleForms();
        });
        
        authManager.on(AuthEvent.REGISTER_FAILED, (error) => {
            alert("注册失败：" + error.message);
        });
    }
    
    private createLoginForm(): HTMLElement {
        const form = document.createElement("div");
        form.className = "auth-form";
        
        // 用户名输入
        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.placeholder = "用户名";
        usernameInput.required = true;
        
        // 密码输入
        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.placeholder = "密码";
        passwordInput.required = true;
        
        // 登录按钮
        const loginButton = document.createElement("button");
        loginButton.textContent = "登录";
        loginButton.onclick = () => this.handleLogin(usernameInput.value, passwordInput.value);
        
        form.appendChild(usernameInput);
        form.appendChild(passwordInput);
        form.appendChild(loginButton);
        
        return form;
    }
    
    private createRegisterForm(): HTMLElement {
        const form = document.createElement("div");
        form.className = "auth-form";
        
        // 用户名输入
        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.placeholder = "用户名";
        usernameInput.required = true;
        
        // 密码输入
        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.placeholder = "密码";
        passwordInput.required = true;
        
        // 确认密码
        const confirmPasswordInput = document.createElement("input");
        confirmPasswordInput.type = "password";
        confirmPasswordInput.placeholder = "确认密码";
        confirmPasswordInput.required = true;
        
        // 昵称输入
        const nicknameInput = document.createElement("input");
        nicknameInput.type = "text";
        nicknameInput.placeholder = "昵称";
        nicknameInput.required = true;
        
        // 注册按钮
        const registerButton = document.createElement("button");
        registerButton.textContent = "注册";
        registerButton.onclick = () => this.handleRegister(
            usernameInput.value,
            passwordInput.value,
            confirmPasswordInput.value,
            nicknameInput.value
        );
        
        form.appendChild(usernameInput);
        form.appendChild(passwordInput);
        form.appendChild(confirmPasswordInput);
        form.appendChild(nicknameInput);
        form.appendChild(registerButton);
        
        return form;
    }
    
    private async handleLogin(username: string, password: string): Promise<void> {
        if (!username || !password) {
            alert("请输入用户名和密码");
            return;
        }
        
        await AuthManager.getInstance().login(username, password);
    }
    
    private async handleRegister(
        username: string,
        password: string,
        confirmPassword: string,
        nickname: string
    ): Promise<void> {
        if (!username || !password || !confirmPassword || !nickname) {
            alert("请填写所有字段");
            return;
        }
        
        if (password !== confirmPassword) {
            alert("两次输入的密码不一致");
            return;
        }
        
        await AuthManager.getInstance().register(username, password, nickname);
    }
    
    private toggleForms(): void {
        if (this.loginForm && this.registerForm) {
            const isLoginVisible = this.loginForm.style.display !== "none";
            this.loginForm.style.display = isLoginVisible ? "none" : "block";
            this.registerForm.style.display = isLoginVisible ? "block" : "none";
        }
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
} 