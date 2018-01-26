import { inject, component, initialize } from "tsdi";
import { Animation, Sprite } from "phaser-ce";
import { GGJ2018 } from "..";

const fps = 5;
const speed = 2;

@component
export class Character {
    @inject("GGJ2018") private game: GGJ2018;

    private sprite: Sprite;
    private walkLeft: Animation;
    private walkRight: Animation;
    private walkDown: Animation;
    private walkUp: Animation;

    @initialize
    private init() {
        this.sprite = this.game.add.sprite(100, 100, "character");
        this.walkLeft = this.sprite.animations.add(
            "walk left",
            Animation.generateFrameNames("fred ", 8, 11, ".ase", 1),
        );
        this.walkRight = this.sprite.animations.add(
            "walk right",
            Animation.generateFrameNames("fred ", 12, 15, ".ase", 1),
        );
        this.walkUp = this.sprite.animations.add(
            "walk up",
            Animation.generateFrameNames("fred ", 4, 7, ".ase", 1),
        );
        this.walkDown = this.sprite.animations.add(
            "walk down",
            Animation.generateFrameNames("fred ", 0, 3, ".ase", 1),
        );
        this.walkDown.play(0);
    }

    public left() {
        this.walkLeft.play(fps, true);
        this.sprite.x -= speed;
    }

    public right() {
        this.walkRight.play(fps, true);
        this.sprite.x += speed;
    }

    public up() {
        this.walkUp.play(fps, true);
        this.sprite.y -= speed;
    }

    public down() {
        this.walkDown.play(fps, true);
        this.sprite.y += speed;
    }
}
