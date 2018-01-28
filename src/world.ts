import { component, inject, initialize } from "tsdi";
import { bind } from "decko";
import { Game } from "phaser-ce";
import Victor = require("victor");

import { ConnectionHandler } from "./behaviour/connect";
import { Tile } from "./tile";
import { UI } from "./ui/game-ui";

function toKey(pos: Victor) {
    return `${pos.x},${pos.y}`;
}

@component
export class World {
    @inject private ui: UI;
    @inject private game: Game;
    @inject private connected: ConnectionHandler;

    private tiles = new Map<string, Tile>();

    @initialize
    private init() {
        for (let x = -10; x < 10; ++x) {
            for (let y = -10; y < 10; ++y) {
                this.at(new Victor(x, y));
            }
        }
        return;
    }

    public at(pos: Victor) {
        const key = toKey(pos);
        if (this.tiles.has(key)) {
            return this.tiles.get(key);
        }
        const tile = new Tile(pos, this.onClick);
        this.tiles.set(key, tile);
        return tile;
    }

    @bind
    private onClick() {
        this.ui.clickedRandom();
        this.connected.deselect();
    }
}
