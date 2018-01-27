import { component, initialize } from "tsdi";
import Victor = require("victor");
import { Bird } from "../actors/bird";
import { Carrier } from "../actors/birds/carrier";
import { Discovery } from "../actors/birds/discovery";
import { Controller } from "../controller";

@component
export class Pidgeons implements Controller {
    private pidgeons: Bird[] = [];

    @initialize
    public init() {
        for (let i = 0; i < 30; ++i) {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 600 - 300;
            this.pidgeons.push(new Carrier(new Victor(x, y)));
        }
        for (let i = 0; i < 10; ++i) {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 600 - 300;
            this.pidgeons.push(new Discovery(new Victor(x, y)));
        }

        this.pidgeons[0].follow = true;
    }

    public update(dt: number) {
        this.pidgeons.forEach(pidgeon => pidgeon.update(dt));
    }
}
