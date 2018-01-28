import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import { House } from "./towers/house";
import { Layers } from "../layers";
import { Carrier } from "./birds/carrier";
import { Money } from "../controllers/money";
import Victor = require("victor");

@external
export class Package {
    @inject private money: Money;
    @inject private game: Game;
    @inject private layers: Layers;

    public pos: Victor;
    public carrier: Carrier;

    private sprite: Sprite;
    private animations: {
        default: Animation;
    };
    public target: House;

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
    public attach(carrier: Carrier) {
        this.carrier = carrier;
        carrier.sprite.addChild(this.sprite);
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos = this.carrier.pos;
    }

    public reachedTarget() {
        this.sprite.destroy();
        this.money.packageDelivered();
    }
}
