import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game, Line } from "phaser-ce";
import Victor = require("victor");
import { REST_STAMINA_PER_SECOND } from "../const";
import { Bird } from "./bird";

export abstract class Tower {
    @inject private game: Game;

    private pos: Victor;
    private sprite: Sprite;
    private animations: {
        active: Animation;
    };

    protected capacity: number;
    protected birds: Bird[] = [];

    protected connections: Tower[] = [];
    private lines: Line[] = [];

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
                "active", Animation.generateFrameNames("tower ", 0, 1, ".ase", 1),
            ),
        };
        this.animations.active.play(1, true);
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
            const line = new Line();
            line.fromSprite(this.sprite, tower.sprite);
            this.lines.push(line);
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
            bird.stamina += dt * REST_STAMINA_PER_SECOND;

            if (bird.isRested()) {
                bird.target = this.getTarget(bird);
            }
        });
        this.birds = this.birds.filter((bird) => !bird.target);

        return false;
    }
    public render() {
        // this.lines.forEach(line => this.game.debug.geom(line, "rgba(255, 255, 255, 0.3)"));
    }
}
