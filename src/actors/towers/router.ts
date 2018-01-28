import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { Tower } from "../tower";
import { Bird } from "../bird";

@external
export class Router extends Tower {
    private animations: {
        default: Animation;
    };

    constructor(pos: Victor, capacity = 4) {
        super(pos, capacity);
    }

    protected init() {
        this.sprite = this.game.add.sprite(0, 0, "tower-router");

        this.animations = {
            default: this.sprite.animations.add(
                "default", Animation.generateFrameNames("tower-router ", 0, 5, ".ase", 1),
            ),
        };
        this.animations.default.play(3, true);
    }

    public update(dt: number) {
        super.update(dt);
        return;
    }

    public canConnect(target: Tower): boolean {
        return true;
    }

    protected getTarget(bird: Bird): Tower {
        return this.possibleTargets[0];
    }

    protected birdDepart(bird: Bird) {
        // No specific actions required.
        return;
    }
}
