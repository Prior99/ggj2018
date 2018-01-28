import { external, inject, initialize } from "tsdi";
import { Game, TileSprite, Sprite } from "phaser-ce";
import Victor = require("victor");

import { onLeftClick } from "../utils/click";

@external
export class Arrow {
    @inject private game: Game;

    private sprite: TileSprite;
    private head: Sprite;

    private from: Victor;
    private to: Victor;
    private dashed: boolean;
    private onClick: (...args: any[]) => void;

    public constructor(from: Victor, to: Victor, onClick?: (...args: any[]) => void, dashed = false) {
        this.from = from;
        this.to = to;
        this.dashed = dashed;
        this.onClick = onClick;
    }

    @initialize
    private init() {
        const { length, rotation } = this.getMeasures();

        this.sprite = this.game.add.tileSprite(this.to.x, this.to.y, length, 16, "arrow-shaft", this.dashed ? 1 : 0);
        this.sprite.anchor.y = 0.5;

        this.head = this.game.add.sprite(0, 0, "arrow-head");
        this.head.angle = 180;
        this.head.anchor.x = 1;
        this.head.anchor.y = 0.5;

        this.sprite.addChild(this.head);

        this.sprite.rotation = rotation;

        if (this.onClick) {
            onLeftClick(this.sprite, this.onClick, this);
        }
    }

    public set disabled(disable: boolean) {
        if (disable) {
            this.sprite.alpha = 0.5;
        } else {
            this.sprite.alpha = 1;
        }
    }

    public set color(color: number) {
        this.sprite.tint = color;
        this.head.tint = color;
    }

    public set target(to: Victor) {
        this.to = to;

        const measurements = this.getMeasures();

        this.sprite.width = measurements.length;
        this.sprite.rotation = measurements.rotation;
        this.sprite.position.setTo(to.x, to.y);
    }

    public get target() {
        return this.to;
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
