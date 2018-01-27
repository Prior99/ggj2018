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
    public birds: Bird[] = [undefined, undefined, undefined, undefined];

    protected connections: Tower[] = [];
    private lines: Line[] = [];
    private warning: Sprite;

    constructor(pos: Victor, capacity = 4) {
        this.pos = pos;

        this.capacity = capacity;
    }

    protected init() {
        this.checkConnection();
    }

    protected abstract getTarget(bird: Bird): Tower;

    public isFull(): boolean {
        return this.birds.every(bird => bird !== undefined);
    }

    public get position(): Victor {
        return this.pos.clone();
    }

    public land(bird: Bird): Victor {
        if (this.isFull()) {
            return undefined;
        }

        const freeIndex = this.birds.reduce((bestIndex, seat, currentIndex) => {
            return seat === undefined ? currentIndex : bestIndex;
        }, 0);
        this.birds[freeIndex] = bird;

        const xOffset = [6, -6, 14, -14];
        return this.birds.reduce((result: Victor, current: Bird, index: number) => {
            if (bird === current) {
                const offset = new Victor(xOffset[index], 4);
                return this.pos.clone().add(offset);
            }
            return result;
        }, undefined);
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
            this.checkConnection();
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
        this.checkConnection();
    }

    private checkConnection() {
        if (this.connections.length === 0) {
            if (!this.warning) {
                this.warning = this.game.add.sprite(this.pos.x, this.pos.y - 14, "warning");
                this.warning.alpha = 0;
                this.game.add.tween(this.warning).to({ alpha: 1 }, 1000, "Linear", true, 0, -1).yoyo(true);
            }
        } else {
            if (this.warning)  {
                this.warning.destroy();
                delete this.warning;
            }
        }
    }

    public update(dt: number) {
        this.birds.forEach((bird, index) => {
            if (bird === undefined) {
                return;
            }
            bird.stamina += dt * REST_STAMINA_PER_SECOND;

            if (bird.isRested) {
                bird.target = this.getTarget(bird);
                bird.startFlapping();
                this.sendBirdAway(bird);
            }
        });
        this.birds = this.birds.map((bird) => bird && bird.target ? undefined : bird);
    }

    protected sendBirdAway(bird: Bird) {
        return;
    }

    public render() {
        // this.lines.forEach(line => this.game.debug.geom(line, "rgba(255, 255, 255, 0.3)"));
    }
}
