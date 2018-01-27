import { component, initialize } from "tsdi";
import Victor = require("victor");
import { House } from "../actors/house";
import { Controller } from "../controller";

@component
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
}
