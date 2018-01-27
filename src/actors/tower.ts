import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");
import { STAMINA_PER_SECOND } from "../const";
import { Pidgeon as Bird } from "./pidgeon";

@external
export class Tower {
    @inject private game: Game;

    public pos: Victor;
    private sprite: Sprite;
    private animations: {
        active: Animation;
        inactive: Animation;
    };

    private capacity: number;
    private birds: Bird[] = [];

    constructor(pos: Victor, capacity = 4) {
        this.pos = pos;

        this.capacity = capacity;
    }

    @initialize
    private init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "tower");
        this.animations = {
            active: this.sprite.animations.add(
                "active", Animation.generateFrameNames("tower ", 0, 0, ".ase", 1),
            ),
            inactive: this.sprite.animations.add(
                "inactive", Animation.generateFrameNames("tower ", 1, 1, ".ase", 1),
            ),
        };
        this.setAnimation();
    }

    private isFull(): boolean {
        return this.birds.length === this.capacity;
    }

    public get position(): Victor {
        return this.pos.clone();
    }

    public land(bird: Bird): boolean {
        if (this.isFull()) {
            return false;
        }

        this.birds.push(bird);
        this.setAnimation();

        return true;
    }

    public update(dt: number) {
        this.birds.forEach((bird) => bird.stamina += STAMINA_PER_SECOND);
        return false;
    }

    private setAnimation() {
        if (this.isFull()) {
            this.animations.active.play(1, true);
        } else {
            this.animations.active.play(1, true);
        }
    }
}
