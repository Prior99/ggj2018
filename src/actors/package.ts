import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import { House } from "./towers/house";
import { Layers } from "../layers";
import Victor = require("victor");

@external
export class Package {
    @inject private game: Game;
    @inject private layers: Layers;

    public pos: Victor;

    private sprite: Sprite;
    private animations: {
        default: Animation;
    };
    private target: House;

    constructor(pos: Victor, target: House) {
        this.pos = pos;
        this.target = target;
    }

    @initialize
    private init() {
        this.sprite = this.layers.ground.create(this.pos.x, this.pos.y, "package");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.animations = {
            default: this.sprite.animations.add(
                "default", Animation.generateFrameNames("package ", 0, 0, ".ase", 1),
            ),
        };
    }
    public update(dt: number) {
        return;
    }
}
