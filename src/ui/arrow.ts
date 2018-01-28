import { external, inject, initialize } from "tsdi";
import { Game, TileSprite } from "phaser-ce";
import Victor = require("victor");

@external
export class Arrow {
    @inject private game: Game;

    private sprite: TileSprite;

    private from: Victor;
    private to: Victor;
    private dashed: boolean;

    public constructor(from: Victor, to: Victor, dashed = false) {
        this.from = from;
        this.to = to;
        this.dashed = dashed;
    }

    @initialize
    private init() {
        const { length, rotation } = this.getMeasures();

        this.sprite = this.game.add.tileSprite(this.to.x, this.to.y, length, 16, "arrow-shaft", this.dashed ? 1 : 0);
        this.sprite.anchor.y = 0.5;

        const head = this.game.add.sprite(0, 0, "arrow-head");
        head.angle = 180;
        head.anchor.x = 1;
        head.anchor.y = 0.5;

        this.sprite.addChild(head);

        this.sprite.rotation = rotation;
    }

    public set target(to: Victor) {
        this.to = to;

        const measurements = this.getMeasures();

        this.sprite.width = measurements.length;
        this.sprite.rotation = measurements.rotation;
        this.sprite.position.setTo(to.x, to.y);
    }

    private getMeasures() {
        const connection = this.from.clone().subtract(this.to);
        const length = connection.magnitude();
        return {
            length,
            rotation: (connection.y > 0 ? 1 : -1) * Math.acos(connection.x / length),
        };
    }

    public destroy() {
        this.sprite.destroy(true);
    }
}
