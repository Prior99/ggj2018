import { component, inject, initialize } from "tsdi";
import { EventEmitter } from "events";
import Victor = require("victor");
import { Tower } from "../actors/tower";
import { SimpleTower } from "../actors/towers/simple-tower";

@component
export class Towers extends EventEmitter {
    private towers: Tower[] = [];
    public changed = true;

    @initialize
    public init() {
        this.towers.push(new SimpleTower(new Victor(0, -200)));
        this.towers.push(new SimpleTower(new Victor(-200, -50)));
        this.towers.push(new SimpleTower(new Victor(200, -50)));
        this.towers.push(new SimpleTower(new Victor(-100, 100)));
        this.towers.push(new SimpleTower(new Victor(100, 100)));

        this.towers[1].connect(this.towers[0]);
        this.towers[2].connect(this.towers[1]);
        this.towers[3].connect(this.towers[2]);
        this.towers[4].connect(this.towers[3]);
        this.towers[0].connect(this.towers[4]);
    }

    public update(dt: number) {
        this.changed = this.towers.reduce((result, tower) => tower.update(dt) || result, false);
    }
    public render() {
        this.towers.forEach(tower => tower.render());
    }

    public get allActive() { return this.towers; }
}
