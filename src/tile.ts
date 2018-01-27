import Victor = require("victor");
import { RandomSeed, create as gen } from "random-seed";
import { WEED_CHANCE } from "./const";

export class Tile {
    private pos: Victor;
    private rnd: RandomSeed;
    private hasWeed: boolean;

    constructor(pos: Victor) {
        this.pos = pos;
        this.rnd = gen(`${pos.x},${pos.y}`);
        this.hasWeed = this.rnd.random() > WEED_CHANCE;
    }
}
