import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { MAX_STAMINA, FLY_STAMINA_PER_SECOND } from "../const";
import { Layers } from "../layers";
import { Towers } from "../controllers/towers";
import { Tower } from "./tower";

const fps = 10;
const acceleration = 50;
const speed = 50;

function normalizeDeg(deg: number) {
    while (deg < 0 ) { deg += 360; }
    while (deg > 360 ) { deg -= 360; }
    return deg;
}

@external
export class Bird {
    @inject private game: Game;
    @inject private layers: Layers;
    @inject private towers: Towers;

    public pos: Victor;
    private velocity: Victor;

    public currentStamina: number;
    public maxStamina: number = MAX_STAMINA;

    // Managed by `Bird`. There is a setter for the target
    private privateTarget: Tower;
    private badTargets: Tower[];

    private current = false;

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
        this.velocity = new Victor(0, 0);

        this.currentStamina = this.maxStamina;
    }

    @initialize
    private init() {
        this.target = undefined;
        this.badTargets = [];

        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "seagull");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.layers.sky.add(this.sprite);

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
            this.animations.default.flap.setFrame(Math.floor(Math.random() * 7), true);
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

    public get target() {
        return this.privateTarget;
    }

    public set target(newTarget: Tower) {
        this.privateTarget = newTarget;
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
            // Use random
            this.target = towers.allActive[0];
        } else {
            this.target = bestTower;
        }
    }

    public update(dt: number) {
        const { towers, badTargets } = this;
        // Behavior.
        if (!this.target) {
            // Do nothing, since no target, aka. sitting on tower.
        } else {
            // Bird is in midair and flying somewhere.
            this.stamina -= dt * FLY_STAMINA_PER_SECOND;

            const target = this.target;
            const targetPosition = target.position;
            if (targetPosition.subtract(this.pos).length() < 15) {
                // Bird reached its target. Initiate landing...
                if (this.target.land(this)) {
                    // Drop list list of bad towers and the target also.
                    this.badTargets = [];
                    this.target = undefined;
                    this.velocity = new Victor(0, 0);
                } else {
                    // Push the tower to list of tested towers. (To not oscillate between towers)
                    this.badTargets.push(this.target);
                    this.selectRandomTarget();
                }
            }
            if (target.birds.every(bird => bird !== this) && !Boolean(this.target)) {
                alert("WTF");
            }
        }

        // Movement.
        if (this.target) {
            const targetPosition = this.target.position;
            const dir = targetPosition.subtract(this.pos).normalize();
            this.velocity.add(dir.multiplyScalar(dt * acceleration));
            const currentSpeed = this.velocity.length();
            this.velocity.multiplyScalar(Math.min(speed, currentSpeed) / currentSpeed);
            this.sprite.angle = this.velocity.angleDeg() + 90;

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
            this.pos.add(this.velocity.clone().multiplyScalar(dt));
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
