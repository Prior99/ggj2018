import { component, initialize, inject } from "tsdi";
import Victor = require("victor");
import { House } from "../actors/towers/house";
import { Controller } from "../controller";
import { Towers } from "./towers";

@component("Houses")
export class Houses implements Controller {
    @inject("Towers") private towers: Towers;

    public houses: House[] = [];

    @initialize
    public init() {
        this.addHouse(new House(new Victor(-100, 0)));
        this.addHouse(new House(new Victor(150, -150)));

        this.houses[0].addTarget(this.towers.towers[0]);
        this.houses[1].addTarget(this.towers.towers[5]);
    }

    private addHouse(house: House) {
        this.houses.push(house);
        this.towers.addTower(house);
    }

    public update(dt: number) {
        this.houses.forEach(house => house.update(dt));
    }

    public randomExcept(except: House) {
        const houses = this.houses.filter(house => house !== except);
        const index = Math.floor(houses.length * Math.random());
        return houses[index];
    }
}
