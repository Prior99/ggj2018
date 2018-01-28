import { external, initialize, inject } from "tsdi";
import Victor = require("victor");
import { Sprite, Animation } from "phaser-ce";

import { Tower } from "../tower";
import { Bird } from "../bird";
import { Discovery } from "../birds/discovery";

import { TowerType } from "../../utils/tower";

@external
export class SimpleTower extends Tower {
    private animations: {
        active: Animation;
    };

    constructor(pos: Victor, capacity = 4) {
        super(pos, capacity);
    }

    protected init() {
        this.sprite = this.game.add.sprite(0, 0, "tower");

        this.animations = {
            active: this.sprite.animations.add(
                "active", Animation.generateFrameNames("tower ", 0, 1, ".ase", 1),
            ),
        };
        this.animations.active.play(1, true);
    }

    public get type() {
        return TowerType.SIMPLE;
    }

    public canConnect(target: Tower): boolean {
        return this.possibleTargets.length < 1;
    }

    protected getTarget(bird: Bird): Tower {
        if (bird instanceof Discovery && bird.query && this.possibleTargets.length === 0) {
            return bird.query.origin;
        }
        return this.possibleTargets[0];
    }
}
