import { component } from "tsdi";
import Victor = require("victor");
import { Pidgeon } from "../actors/pidgeon";

@component
export class Pidgeons {
    private pidgeons: Pidgeon[] = [];

    public init() {
        for (let i = 0; i < 50; ++i) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            this.pidgeons.push(new Pidgeon(new Victor(x, y)));
        }
    }

    public update(dt: number) {
        this.pidgeons.forEach(pidgeon => pidgeon.update(dt));
    }
}
