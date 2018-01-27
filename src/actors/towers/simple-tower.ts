import { external, initialize, inject } from "tsdi";
import Victor = require("victor");
import { Sprite, Animation } from "phaser-ce";

import { Tower } from "../tower";
import { Bird } from "../bird";
import { Layers } from "../../layers";

@external
export class SimpleTower extends Tower {
    @inject private layers: Layers;

    private animations: {
        active: Animation;
    };

    constructor(pos: Victor, capacity = 4) {
        super(pos, capacity);
    }

    @initialize
    protected init() {
        super.init();
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "tower");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.layers.ground.add(this.sprite);

        this.animations = {
            active: this.sprite.animations.add(
                "active", Animation.generateFrameNames("tower ", 0, 1, ".ase", 1),
            ),
        };
        this.animations.active.play(1, true);
    }

    public canConnect(target: Tower): boolean {
        return this.connections.length < 1;
    }

    protected getTarget(bird: Bird): Tower {
        return this.connections[0];
    }
}
