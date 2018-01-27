import { component, inject, initialize } from "tsdi";

import { Sprite, Game } from "phaser-ce";
import Victor = require("victor");

import { Tower } from "../actors/tower";
import { GhostTower } from "../actors/ghost-tower";
import { SimpleTower } from "../actors/towers/simple-tower";
import { Controller } from "../controller";

@component
export class Towers implements Controller {
    @inject private game: Game;

    private towers: Tower[] = [];
    private ghost: GhostTower;

    private changed: boolean;

    @initialize
    public init() {
        this.addTower(new SimpleTower(new Victor(0, -200)));
        this.addTower(new SimpleTower(new Victor(-200, -50)));
        this.addTower(new SimpleTower(new Victor(200, -50)));
        this.addTower(new SimpleTower(new Victor(-100, 100)));
        this.addTower(new SimpleTower(new Victor(100, 100)));

        this.towers[1].connect(this.towers[0]);
        this.towers[2].connect(this.towers[1]);
        this.towers[3].connect(this.towers[2]);
        this.towers[4].connect(this.towers[3]);
        this.towers[0].connect(this.towers[4]);
    }

    public addTower(tower: Tower) {
        this.towers.push(tower);
    }

    public update(dt: number) {
        this.changed = this.towers.reduce((result, tower) => tower.update(dt) || result, false);

        if (this.ghost) {
            this.ghost.update(dt);
        }
    }

    public render() {
        this.towers.forEach(tower => tower.render());
    }

    public spawnGhost(initialX: number, initialY: number, type = "simple") {
        let spriteName: string;
        let spawnFn: (pos: Victor) => Tower;

        switch (type) {
            case "simple":
                spriteName = "tower";
                spawnFn = (pos: Victor) => new SimpleTower(pos);
                break;
            default:
                return;
        }

        this.ghost = new GhostTower(
            new Victor(initialX, initialY),
            spriteName,
            (x: number, y: number) => {
                this.towers.push(spawnFn(new Victor(x, y)));
                this.ghost = undefined;
            },
        );
    }

    public get allActive() { return this.towers; }
}
