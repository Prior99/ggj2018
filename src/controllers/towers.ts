import { component, inject, initialize } from "tsdi";

import { Sprite, Game } from "phaser-ce";
import Victor = require("victor");

import { TOWER_VALUE } from "../const";

import { Controller } from "../controller";
import { Money } from "./money";

import { Tower } from "../actors/tower";
import { GhostTower } from "../actors/ghost-tower";
import { SimpleTower } from "../actors/towers/simple-tower";
import { Router } from "../actors/towers/router";

@component("Towers")
export class Towers implements Controller {
    @inject private game: Game;
    @inject private money: Money;

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

        this.addTower(new Router(new Victor(0, 0)));

        this.towers[1].addTarget(this.towers[0]);
        this.towers[2].addTarget(this.towers[1]);
        this.towers[3].addTarget(this.towers[2]);
        this.towers[4].addTarget(this.towers[3]);
        this.towers[0].addTarget(this.towers[4]);
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

    public spawnGhost(initialX: number, initialY: number, type = "simple", callback: () => void) {
        if (this.ghost) {
            this.ghost.destroy();
        }

        let spriteName: string;
        let spawnFn: (pos: Victor) => Tower;
        let value: number;

        switch (type) {
            case "simple":
                spriteName = "tower";
                spawnFn = (pos: Victor) => new SimpleTower(pos);
                value = TOWER_VALUE.SIMPLE;
                break;
            default:
                return;
        }

        this.ghost = new GhostTower(
            new Victor(initialX, initialY),
            spriteName,
            (x: number, y: number) => {
                if (this.money.buy(value)) {
                    this.towers.push(spawnFn(new Victor(x, y)));
                    this.ghost = undefined;

                    callback();

                    return true;
                }

                return false;
            },
        );
    }

    public removeGhost() {
        this.ghost.destroy();
        this.ghost = undefined;
    }

    public get allActive() { return this.towers; }
}
