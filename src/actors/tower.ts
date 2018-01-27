import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");
import { STAMINA_PER_SECOND } from "../const";
import { Bird } from "./bird";

export abstract class Tower {
    @inject private game: Game;

    private pos: Victor;
    private sprite: Sprite;
    private animations: {
        active: Animation;
        inactive: Animation;
    };

    protected capacity: number;
    public birds: Bird[] = [];

    protected connections: Tower[] = [];

    constructor(pos: Victor, capacity = 4) {
        this.pos = pos;

        this.capacity = capacity;
    }

    @initialize
    private init() {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, "tower");
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.animations = {
            active: this.sprite.animations.add(
                "active", Animation.generateFrameNames("tower ", 0, 0, ".ase", 1),
            ),
            inactive: this.sprite.animations.add(
                "inactive", Animation.generateFrameNames("tower ", 1, 1, ".ase", 1),
            ),
        };
        this.setAnimation();
    }

    protected abstract getTarget(bird: Bird): Tower;

    public isFull(): boolean {
        return this.birds.length === this.capacity;
    }

    public get position(): Victor {
        return this.pos.clone();
    }

    public land(bird: Bird): boolean {
        if (this.isFull()) {
            return false;
        }

        this.birds.push(bird);

        return true;
    }

    public abstract canConnect(tower: Tower): boolean;

    protected postConnect(target: Tower): void {
        // No post connect action. For bidirectional towers, connect target to this
    }

    public connect(tower: Tower): boolean {
        if (this.canConnect(tower)) {
            this.connections.push(tower);
            this.postConnect(tower);
            return true;
        }

        return false;
    }

    public disconnect(tower: Tower): void {
        const connectionIndex = this.connections.indexOf(tower);

        if (connectionIndex === -1) {
            return;
        }

        this.connections = this.connections.splice(connectionIndex, 1);
    }

    public update(dt: number) {
        this.birds.forEach((bird, index) => {
            bird.stamina += STAMINA_PER_SECOND;

            if (bird.isRested()) {
                bird.target = this.getTarget(bird);
            }
        });
        this.birds = this.birds.filter((bird) => !bird.target);

        this.setAnimation();
        return false;
    }

    private setAnimation() {
        if (this.isFull()) {
            this.animations.inactive.play(1, true);
        } else {
            this.animations.active.play(1, true);
        }
    }
}
