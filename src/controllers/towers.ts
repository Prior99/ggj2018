import { component, inject, initialize } from "tsdi";

import { Sprite, Game } from "phaser-ce";
import Victor = require("victor");

import { Tower } from "../actors/tower";
import { GhostTower } from "../actors/ghost-tower";
import { SimpleTower } from "../actors/towers/simple-tower";
import { Controller } from "../controller";
import { Router } from "../actors/towers/router";
import { Houses } from "./houses";

@component("Towers")
export class Towers implements Controller {
    @inject private game: Game;
    @inject("Houses") private houses: Houses;

    public towers: Tower[] = [];
    private ghost: GhostTower;
    private selected: Tower;

    private changed: boolean;

    @initialize
    public init() {
        this.houses.init();
        //                                   -- H1
        //                                  /
        //              -- T1 --- T2 --- T5 --- T6
        //             /
        //   H0 --- T0
        //             \
        //              -- T3 --- T4 --- T7 --- T8
        //                                  \
        //                                   -- T9
        this.addTower(new Router(new Victor(0, 0))); // 0

        this.addTower(new Router(new Victor(0, -100))); // 1
        this.addTower(new SimpleTower(new Victor(75, -100))); // 2

        this.addTower(new Router(new Victor(0, 100))); // 3
        this.addTower(new SimpleTower(new Victor(75, 100))); // 4

        this.addTower(new Router(new Victor(150, -100))); // 5
        this.addTower(new SimpleTower(new Victor(225, -100))); // 6


        this.addTower(new Router(new Victor(150, 100))); // 7
        this.addTower(new SimpleTower(new Victor(225, 50))); // 8
        this.addTower(new SimpleTower(new Victor(225, 150))); // 9

        this.towers[0].addTarget(this.towers[1]);
        this.towers[0].addTarget(this.towers[3]);
        this.towers[0].addTarget(this.houses.houses[0]);
        this.towers[1].addTarget(this.towers[0]);
        this.towers[1].addTarget(this.towers[2]);
        this.towers[2].addTarget(this.towers[5]);
        this.towers[3].addTarget(this.towers[4]);
        this.towers[4].addTarget(this.towers[7]);
        this.towers[5].addTarget(this.houses.houses[1]);
        this.towers[5].addTarget(this.towers[6]);
        this.towers[7].addTarget(this.towers[8]);
        this.towers[7].addTarget(this.towers[9]);

        this.houses.houses[0].addTarget(this.towers[0]);
        this.houses.houses[1].addTarget(this.towers[5]);
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

    public select(tower: Tower) {
        if (this.selected) {
            this.selected.selected = false;
        }

        tower.selected = true;
        this.selected = tower;
    }

    public deselect() {
        if (this.selected) {
            this.selected.selected = false;
            this.selected = undefined;
        }
    }

    public get allActive() { return this.towers; }
}
