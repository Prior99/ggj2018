import { component, inject, initialize } from "tsdi";
import { Game } from "phaser-ce";
import { Tile } from "./tile";
import Victor = require("victor");

function toKey(pos: Victor) {
    return `${pos.x},${pos.y}`;
}

@component
export class World {
    @inject private game: Game;
    private tiles = new Map<string, Tile>();

    @initialize
    private init() {
        return;
    }

    public at(pos: Victor) {
        const key = toKey(pos);
        if (this.tiles.has(key)) {
            return this.tiles.get(key);
        }
        const tile = new Tile(pos);
        this.tiles.set(key, tile);
        return tile;
    }
}
