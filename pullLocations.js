// pullLocations.js
export class PullLocations {
  constructor() {
    this.locations = [
      { name: "Bowling Green, OH", country: "USA", optimalRatio: 3.2, difficulty: 0.8 },
      { name: "Tomah, WI", country: "USA", optimalRatio: 2.8, difficulty: 0.6 },
      { name: "Louisville, KY", country: "USA", optimalRatio: 2.9, difficulty: 0.5 },
      { name: "Woodstock, ON", country: "Canada", optimalRatio: 3.3, difficulty: 0.9 },
      { name: "Alma, ON", country: "Canada", optimalRatio: 2.8, difficulty: 0.5 },
      { name: "Eext", country: "Netherlands", optimalRatio: 3.4, difficulty: 1.0 },
      { name: "Füchtorf", country: "Germany", optimalRatio: 3.5, difficulty: 1.1 }
    ];
  }

  getRandomLocation() {
    return this.locations[Math.floor(Math.random() * this.locations.length)];
  }

  getAllLocations() {
    return this.locations;
  }

  getLocationsByCountry(country) {
    return this.locations.filter(loc => loc.country === country);
  }
}
