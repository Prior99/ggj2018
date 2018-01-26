import { State, Animation, Keyboard } from "phaser-ce";
import { external, inject } from "tsdi";
import { Pidgeons, Towers } from "../controllers";

@external
export class Game extends State {
    @inject private pidgeons: Pidgeons;
    @inject private towers: Towers;

    public create() {
        this.stage.backgroundColor = "#FFFFFF";
        this.pidgeons.init();
        this.towers.init();
    }

    public update() {
        const elapsed = this.game.time.elapsed / 1000;
        this.pidgeons.update(elapsed);
        this.towers.update(elapsed);
    }
}
