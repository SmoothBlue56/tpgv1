// componentData.js with full upgrade levels
export class ComponentData {
  constructor() {
    this.components = {
      engine: [
        { name: 'Basic V8', level: 1, power: 450, reliability: 70, cost: 0 },
        { name: 'Enhanced V8', level: 2, power: 520, reliability: 68, cost: 3000 },
        { name: 'Performance V8', level: 3, power: 580, reliability: 65, cost: 5000 },
        { name: 'Race-Built V8', level: 4, power: 640, reliability: 60, cost: 8000 },
        { name: 'Turbocharged V8', level: 5, power: 700, reliability: 55, cost: 12000 },
        { name: 'Pro Mod Engine', level: 6, power: 800, reliability: 50, cost: 18000 }
      ],
      tires: [
        {
          name: 'Standard Pulling Tires', level: 1, power: 60, reliability: 80, cost: 0,
          weatherPreference: { sunny: 80, cloudy: 75, rainy: 40, hot: 70, cold: 60 }
        },
        {
          name: 'Grooved Tires', level: 2, power: 70, reliability: 78, cost: 2000,
          weatherPreference: { sunny: 85, cloudy: 80, rainy: 60, hot: 75, cold: 65 }
        },
        {
          name: 'High Grip Tires', level: 3, power: 80, reliability: 75, cost: 3500,
          weatherPreference: { sunny: 90, cloudy: 85, rainy: 70, hot: 80, cold: 70 }
        },
        {
          name: 'Advanced Tread Tires', level: 4, power: 90, reliability: 72, cost: 5500,
          weatherPreference: { sunny: 95, cloudy: 90, rainy: 75, hot: 85, cold: 75 }
        },
        {
          name: 'Pro Pull Tires', level: 5, power: 100, reliability: 70, cost: 8000,
          weatherPreference: { sunny: 98, cloudy: 93, rainy: 80, hot: 90, cold: 80 }
        },
        {
          name: 'Extreme Compound Tires', level: 6, power: 110, reliability: 68, cost: 11000,
          weatherPreference: { sunny: 100, cloudy: 95, rainy: 85, hot: 92, cold: 85 }
        }
      ],
      chassis: [
        { name: 'Basic Frame', level: 1, power: 40, reliability: 85, cost: 0 },
        { name: 'Reinforced Frame', level: 2, power: 50, reliability: 82, cost: 2000 },
        { name: 'Tubular Frame', level: 3, power: 60, reliability: 80, cost: 4000 },
        { name: 'Lightweight Frame', level: 4, power: 70, reliability: 75, cost: 6000 },
        { name: 'Carbon Frame', level: 5, power: 80, reliability: 70, cost: 9000 },
        { name: 'Titanium Frame', level: 6, power: 90, reliability: 65, cost: 13000 }
      ],
      transfer: [
        { name: 'Stock Transfer Case', level: 1, power: 35, reliability: 90, cost: 0, ratio: 2.5 },
        { name: 'Low-Range Case', level: 2, power: 45, reliability: 87, cost: 1500, ratio: 2.8 },
        { name: 'Performance Case', level: 3, power: 55, reliability: 85, cost: 3000, ratio: 3.0 },
        { name: 'Race Case', level: 4, power: 65, reliability: 82, cost: 5000, ratio: 3.2 },
        { name: 'Torque Master Case', level: 5, power: 75, reliability: 80, cost: 7500, ratio: 3.4 },
        { name: 'Pro Mod Case', level: 6, power: 85, reliability: 78, cost: 11000, ratio: 3.6 }
      ]
    };
  }

  getUpgradeShop() {
    return this.components;
  }

  getBasicComponent(type) {
    return { ...this.components[type][0] };
  }

  getComponent(type, level) {
    return this.components[type].find(comp => comp.level === level);
  }

  getAllComponents() {
    return this.components;
  }
}
