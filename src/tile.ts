import { external, inject, initialize } from "tsdi";
import Victor = require("victor");
import { RandomSeed, create as gen } from "random-seed";
import { Game, Sprite } from "phaser-ce";
import { WEED_CHANCE, TILE_SIZE } from "./const";

@external
export class Tile {
    @inject private game: Game;
    private gridPos: Victor;
    private rnd: RandomSeed;
    private hasWeed: boolean;
    private grass: Sprite;
    private weed: Sprite;

    constructor(pos: Victor) {
        this.gridPos = pos;
        this.rnd = gen(`${pos.x},${pos.y}`);
        this.hasWeed = this.rnd.random() < WEED_CHANCE;
    }

    @initialize
    private init() {
        this.grass = this.game.add.sprite(this.pos.x, this.pos.y, "grass");
        if (this.hasWeed) {
            this.weed = this.game.add.sprite(this.pos.x, this.pos.y, "weed");
        }
    }

    public get pos() {
        return this.gridPos.clone().multiplyScalar(TILE_SIZE);
    }
}
