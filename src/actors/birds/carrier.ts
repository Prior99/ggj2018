import Victor = require("victor");
import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import { Bird } from "../bird";
import { Package } from "../package";

@external
export class Carrier extends Bird {
    private freight: Package;

    constructor(pos: Victor) {
        super(pos);
    }

    @initialize
    protected init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "seagull");

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

}
