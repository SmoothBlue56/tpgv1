// Simplified module-friendly version of the RosebudAI GameManager
import { PullLocations } from './pullLocations.js';
import { ComponentData } from './componentData.js';

export class GameManager {
  constructor() {
    this.cash = 25000;
    this.currentMonth = 1;
    this.currentPull = 1;
    this.trucks = [this.createDefaultTruck(1)];
    this.teamName = "Player Team";
    this.division = [];
    this.pullLocations = new PullLocations();
    this.componentData = new ComponentData();
    this.upgradeShop = this.componentData.getUpgradeShop();
    this.weatherTypes = ['sunny', 'cloudy', 'rainy', 'hot', 'cold'];
    this.initDivision();
  }

  initDivision() {
    this.division = [...this.trucks];
    const teamNames = ["Diesel Demons", "Mud Mavericks", "Track Tyrants"];
    const truckNames = ["Terminator", "Outlaw", "Reaper"];
    const aiCount = 4;
    for (let i = 2; i <= aiCount + 1; i++) {
      const aiTruck = this.createDefaultTruck(i);
      aiTruck.name = truckNames[Math.floor(Math.random() * truckNames.length)];
      aiTruck.teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
      aiTruck.isPlayer = false;
      this.division.push(aiTruck);
    }
  }

  createDefaultTruck(id = 1) {
    return {
      id,
      name: `Super Mod 2WD #${id}`,
      teamName: this.teamName,
      isPlayer: true,
      points: 0,
      wins: 0,
      totalPulls: 0,
      components: {
        engine: { name: 'Basic V8', level: 1, power: 450, reliability: 70, wear: 0 },
        tires: {
          name: 'Standard Pulling Tires', level: 1, power: 60, reliability: 80, wear: 0,
          weatherPreference: { sunny: 80, cloudy: 75, rainy: 40, hot: 70, cold: 60 }
        },
        chassis: { name: 'Basic Frame', level: 1, power: 40, reliability: 85, wear: 0 },
        transfer: { name: 'Stock Transfer Case', level: 1, power: 35, reliability: 90, wear: 0, ratio: 2.5 }
      }
    };
  }

  getCurrentTruck() {
    return this.trucks[0];
  }

  getStandings() {
    return [...this.division].sort((a, b) => b.points - a.points);
  }

  runPull() {
    const location = this.pullLocations.getRandomLocation();
    const weather = this.weatherTypes[Math.floor(Math.random() * this.weatherTypes.length)];

    const results = this.division.map(truck => {
      this.applyWear(truck);
      const perf = this.calculatePerformance(truck, location, weather);
      const distance = this.calculateDistance(perf, location);
      const componentFailures = this.checkComponentFailures(truck);
      return { truck, distance, componentFailures, performance: perf };
    }).sort((a, b) => b.distance - a.distance);

    let yourTruckResult = {};

    results.forEach((r, i) => {
      const place = i + 1;
      const points = 6 - place;
      const prize = r.truck.isPlayer ? this.calculatePrize(place) : 0;

      r.truck.points += Math.max(0, points);
      if (place === 1) r.truck.wins++;

      if (r.truck.isPlayer) {
        this.cash += prize;
        yourTruckResult = {
          name: r.truck.name,
          placement: place,
          prize,
          distance: r.distance,
          componentFailures: r.componentFailures
        };
      }
    });

    this.currentPull++;
    if (this.currentPull > 10) {
      this.currentPull = 1;
      this.currentMonth++;
      this.division.forEach(t => { t.points = 0; t.wins = 0; });
    }

    return {
      location,
      weather,
      yourTruck: yourTruckResult
    };
  }

  applyWear(truck) {
    Object.values(truck.components).forEach(component => {
      component.wear = Math.min(100, component.wear + (1 + Math.random() * 4));
    });
  }

  calculatePerformance(truck, location, weather) {
    let totalPower = 0, totalReliability = 0, count = 0;
    for (const [type, component] of Object.entries(truck.components)) {
      const wearFactor = 1 - component.wear / 100;
      let power = component.power * wearFactor;
      let reliability = component.reliability * wearFactor;

      if (type === 'tires') {
        power *= (component.weatherPreference[weather] / 100);
      }
      if (type === 'transfer') {
        const ratioDiff = Math.abs(component.ratio - location.optimalRatio);
        power *= Math.max(0.7, 1 - (ratioDiff * 0.1));
      }

      totalPower += power;
      totalReliability += reliability;
      count++;
    }
    const basePerf = (totalPower + totalReliability) / count;
    return basePerf * (0.9 + Math.random() * 0.2);
  }

  calculateDistance(performance, location) {
    const base = 200 + (performance / 3);
    return Math.max(50, base - (location.difficulty * 50) + (Math.random() * 100 - 50));
  }

  calculatePrize(place) {
    const payouts = { 1: 5000, 2: 3500, 3: 2500, 4: 2000, 5: 1500 };
    return payouts[place] || 300;
  }

  checkComponentFailures(truck) {
    const failures = [];
    for (const [type, comp] of Object.entries(truck.components)) {
      if (comp.wear >= 100) {
        failures.push(`${comp.name} blew up!`);
        truck.components[type] = { ...this.componentData.getBasicComponent(type), wear: 0 };
      }
    }
    return failures;
  }
}
