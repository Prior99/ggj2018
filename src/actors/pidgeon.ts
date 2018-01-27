import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");
import { Towers } from "../controllers/towers";

const fps = 10;
const speed = 1;

function normalizeDeg(deg: number) {
    while (deg < 0 ) { deg += 360; }
    while (deg > 360 ) { deg -= 360; }
    return deg;
}

@external
export class Pidgeon {
    @inject private game: Game;
    @inject private towers: Towers;

    public pos: Victor;
    public angle = Math.random() * 360;
    private turnSpeed = Math.random() * 5;
    private sprite: Sprite;
    private flap: Animation;

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
        const { target } = this;
        if (target) {
            const targetAngle = normalizeDeg(target.clone().subtract(this.pos).angleDeg());
            const diff = Math.abs(this.angle - targetAngle);
            if (diff > 0.01) {
                const sign = this.angle > targetAngle ? -1 : 1;
                if (diff < this.turnSpeed) { this.angle = targetAngle; }
                else { this.angle += sign * this.turnSpeed; }
                this.angle = normalizeDeg(this.angle);
            }
            const delta = new Victor(1, 0).rotateDeg(this.angle).normalize().multiplyScalar(speed);
            this.pos.add(delta);
            this.sprite.angle = this.angle;
        }
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }

    public get target() {
        const { allActive } = this.towers;
        if (allActive.length === 0) {
            return;
        }
        return allActive.reduce((result, current) => {
            const distanceCurrent = this.pos.clone().distance(current.pos);
            const distanceOld = this.pos.clone().distance(result.pos);
            if (distanceCurrent > distanceOld) {
                return current;
            }
            return result;
        }).pos;
    }
}
