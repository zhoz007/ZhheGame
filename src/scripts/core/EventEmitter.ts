/**
 * 事件发射器 - 用于处理事件监听和触发
 */
export class EventEmitter {
    private events: Map<string, Function[]> = new Map();
    
    // 添加事件监听
    public on(event: string, callback: Function): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }
    
    // 移除事件监听
    public off(event: string, callback: Function): void {
        if (!this.events.has(event)) {
            return;
        }
        
        const callbacks = this.events.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
        
        if (callbacks.length === 0) {
            this.events.delete(event);
        }
    }
    
    // 触发事件
    public emit(event: string, ...args: any[]): void {
        if (!this.events.has(event)) {
            return;
        }
        
        const callbacks = this.events.get(event)!;
        callbacks.forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`事件处理错误 [${event}]:`, error);
            }
        });
    }
    
    // 移除所有事件监听
    public removeAllListeners(event?: string): void {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
    
    // 获取事件监听器数量
    public listenerCount(event: string): number {
        return this.events.has(event) ? this.events.get(event)!.length : 0;
    }
} 