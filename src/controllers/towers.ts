import { Game } from "../states";
import { component, inject } from "tsdi";
import { EventEmitter } from "events";
import Victor = require("victor");
import { Tower } from "../actors";

@component({ name: "Towers", eager: true })
export class Towers extends EventEmitter {
    private towers: Tower[] = [];
    public changed = true;

    public init() {
        this.towers.push(new Tower(new Victor(400, 50), 0, 8, 2, true));
        this.towers.push(new Tower(new Victor(600, 180), 2, 8, 2, false));
        this.towers.push(new Tower(new Victor(500, 400), 4, 8, 2, false));
        this.towers.push(new Tower(new Victor(300, 400), 6, 8, 2, false));
        this.towers.push(new Tower(new Victor(200, 180), 8, 8, 2, false));
    }

    public update(dt: number) {
        this.changed = this.towers.some(tower => tower.update(dt));
    }

    public get allActive() { return this.towers.filter(tower => tower.active); }
}
