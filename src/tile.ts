import { external, inject, initialize } from "tsdi";
import Victor = require("victor");
import { RandomSeed, create as gen } from "random-seed";
import { Game, Sprite, Animation } from "phaser-ce";
import { WEED_CHANCE, TILE_SIZE } from "./const";

@external
export class Tile {
    @inject private game: Game;
    private gridPos: Victor;
    private rnd: RandomSeed;
    private hasWeed: boolean;
    private grass: Sprite;
    private weed: Sprite;
    private animations: {
        grass: Animation;
        weed?: Animation;
    };

    constructor(pos: Victor) {
        this.gridPos = pos;
        this.rnd = gen(`${pos.x},${pos.y}`);
        this.hasWeed = this.rnd.random() < WEED_CHANCE;
    }

    @initialize
    private init() {
        this.grass = this.game.add.sprite(this.pos.x, this.pos.y, "grass");
        this.animations = {
            grass: this.grass.animations.add(
                "default", Animation.generateFrameNames("grass ", 0, 6, ".ase", 1),
            ),
        };
        this.animations.grass.play(0, false);
        this.animations.grass.setFrame(this.rnd.intBetween(0, 6));
        if (this.hasWeed) {
            this.weed = this.game.add.sprite(this.pos.x, this.pos.y, "weed");
            this.animations.weed = this.weed.animations.add(
                "default", Animation.generateFrameNames("weed ", 0, 6, ".ase", 1),
            );
            this.animations.weed.play(0, false);
            this.animations.weed.setFrame(this.rnd.intBetween(0, 6));
        }
    }

    public get pos() {
        return this.gridPos.clone().multiplyScalar(TILE_SIZE);
    }
}
