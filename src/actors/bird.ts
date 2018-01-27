import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { MAX_STAMINA, FLY_STAMINA_PER_SECOND } from "../const";
import { Towers } from "../controllers/towers";
import { Tower } from "./tower";

const fps = 10;
const speed = 50;

function normalizeDeg(deg: number) {
    while (deg < 0 ) { deg += 360; }
    while (deg > 360 ) { deg -= 360; }
    return deg;
}

@external
export class Bird {
    @inject private game: Game;
    @inject private towers: Towers;

    public pos: Victor;
    public angle = Math.random() * 360;
    private turnSpeed = Math.random() * 5;
    public currentStamina: number;
    public maxStamina: number = MAX_STAMINA;

    // Managed by `Bird`.
    public target: Tower;
    private badTargets: Tower[];

    private current = false;

    // public angle = Math.random() * 360;
    // private turnSpeed = Math.random() * 5;

    // Graphics stuff.
    private sprite: Sprite;
    private animations: {
        default: {
            flap: Animation;
        },
        current: {
            flap: Animation;
        };
    };

    constructor(pos: Victor) {
        this.pos = pos;

        this.currentStamina = this.maxStamina;
    }

    @initialize
    private init() {
        this.target = undefined;
        this.badTargets = [];

        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "seagull");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.animations = {
            default: {
                flap: this.sprite.animations.add(
                    "defaultFlap", Animation.generateFrameNames("seagull ", 0, 6, ".ase", 1),
                ),
            },
            current: {
                flap: this.sprite.animations.add(
                    "currentFlap", Animation.generateFrameNames("seagull ", 6, 9, ".ase", 1),
                ),
            },
        };
        this.animations.default.flap.reversed = true;

        this.follow = this.current;

        this.selectRandomTarget();
    }

    public set follow(follow: boolean) {
        this.current = follow;

        if (this.current) {
            this.animations.current.flap.play(fps, true);
            this.sprite.tint = Phaser.Color.RED;
        } else {
            this.animations.default.flap.play(fps, true);
            this.sprite.tint = Phaser.Color.WHITE;
        }
    }

    public get follow() {
        return this.current;
    }

    public get stamina() {
        return this.currentStamina;
    }

    public set stamina(value: number) {
        this.currentStamina = Math.min(value, this.maxStamina);
    }

    public isRested() {
        return this.stamina >= this.maxStamina;
    }

    private selectRandomTarget() {
        const { towers, badTargets, pos } = this;
        // Radius search nearest free tower which is not in the list.
        const { closestDistance, bestTower } = towers.allActive.reduce(
            (oldBest, tower) => {
                const distance = tower.position.subtract(pos).length();
                // Must not be in `badTargets`.
                if (
                    distance < oldBest.closestDistance
                    && badTargets.every((badTarget) => badTarget !== tower)
                ) {
                    return {
                        closestDistance: distance,
                        bestTower: tower,
                    };
                }
                return oldBest;
            },
            { closestDistance: 1.0 / 0.0, bestTower: undefined },
        );
        if (!Boolean(bestTower)) {
            this.badTargets = [];
            this.target = towers.allActive[0];
        } else {
            this.target = bestTower;
        }
    }

    public update(dt: number) {
        const { towers, badTargets, pos } = this;
        // Behavior.
        if (!this.target) {
            // Do nothing, since no target, aka. sitting on tower.
        } else {
            // Bird is in midair and flying somewhere.
            this.stamina -= dt * FLY_STAMINA_PER_SECOND;

            if (this.target.position.subtract(pos).length() < 1) {
                // Bird reached its target. Initiate landing...
                if (this.target.land(this)) {
                    // Drop list list of bad towers and the target also.
                    this.badTargets = [];
                    this.target = undefined;
                } else {
                    // Push the tower to list of tested towers. (To not oscillate between towers)
                    this.badTargets.push(this.target);
                    this.selectRandomTarget();
                }
            }
        }

        // Movement.
        if (this.target) {
            const diff = this.target.position.subtract(pos).normalize().multiplyScalar(dt * speed);
            const angle = diff.angleDeg();
            this.sprite.angle = angle + 90;

            // TODO fix the following code.
            // const targetAngle = normalizeDeg(target.clone().subtract(this.pos).angleDeg());
            // const diff = Math.abs(this.angle - targetAngle);
            // if (diff > 0.01) {
            //     const sign = this.angle > targetAngle ? -1 : 1;
            //     if (diff < this.turnSpeed) { this.angle = targetAngle; }
            //     else { this.angle += sign * this.turnSpeed; }
            //     this.angle = normalizeDeg(this.angle);
            // }
            // const delta = new Victor(1, 0).rotateDeg(this.angle).normalize().multiplyScalar(speed);
            this.pos.add(diff);
            // this.sprite.angle = this.angle;
        }

        // Graphics.
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }

    // public get target() {
    //     const { allActive } = this.towers;
    //     if (allActive.length === 0) {
    //         return;
    //     }
    //     return allActive.reduce((result, current) => {
    //         const distanceCurrent = this.pos.clone().distance(current.pos);
    //         const distanceOld = this.pos.clone().distance(result.pos);
    //         if (distanceCurrent > distanceOld) {
    //             return current;
    //         }
    //         return result;
    //     }).pos;
    // }
}
