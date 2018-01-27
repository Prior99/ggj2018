import { external, inject, initialize } from "tsdi";
import { Game, Line, Sprite } from "phaser-ce";
import Victor = require("victor");
import { REST_STAMINA_PER_SECOND } from "../const";
import { Layers } from "../layers";
import { Bird } from "./bird";

export abstract class Tower {
    @inject protected game: Game;

    protected pos: Victor;

    protected sprite: Sprite;
    protected capacity: number;
    public perch: Bird[];
    public birds: Bird[] = [];

    protected connections: Tower[] = [];
    private lines: Line[] = [];

    constructor(pos: Victor, capacity = 4) {
        this.pos = pos;

        this.capacity = capacity;
        this.perch = [undefined, undefined, undefined, undefined];
    }

    @initialize
    private init() {
        return;
    }

    protected abstract getTarget(bird: Bird): Tower;

    public isFull(): boolean {
        return this.birds.length === this.capacity;
    }

    public get position(): Victor {
        return this.pos.clone();
    }

    public getSpotPosition(bird: Bird): Victor {
        const xOffset = [20, -20, 60, -60];
        this.perch.forEach((registered, index) => {
            if (bird === registered) {
                const offset = new Victor(xOffset[index], 0);
                return this.pos.clone().add(offset);
            }
        });
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
    }
    public render() {
        // this.lines.forEach(line => this.game.debug.geom(line, "rgba(255, 255, 255, 0.3)"));
    }
}
