import { component, inject } from "tsdi";
import Victor = require("victor");
import { House } from "../actors/towers/house";
import { Controller } from "../controller";
import { Package } from "../actors/package";
import { Houses } from "./houses";

@component
export class Packages implements Controller {
    @inject("Houses") private houses: Houses;

    private packages: Package[] = [];

    public update(dt: number) {
        this.packages.forEach(house => house.update(dt));
    }

    public generatePackage(pos: Victor, house: House) {
        const pack = new Package(pos, this.houses.randomExcept(house));
        this.packages.push(pack);
        return pack;
    }
}
