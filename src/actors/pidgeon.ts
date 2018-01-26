import { external, inject, initialize } from "tsdi";
import { Sprite, Animation } from "phaser-ce";
import Victor = require("victor");
import { GGJ2018 } from "..";
import { Towers } from "../controllers";

const fps = 10;
const speed = 50;

@external
export class Pidgeon {
    @inject("GGJ2018") private game: GGJ2018;
    @inject("Towers") private towers: Towers;

    public pos: Victor;
    private sprite: Sprite;
    private flap: Animation;
    public target: Victor;

    constructor(pos: Victor) {
        this.pos = pos;
    }

    @initialize
    private init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "pidgeon");
        this.flap = this.sprite.animations.add("flap", Animation.generateFrameNames("pidgeon ", 0, 3, ".ase", 1));
        this.flap.play(fps, true);
    }

    public update(dt: number) {
        this.decideForTarget();
        if (this.target) {
            const delta = this.target.clone().subtract(this.pos).normalize().multiplyScalar(speed * dt);
            this.pos.add(delta);
            this.sprite.angle = this.target.clone().subtract(this.pos).angleDeg();
        }
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }

    private decideForTarget() {
        const { changed, allActive } = this.towers;
        if (!changed || allActive.length === 0) {
            return;
        }
        this.target = allActive.reduce((result, current) => {
            const distanceCurrent = this.pos.clone().distance(current.pos);
            const distanceOld = this.pos.clone().distance(result.pos);
            if (distanceCurrent > distanceOld) {
                return current;
            }
            return result;
        }).pos;
    }
}
