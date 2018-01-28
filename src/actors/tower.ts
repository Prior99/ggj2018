import { external, inject, initialize } from "tsdi";
import { Game, Line, Sprite } from "phaser-ce";
import Victor = require("victor");

import { REST_STAMINA_PER_SECOND } from "../const";
import { Layers } from "../layers";
import { Towers } from "../controllers/towers";
import { Bird } from "./bird";
import { Arrow } from "../ui/arrow";

export abstract class Tower {
    @inject protected game: Game;
    @inject private layers: Layers;
    @inject("Towers") private towerController: Towers;

    protected pos: Victor;

    protected sprite: Sprite;
    public birds: Bird[];
    public seatingOffsets: {x: number, y: number}[];

    protected possibleTargets: Tower[] = [];
    private connectionSprites: Arrow[] = [];

    private warning: Sprite;

    constructor(
        pos: Victor,
        capacity = 4,
        seatingOffsets = [{x: 6, y: 4}, {x: -6, y: 4}, {x: 14, y: 4}, {x: -14, y: 4}],
    ) {
        this.pos = pos;

        this.birds = Array(capacity).fill(undefined);
        this.seatingOffsets = seatingOffsets;
    }

    protected abstract init();

    @initialize
    private initTower() {
        this.init();

        this.sprite.anchor.setTo(0.5, 0.5);

        const button = this.game.add.button(
            this.pos.x, this.pos.y, undefined, this.onSelect, this, 0, 0, 0, 0, this.layers.ground,
        );
        button.anchor.setTo(0.5, 0.5);
        button.addChild(this.sprite);

        this.checkHasTargets();
    }

    private onSelect() {
        this.towerController.select(this);
    }

    public set selected(selected: boolean) {
        if (selected) {
            this.connectionSprites = this.possibleTargets.map((connection) =>
                new Arrow(this.position, connection.position),
            );
        } else {
            this.connectionSprites.forEach((sprite) => sprite.destroy());
            this.connectionSprites = [];
        }
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
        this.docked(bird);

        return this.birds.reduce((result: Victor, current: Bird, index: number) => {
            if (bird === current) {
                const offset = new Victor(this.seatingOffsets[index].x, this.seatingOffsets[index].y);
                return this.pos.clone().add(offset);
            }
            return result;
        }, undefined);
    }

    public abstract canConnect(tower: Tower): boolean;

    protected postConnect(target: Tower): void {
        // No post connect action. For bidirectional towers, connect target to this
    }

    public addTarget(tower: Tower): boolean {
        if (this.canConnect(tower)) {
            this.possibleTargets.push(tower);
            this.postConnect(tower);

            this.checkHasTargets();
            return true;
        }

        return false;
    }

    public removeTarget(tower: Tower): void {
        const connectionIndex = this.possibleTargets.indexOf(tower);

        if (connectionIndex === -1) {
            return;
        }

        this.possibleTargets = this.possibleTargets.splice(connectionIndex, 1);
        this.checkHasTargets();
    }

    private checkHasTargets() {
        if (this.possibleTargets.length === 0) {
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
                const target = this.getTarget(bird);
                if (target) {
                    bird.startFlapping();
                    this.sendBirdAway(bird);
                }
            }
        });
        this.birds = this.birds.map((bird) => bird && bird.target ? undefined : bird);
    }

    protected sendBirdAway(bird: Bird) {
        return;
    }

    protected docked(bird: Bird) {
        return;
    }

    public render() {
        this.possibleTargets.forEach(conn => {
            const line = new Line();
            line.fromSprite(this.sprite, conn.sprite);

            this.game.debug.geom(line, "rgba(255, 255, 255, 0.3)");
        });
    }
}
