import Victor = require("victor");
import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import { Bird } from "../bird";
import { Package } from "../package";
import { Tower } from "../tower";
import { Layers } from "../../layers";

@external
export class Carrier extends Bird {
    public freight: Package;

    constructor(pos: Victor) {
        super(pos);
    }

    @initialize
    protected init() {
        this.sprite = this.layers.sky.create(this.pos.x, this.pos.y, "seagull");

        this.animations = {
            flap: this.sprite.animations.add(
                "flap", Animation.generateFrameNames("seagull ", 0, 5, ".ase", 1),
            ),
            idle: this.sprite.animations.add(
                "idleDefault", Animation.generateFrameNames("seagull ", 8, 8, ".ase", 1),
            ),
            head1: this.sprite.animations.add(
                "idleHead1", Animation.generateFrameNames("seagull ", 9, 9, ".ase", 1),
            ),
            head2: this.sprite.animations.add(
                "idleHead2", Animation.generateFrameNames("seagull ", 10, 10, ".ase", 1),
            ),
            wing: this.sprite.animations.add(
                "idleWing", Animation.generateFrameNames("seagull ", 11, 11, ".ase", 1),
            ),
        };
        super.init();
    }

    public tryAttachPackage(pack: Package): boolean {
        if (this.freight) {
            return false;
        }
        this.freight = pack;
        pack.attach(this);
        return true;
    }

    public landedOn(tower: Tower) {
        super.landedOn(tower);
        if (!this.freight) {
            return;
        }
        if (this.freight.target === tower) {
            this.freight.reachedTarget();
            delete this.freight;
        }
    }

    public handleLandingDenied() {
        this.badTargets.push(this.target);
        this.selectRandomTarget();
    }
}
