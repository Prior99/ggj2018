import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

@external
export class House {
    @inject private game: Game;

    public pos: Victor;

    private sprite: Sprite;
    private animations: {
        default: Animation;
    };

    constructor(pos: Victor) {
        this.pos = pos;
    }

    @initialize
    private init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "house");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.animations = {
            default: this.sprite.animations.add(
                "default", Animation.generateFrameNames("house ", 0, 0, ".ase", 1),
            ),
        };
    }
    public update(dt: number) {
        return;
    }
}
