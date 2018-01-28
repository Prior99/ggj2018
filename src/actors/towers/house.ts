import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { Packages } from "../../controllers/packages";
import { Package } from "../package";
import { Tower } from "../tower";
import { PACKAGE_INTERVAL_VARIETY, PACKAGE_INTERVAL } from "../../const";
import { Bird } from "../bird";
import { Discovery } from "../birds/discovery";

@external
export class House extends Tower {
    @inject private packages: Packages;

    private animations: {
        default: Animation;
    };

    private packageWaiting: Package;
    private timeSinceLastPackage = 0;
    private packageInterval = PACKAGE_INTERVAL + Math.random() * PACKAGE_INTERVAL_VARIETY;

    constructor(pos: Victor) {
        super(pos, 1, [{x: 16, y: -2}]);
    }

    protected init() {
        this.sprite = this.game.add.sprite(0, 0, "house");

        this.animations = {
            default: this.sprite.animations.add(
                "default", Animation.generateFrameNames("house ", 0, 0, ".ase", 1),
            ),
        };
    }

    public update(dt: number) {
        super.update(dt);
        if (!this.packageWaiting) {
            this.timeSinceLastPackage += dt;
            if (this.timeSinceLastPackage > this.packageInterval) {
                this.packageWaiting = this.packages.generatePackage(this.pos.clone().add(new Victor(16, 4)), this);
            }
        } else {
            this.timeSinceLastPackage = 0;
        }
        return;
    }

    public canConnect(target: Tower): boolean {
        return this.possibleTargets.length < 1;
    }

    protected getTarget(bird: Bird): Tower {
        if (bird instanceof Discovery) {
            const { query } = bird;
            if (query && query.target === this) {
                query.fulfilledVia = this;
                return query.origin;
            }
        }
        return this.possibleTargets[0];
    }
    protected sendBirdAway(bird: Bird) {
        if (this.packageWaiting) {
            if (bird.tryAttachPackage(this.packageWaiting)) {
                delete this.packageWaiting;
            }
        }
    }
}
