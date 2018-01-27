import { external, inject, initialize } from "tsdi";
import { Sprite, Button, Game } from "phaser-ce";
import Victor = require("victor");

@external
export class GhostTower {
    @inject private game: Game;

    private initialPosition: Victor;
    private spriteName: string;
    private ghost: Button;
    private spawnFn: (x: number, y: number) => void;

    constructor(pos: Victor, spriteName: string, spawnFn: (x: number, y: number) => void) {
        this.initialPosition = pos;
        this.spriteName = spriteName;
        this.spawnFn = spawnFn;
    }

    @initialize
    private init() {
        this.ghost = this.game.add.button(
            this.initialPosition.x, this.initialPosition.y, this.spriteName, this.spawn, this,
        );
        this.ghost.alpha = 0.5;
        this.ghost.anchor.setTo(0.5, 0.5);
    }

    private spawn(): void {
        this.ghost.destroy();
        this.spawnFn(this.ghost.position.x, this.ghost.position.y);
    }

    public update(dt: number) {
        const mouse = this.game.input;
        this.ghost.position.setTo(mouse.worldX, mouse.worldY);
        // TODO snap to grid
    }
}
