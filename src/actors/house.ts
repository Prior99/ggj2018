import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");
import { Layers } from "../layers";
import { Packages } from "../controllers/packages";
import { Package } from "./package";
import { PACKAGE_INTERVAL_VARIETY, PACKAGE_INTERVAL } from "../const";

@external
export class House {
    @inject private game: Game;
    @inject private layers: Layers;
    @inject private packages: Packages;

    public pos: Victor;

    private sprite: Sprite;
    private animations: {
        default: Animation;
    };

    private packageWaiting: Package;
    private timeSinceLastPackage = 0;
    private packageInterval = PACKAGE_INTERVAL + Math.random() * PACKAGE_INTERVAL_VARIETY;

    constructor(pos: Victor) {
        this.pos = pos;
    }

    @initialize
    private init() {
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
}
