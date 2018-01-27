import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

@external
export class Tower {
    @inject private game: Game;

    public pos: Victor;
    private sprite: Sprite;
    private animations: {
        active: Animation;
        inactive: Animation;
    };
    public target: Victor;
    private time = 0;
    public active: boolean;
    private activeTime: number;
    private inactiveTime: number;

    constructor(pos: Victor, offset = 0, inactiveTime = 1, activeTime = 1, active = true) {
        this.pos = pos;
        this.time = offset;
        this.active = active;
        this.activeTime = activeTime;
        this.inactiveTime = inactiveTime;
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

    public update(dt: number) {
        this.time += dt;
        if (this.time <= this.inactiveTime) { this.active = false; }
        else { this.active = true; }
        this.setAnimation();
        if (this.time > this.inactiveTime + this.activeTime) {
            this.time = 0;
            return true;
        }
        return false;
    }

    private setAnimation() {
        if (this.active) {
            this.animations.active.play(1, true);
        } else {
            this.animations.inactive.play(1, true);
        }
    }
}
