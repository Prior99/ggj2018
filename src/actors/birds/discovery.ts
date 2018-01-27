import Victor = require("victor");
import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import { Bird } from "../bird";
import { Package } from "../package";
import { Tower } from "../tower";

@external
export class Discovery  extends Bird {
    private freight: Package;

    constructor(pos: Victor) {
        super(pos);
    }

    @initialize
    protected init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "crow");

        this.animations = {
            flap: this.sprite.animations.add(
                "flap", Animation.generateFrameNames("crow ", 0, 5, ".ase", 1),
            ),
            idle: this.sprite.animations.add(
                "idleDefault", Animation.generateFrameNames("crow ", 6, 6, ".ase", 1),
            ),
            head1: this.sprite.animations.add(
                "idleHead1", Animation.generateFrameNames("crow ", 7, 7, ".ase", 1),
            ),
            head2: this.sprite.animations.add(
                "idleHead2", Animation.generateFrameNames("crow ", 8, 8, ".ase", 1),
            ),
            wing: this.sprite.animations.add(
                "idleWing", Animation.generateFrameNames("crow ", 9, 9, ".ase", 1),
            ),
        };
        super.init();
    }

    public tryAttachPackage(pack: Package): boolean {
        return false;
    }

    public landedOn(tower: Tower) {
        return;
    }
}
