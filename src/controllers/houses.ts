import { component, initialize, Inject } from "tsdi";
import Victor = require("victor");
import { House } from "../actors/house";
import { Controller } from "../controller";
import { Towers } from "./towers";

@component("Houses")
export class Houses implements Controller {
    @Inject private towers: Towers;

    private houses: House[] = [];

    @initialize
    public init() {
        this.addHouse(new House(new Victor(-150, 0)));
        this.addHouse(new House(new Victor(150, 0)));
        this.houses[0].connect(this.houses[1]);
        this.houses[1].connect(this.houses[0]);
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
