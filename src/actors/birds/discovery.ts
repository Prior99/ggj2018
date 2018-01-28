import Victor = require("victor");
import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game, Line } from "phaser-ce";
import { Bird } from "../bird";
import { Package } from "../package";
import { Tower } from "../tower";
import { Query } from "../towers/router";

@external
export class Discovery  extends Bird {
    @inject protected game: Game;

    // Might be undefined. If defined, the bird has been given the mission to find a route.
    public query: Query;
    private discoveryStart: Tower;

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

    public handleLandingDenied() {
        if (this.query) {
            return;
        }
        this.badTargets.push(this.target);
        this.selectRandomTarget();
    }

    public render() {
        if (!(window as any).DEBUG_ROUTING) { return; }
        if (!this.query) {
            return;
        }
        const { origin, target } = this.query;

        const originLine = new Line(this.pos.x, this.pos.y, origin.position.x, origin.position.y);
        this.game.debug.geom(originLine, "rgb(0, 255, 0)");

        const targetLine = new Line(this.pos.x, this.pos.y, target.position.x, target.position.y);
        this.game.debug.geom(targetLine, "rgb(255, 0, 0)");

        if (this.target) {
            const currentLine = new Line(this.pos.x, this.pos.y, this.target.position.x, this.target.position.y);
            this.game.debug.geom(currentLine, "rgb(0, 0, 255)");
        }
    }
}
