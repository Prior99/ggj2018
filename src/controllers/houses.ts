import { component, initialize } from "tsdi";
import Victor = require("victor");
import { House } from "../actors/house";
import { Controller } from "../controller";

@component("Houses")
export class Houses implements Controller {
    private houses: House[] = [];

    @initialize
    public init() {
        this.houses.push(new House(new Victor(-150, 0)));
        this.houses.push(new House(new Victor(150, 0)));
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
