import { GameManager } from './gameManager.js';
import { TruckRenderer } from './truckRenderer.js';

class TruckPullingManager {
    constructor() {
        this.gameManager = new GameManager();
        this.truckRenderer = new TruckRenderer();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.renderTruck();
    }

    setupEventListeners() {
        document.getElementById('runPullBtn').addEventListener('click', () => {
            this.runPull();
        });

        document.getElementById('buyTruckBtn').addEventListener('click', () => {
            this.buyTruck();
        });

        // Modal events
        const modal = document.getElementById('upgradeModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    updateDisplay() {
        // Update cash
        document.getElementById('cashAmount').textContent = this.gameManager.cash.toLocaleString();
        
        // Update season info
        const seasonInfo = `Month ${this.gameManager.currentMonth}, Pull ${this.gameManager.currentPull}/10`;
        document.getElementById('seasonInfo').textContent = seasonInfo;

        // Update components
        this.updateComponentsDisplay();
        this.updateUpgradeShop();
    }

    updateComponentsDisplay() {
        const grid = document.getElementById('componentsGrid');
        const truck = this.gameManager.getCurrentTruck();
        
        grid.innerHTML = '';
        
        Object.entries(truck.components).forEach(([type, component]) => {
            const card = document.createElement('div');
            card.className = 'component-card';
            
            const wearColor = component.wear < 25 ? '#4ade80' : 
                             component.wear < 50 ? '#fbbf24' : 
                             component.wear < 75 ? '#f97316' : '#ef4444';
            
            card.innerHTML = `
                <div class="component-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="component-details">
                    <div><strong>${component.name}</strong></div>
                    <div>Power: ${component.power}</div>
                    <div>Reliability: ${component.reliability}</div>
                    <div class="wear-bar">
                        <div class="wear-fill" style="width: ${component.wear}%; background-color: ${wearColor}"></div>
                    </div>
                    <div style="font-size: 0.8em; margin-top: 4px;">Wear: ${component.wear.toFixed(1)}%</div>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    updateUpgradeShop() {
        const upgradeList = document.getElementById('upgradeList');
        upgradeList.innerHTML = '';
        
        Object.entries(this.gameManager.upgradeShop).forEach(([type, upgrades]) => {
            const currentLevel = this.gameManager.getCurrentTruck().components[type].level;
            const nextUpgrade = upgrades.find(u => u.level === currentLevel + 1);
            
            if (nextUpgrade) {
                const item = document.createElement('div');
                item.className = 'upgrade-item';
                
                const canAfford = this.gameManager.cash >= nextUpgrade.cost;
                
                item.innerHTML = `
                    <div>
                        <strong>${nextUpgrade.name}</strong><br>
                        <small>Power: ${nextUpgrade.power} | Reliability: ${nextUpgrade.reliability}</small>
                    </div>
                    <button class="btn ${canAfford ? '' : 'disabled'}" 
                            onclick="app.buyUpgrade('${type}', ${nextUpgrade.level})"
                            ${canAfford ? '' : 'disabled'}>
                        $${nextUpgrade.cost.toLocaleString()}
                    </button>
                `;
                
                upgradeList.appendChild(item);
            }
        });
    }

    buyUpgrade(type, level) {
        const result = this.gameManager.buyUpgrade(type, level);
        if (result.success) {
            this.updateDisplay();
            this.renderTruck();
            this.showNotification(`Upgraded ${type}!`, 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    runPull() {
        const result = this.gameManager.runPull();
        this.displayPullResult(result);
        this.updateDisplay();
    }

    buyTruck() {
        const result = this.gameManager.buyTruck();
        if (result.success) {
            this.updateDisplay();
            this.renderTruck();
            this.showNotification('New truck purchased!', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    displayPullResult(result) {
        const pullsContainer = document.getElementById('seasonPulls');
        
        const pullDiv = document.createElement('div');
        pullDiv.className = 'pull-result';
        pullDiv.style.animation = 'slideIn 0.5s ease-out';
        
        const weatherIcons = {
            sunny: '☀️',
            cloudy: '☁️',
            rainy: '🌧️',
            hot: '🔥',
            cold: '❄️'
        };
        
        const placementColor = result.placement <= 3 ? '#4ade80' : 
                              result.placement <= 6 ? '#fbbf24' : '#ef4444';
        
        pullDiv.innerHTML = `
            <div class="pull-header">
                <span class="location-name">${result.location.name}</span>
                <span class="weather-icon">${weatherIcons[result.weather]}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div><strong>Distance:</strong> ${result.distance} ft</div>
                    <div><strong>Country:</strong> ${result.location.country}</div>
                    <div><strong>Prize:</strong> $${result.prize.toLocaleString()}</div>
                </div>
                <div class="placement" style="color: ${placementColor};">
                    #${result.placement}
                </div>
            </div>
            ${result.componentFailures.length > 0 ? 
                `<div style="color: #ef4444; margin-top: 10px;">
                    <strong>⚠️ Component Failures:</strong><br>
                    ${result.componentFailures.join('<br>')}
                </div>` : ''}
        `;
        
        pullsContainer.insertBefore(pullDiv, pullsContainer.firstChild);
        
        // Limit to 10 results
        while (pullsContainer.children.length > 10) {
            pullsContainer.removeChild(pullsContainer.lastChild);
        }
    }

    renderTruck() {
        this.truckRenderer.render(this.gameManager.getCurrentTruck());
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize the app
window.app = new TruckPullingManager();
