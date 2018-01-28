import { component, inject, initialize } from "tsdi";
import { Game, Group } from "phaser-ce";

@component
export class Layers {
    @inject private game: Game;

    public floor: Group;
    public ground: Group;
    public sky: Group;
    public ui: Group;

    @initialize
    private init() {
        this.floor = this.game.add.group(undefined, "floor");
        this.ground = this.game.add.group(undefined, "ground");
        this.sky = this.game.add.group(undefined, "sky");
        this.ui = this.game.add.group(undefined, "ui");
    }

    public get allWorldSprites() {
        return [
            ...this.floor.children,
            ...this.ground.children,
            ...this.sky.children,
        ];
    }
}
