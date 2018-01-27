import { component, inject, initialize } from "tsdi";
import { Game, Group } from "phaser-ce";

@component
export class Layers {
    @inject private game: Game;

    public ground: Group;
    public sky: Group;
    public ui: Group;

    @initialize
    private init() {
        this.ground = this.game.add.group(undefined, "ground");
        this.sky = this.game.add.group(undefined, "sky");
        this.ui = this.game.add.group(undefined, "ui");
    }
}
