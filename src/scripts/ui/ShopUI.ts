/**
 * 店铺经营界面 - 实现店铺管理、顾客交互功能
 */
import { BaseUI } from "./BaseUI";
import { ShopSystem, ShopData, CustomerData } from "../gameplay/ShopSystem";
import { HerbSystem } from "../gameplay/HerbSystem";

export class ShopUI extends BaseUI {
    private shopInfoElement: HTMLElement | null = null;
    private inventoryElement: HTMLElement | null = null;
    private customersElement: HTMLElement | null = null;
    private actionsElement: HTMLElement | null = null;
    
    private shopSystem = ShopSystem.getInstance();
    private herbSystem = HerbSystem.getInstance();
    
    constructor() {
        super("shop-ui");
    }
    
    public init(): void {
        // 创建店铺界面
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.style.display = "none";
        
        // 店铺信息区域
        this.shopInfoElement = document.createElement("div");
        this.shopInfoElement.className = "shop-info";
        
        // 库存区域
        this.inventoryElement = document.createElement("div");
        this.inventoryElement.className = "inventory";
        
        // 顾客区域
        this.customersElement = document.createElement("div");
        this.customersElement.className = "customers";
        
        // 操作区域
        this.actionsElement = document.createElement("div");
        this.actionsElement.className = "actions";
        
        // 添加到主界面
        this.element.appendChild(this.shopInfoElement);
        this.element.appendChild(this.inventoryElement);
        this.element.appendChild(this.customersElement);
        this.element.appendChild(this.actionsElement);
        
        document.body.appendChild(this.element);
    }
    
    public show(): void {
        if (this.element) {
            this.element.style.display = "block";
            this.updateShopInfo();
            this.updateInventory();
            this.updateCustomers();
            this.updateActions();
        }
    }
    
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
    
    public update(data?: any): void {
        this.updateShopInfo();
        this.updateInventory();
        this.updateCustomers();
    }
    
    // 更新店铺信息
    private updateShopInfo(): void {
        if (!this.shopInfoElement) return;
        
        const shopData = this.shopSystem.getShopData();
        
        this.shopInfoElement.innerHTML = `
            <h3>店铺信息</h3>
            <p>等级: ${shopData.level}</p>
            <p>声望: ${shopData.reputation}</p>
            <p>资金: ${shopData.cash}金币</p>
            <p>装修等级: ${shopData.decorationLevel}</p>
            <p>雇员数量: ${shopData.employeeCount}</p>
            <p>日均顾客: ${shopData.dailyCustomers}人</p>
        `;
    }
    
    // 更新库存
    private updateInventory(): void {
        if (!this.inventoryElement) return;
        
        this.inventoryElement.innerHTML = '<h3>药材库存</h3>';
        
        const inventory = this.shopSystem.getInventory();
        
        if (inventory.length === 0) {
            this.inventoryElement.innerHTML += '<p>暂无库存</p>';
            return;
        }
        
        const inventoryTable = document.createElement("table");
        inventoryTable.innerHTML = `
            <tr>
                <th>药材</th>
                <th>库存</th>
                <th>价格</th>
                <th>操作</th>
            </tr>
        `;
        
        inventory.forEach(item => {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${item.herb.name}</td>
                <td>${item.stock}</td>
                <td>
                    <input type="number" value="${item.price}" min="1" class="price-input" data-herb-id="${item.herb.id}">
                </td>
                <td>
                    <button class="update-price-btn" data-herb-id="${item.herb.id}">更新价格</button>
                </td>
            `;
            
            inventoryTable.appendChild(row);
        });
        
        this.inventoryElement.appendChild(inventoryTable);
        
        // 添加价格更新事件
        const updateButtons = this.inventoryElement.querySelectorAll('.update-price-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const herbId = (e.target as HTMLElement).getAttribute('data-herb-id');
                if (!herbId) return;
                
                const input = this.inventoryElement!.querySelector(`.price-input[data-herb-id="${herbId}"]`) as HTMLInputElement;
                if (!input) return;
                
                const newPrice = parseInt(input.value);
                if (isNaN(newPrice) || newPrice <= 0) {
                    alert("请输入有效价格");
                    return;
                }
                
                this.shopSystem.updateHerbPrice(herbId, newPrice);
                alert("价格已更新");
            });
        });
    }
    
    // 更新顾客
    private updateCustomers(): void {
        if (!this.customersElement) return;
        
        this.customersElement.innerHTML = '<h3>当前顾客</h3>';
        
        const customers = this.shopSystem.getCurrentCustomers();
        
        if (customers.length === 0) {
            this.customersElement.innerHTML += '<p>暂无顾客</p>';
            
            // 添加生成顾客按钮
            const generateButton = document.createElement("button");
            generateButton.textContent = "开门营业";
            generateButton.onclick = () => this.generateCustomers();
            this.customersElement.appendChild(generateButton);
            
            return;
        }
        
        const customersList = document.createElement("div");
        customersList.className = "customers-list";
        
        customers.forEach(customer => {
            const customerItem = document.createElement("div");
            customerItem.className = "customer-item";
            
            customerItem.innerHTML = `
                <h4>${customer.name}</h4>
                <p>预算: ${customer.budget}金币</p>
                <p>耐心: ${customer.patience}%</p>
                <p>需求:</p>
            `;
            
            // 显示顾客需求
            const needsList = document.createElement("ul");
            customer.desiredHerbs.forEach(herbId => {
                const herb = this.herbSystem.getHerbById(herbId);
                if (herb) {
                    const item = document.createElement("li");
                    item.textContent = herb.name;
                    needsList.appendChild(item);
                }
            });
            
            customerItem.appendChild(needsList);
            
            // 添加服务按钮
            const serveButton = document.createElement("button");
            serveButton.textContent = "接待顾客";
            serveButton.onclick = () => this.serveCustomer(customer.id);
            customerItem.appendChild(serveButton);
            
            customersList.appendChild(customerItem);
        });
        
        this.customersElement.appendChild(customersList);
    }
    
    // 更新操作区域
    private updateActions(): void {
        if (!this.actionsElement) return;
        
        this.actionsElement.innerHTML = '<h3>店铺管理</h3>';
        
        // 添加店铺升级按钮
        const upgradeButton = document.createElement("button");
        upgradeButton.textContent = "升级店铺";
        upgradeButton.onclick = () => this.upgradeShop();
        this.actionsElement.appendChild(upgradeButton);
        
        // 添加雇佣员工按钮
        const hireButton = document.createElement("button");
        hireButton.textContent = "雇佣员工";
        hireButton.onclick = () => this.hireEmployee();
        this.actionsElement.appendChild(hireButton);
        
        // 添加装修按钮
        const decorateButton = document.createElement("button");
        decorateButton.textContent = "店铺装修";
        decorateButton.onclick = () => this.decorateShop();
        this.actionsElement.appendChild(decorateButton);
    }
    
    // 生成顾客
    private generateCustomers(): void {
        this.shopSystem.generateCustomers();
        this.updateCustomers();
    }
    
    // 接待顾客
    private serveCustomer(customerId: string): void {
        const result = this.shopSystem.processCustomerPurchase(customerId);
        
        alert(`交易完成，获得${result}金币`);
        
        // 更新界面
        this.updateShopInfo();
        this.updateInventory();
        this.updateCustomers();
    }
    
    // 升级店铺
    private upgradeShop(): void {
        const success = this.shopSystem.upgradeShop();
        
        if (success) {
            alert("店铺升级成功!");
        } else {
            alert("资金不足，无法升级!");
        }
        
        this.updateShopInfo();
    }
    
    // 雇佣员工
    private hireEmployee(): void {
        const success = this.shopSystem.hireEmployee();
        
        if (success) {
            alert("雇佣员工成功!");
        } else {
            alert("资金不足或已达到雇员上限!");
        }
        
        this.updateShopInfo();
    }
    
    // 店铺装修
    private decorateShop(): void {
        const success = this.shopSystem.upgradeDecoration();
        
        if (success) {
            alert("店铺装修成功!");
        } else {
            alert("资金不足或已达到装修上限!");
        }
        
        this.updateShopInfo();
    }
}