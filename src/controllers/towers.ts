import { component, inject, initialize } from "tsdi";
import { EventEmitter } from "events";
import Victor = require("victor");
import { Tower } from "../actors/tower";

@component
export class Towers extends EventEmitter {
    private towers: Tower[] = [];
    public changed = true;

    @initialize
    public init() {
        this.towers.push(new Tower(new Victor(400, 50)));
        this.towers.push(new Tower(new Victor(600, 180)));
        this.towers.push(new Tower(new Victor(500, 400)));
        this.towers.push(new Tower(new Victor(300, 400)));
        this.towers.push(new Tower(new Victor(200, 180)));
    }

    public update(dt: number) {
        this.changed = this.towers.some(tower => tower.update(dt));
    }

    public get allActive() { return this.towers; }
}
