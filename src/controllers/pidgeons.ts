import { component, initialize } from "tsdi";
import Victor = require("victor");
import { Bird } from "../actors/bird";

@component
export class Pidgeons {
    private pidgeons: Bird[] = [];

    @initialize
    public init() {
        for (let i = 0; i < 50; ++i) {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 600 - 300;
            this.pidgeons.push(new Bird(new Victor(x, y)));
        }

        this.pidgeons[0].follow = true;
    }

    public update(dt: number) {
        this.pidgeons.forEach(pidgeon => pidgeon.update(dt));
    }
}
