import { external, inject, initialize } from "tsdi";
import { bind } from "decko";
import { Sprite, Game } from "phaser-ce";
import Victor = require("victor");

import { Layers } from "../layers";

import { onLeftClick } from "../utils/click";

@external
export class GhostTower {
    @inject private game: Game;
    @inject private layers: Layers;

    private initialPosition: Victor;
    private spriteName: string;
    private range: number;
    private ghost: Sprite;
    private spawnFn: (x: number, y: number) => boolean;

    constructor(pos: Victor, spriteName: string, range: number, spawnFn: (x: number, y: number) => boolean) {
        this.initialPosition = pos;
        this.spriteName = spriteName;
        this.range = range;
        this.spawnFn = spawnFn;
    }

    @initialize
    private init() {
        this.ghost = this.game.add.sprite(
            this.initialPosition.x, this.initialPosition.y, this.spriteName,
        );
        onLeftClick(this.ghost, this.spawn);

        this.ghost.alpha = 0.5;
        this.ghost.anchor.setTo(0.5, 0.5);

        const g = this.game.add.graphics(0, 0);
        g.lineStyle(3, 0xffd900, 1);
        g.drawCircle(0, 0, this.range * 2);

        this.ghost.addChild(g);

        this.layers.ground.add(this.ghost);
    }

    @bind
    private spawn(): void {
        if (this.spawnFn(this.ghost.position.x, this.ghost.position.y)) {
            this.ghost.destroy();
        }
    }

    public destroy(): void {
        this.ghost.destroy();
    }

    public update(dt: number) {
        const mouse = this.game.input;
        this.ghost.position.setTo(mouse.worldX, mouse.worldY);
    }
}
