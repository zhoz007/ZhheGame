/**
 * UI界面基类 - 所有UI组件继承自此类
 */
export abstract class BaseUI {
    protected element: HTMLElement | null = null;
    
    constructor(protected id: string) {}
    
    public abstract init(): void;
    public abstract show(): void;
    public abstract hide(): void;
    public abstract update(data?: any): void;
} 