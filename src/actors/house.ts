import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");
import { Layers } from "../layers";
import { Packages } from "../controllers/packages";
import { Package } from "./package";
import { Tower } from "./tower";
import { PACKAGE_INTERVAL_VARIETY, PACKAGE_INTERVAL } from "../const";
import { Bird } from "./bird";

@external
export class House extends Tower {
    @inject private layers: Layers;
    @inject private packages: Packages;

    private animations: {
        default: Animation;
    };

    private packageWaiting: Package;
    private timeSinceLastPackage = 0;
    private packageInterval = PACKAGE_INTERVAL + Math.random() * PACKAGE_INTERVAL_VARIETY;

    constructor(pos: Victor) {
        super(pos, 1);
        this.pos = pos;
    }

    @initialize
    private initHouse() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "house");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.layers.ground.add(this.sprite);

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
                this.packages.generatePackage(this.pos.clone().add(new Victor(16, 4)), this);
            }
        } else {
            this.timeSinceLastPackage = 0;
        }
        return;
    }

    public canConnect(target: Tower): boolean {
        return this.connections.length < 1;
    }

    protected getTarget(bird: Bird): Tower {
        return this.connections[0];
    }
}
