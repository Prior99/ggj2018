import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game, Line } from "phaser-ce";
import Victor = require("victor");

import { ACCELLERATION_ACCELLERATION_SPEED, MAX_STAMINA, FLY_STAMINA_PER_SECOND, MAX_ACCELLERATION } from "../const";
import { Layers } from "../layers";
import { Towers } from "../controllers/towers";
import { UI } from "../ui/game-ui";
import { Tower } from "./tower";
import { Package } from "./package";
import { House } from "./towers/house";

const fps = 10;
const initialAcceleration = 70;
const speed = 50;

function normalizeDeg(deg: number) {
    while (deg < 0 ) { deg += 360; }
    while (deg > 360 ) { deg -= 360; }
    return deg;
}

export abstract class Bird {
    @inject protected game: Game;
    @inject protected layers: Layers;
    @inject protected ui: UI;
    @inject("Towers") private towers: Towers;

    public timeOfDeath: number;

    public pos: Victor;
    private velocity: Victor;

    public currentStamina: number;
    public maxStamina: number = MAX_STAMINA;

    private idleAnimationStart = 0;
    private idleAnimationDuration = 0;

    // Managed by `Bird`.
    public target: Tower;
    protected badTargets: Tower[];

    // Graphics stuff.
    public sprite: Sprite;
    protected animations: {
        flap: Animation;
        idle: Animation;
        head1: Animation;
        head2: Animation;
        wing: Animation;
    };

    public from: Tower;
    private acceleration = initialAcceleration;

    constructor(pos: Victor) {
        this.pos = pos;
        this.velocity = new Victor(0, 0);

        this.currentStamina = this.maxStamina;
    }

    @initialize
    protected init() {
        this.target = undefined;
        this.badTargets = [];

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => this.ui.focusBird(this));

        this.layers.sky.add(this.sprite);

        this.startFlapping();

        this.selectRandomTarget();
    }

    public kill() {
        this.timeOfDeath = this.game.time.time / 1000;
    }

    public get stamina() {
        return this.currentStamina;
    }

    public set stamina(value: number) {
        this.currentStamina = Math.min(value, this.maxStamina);
    }

    public get isRested() {
        return this.stamina >= this.maxStamina;
    }

    public startFlapping() {
        this.animations.flap.play(fps, true);
        this.animations.flap.setFrame(Math.floor(Math.random() * 7), true);
    }

    private selectAnimation() {
        const currentTime = this.game.time.time / 1000;
        if (currentTime > this.idleAnimationStart + this.idleAnimationDuration) {
            this.idleAnimationStart = currentTime;
            this.idleAnimationDuration = 0.4 + Math.random() / 3;

            const index = Math.min(Math.floor(Math.random() * 4), 3);
            const animationKey = ["idle", "head1", "head2", "wing"][index];
            const animation = this.animations[animationKey];

            animation.play(fps, true);
        }
    }

    protected selectRandomTarget() {
        const { towers, badTargets, pos } = this;
        // Radius search nearest free tower which is not in the list.
        const possibleTowers = towers.allActive.filter(tower => {
            return !badTargets.some(bad => bad === tower) &&
                tower !== this.from &&
                !(tower instanceof House) &&
                !tower.isFull;
        });
        const bestTower = possibleTowers[Math.floor(Math.random() * possibleTowers.length)];
        if (!bestTower) {
            this.badTargets = [];
            // Use random
            this.target = towers.allActive[Math.floor(Math.random() * towers.allActive.length)];
        } else {
            this.target = bestTower;
        }
    }

    public update(dt: number) {
        const { towers, badTargets } = this;

        if (this.stamina < 0) {
            this.kill();
            return;
        }

        // Behavior.
        if (!this.target) {
            this.selectAnimation();
        } else {
            // Bird is in midair and flying somewhere.
            this.stamina -= dt * FLY_STAMINA_PER_SECOND;
            if (this.acceleration < MAX_ACCELLERATION) {
                this.acceleration += dt * ACCELLERATION_ACCELLERATION_SPEED;
            }

            const target = this.target;
            const targetPosition = target.position;
            if (targetPosition.subtract(this.pos).length() < 10) {
                // Bird reached its target. Initiate landing...
                const landPosition = this.target.land(this);
                if (landPosition) {
                    // Drop list list of bad towers and the target also.
                    this.badTargets = [];
                    this.landedOn(this.target);
                    this.target = undefined;
                    this.velocity = new Victor(0, 0);

                    this.pos = landPosition;
                    this.sprite.angle = 0;
                } else {
                    // Push the tower to list of tested towers. (To not oscillate between towers)
                    this.handleLandingDenied();
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
            this.velocity.add(dir.multiplyScalar(dt * this.acceleration));
            const currentSpeed = this.velocity.length();
            this.velocity.multiplyScalar(Math.min(speed, currentSpeed) / currentSpeed);
            this.sprite.angle = this.velocity.angleDeg() + 90;

            this.pos.add(this.velocity.clone().multiplyScalar(dt));
        }

        // Graphics.
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }

    public die() {
        this.sprite.destroy();
    }

    public get staminaRelative() {
        return this.stamina / this.maxStamina;
    }

    public render() {
        if (this.ui.focusedBird !== this) {
            return;
        }

        if (this.target) {
            const currentLine = new Line(this.pos.x, this.pos.y, this.target.position.x, this.target.position.y);
            this.game.debug.geom(currentLine, "rgb(0, 0, 255)");
        }
        return;
    }

    public landedOn(target: Tower) {
        this.acceleration = initialAcceleration;
    }

    public abstract tryAttachPackage(pack: Package): boolean;
    public abstract handleLandingDenied(): void;
}
