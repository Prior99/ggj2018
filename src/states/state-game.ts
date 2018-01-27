import { State, Animation, Keyboard } from "phaser-ce";
import { external, inject, TSDI } from "tsdi";
import { Towers } from "../controllers/towers";
import { Pidgeons } from "../controllers/pidgeons";
import { World } from "../world";

@external
export class StateGame extends State {
    @inject private tsdi: TSDI;

    private pidgeons: Pidgeons;
    private towers: Towers;
    private gameWorld: World;

    public create() {
        this.stage.backgroundColor = "#222222";
        this.pidgeons = this.tsdi.get(Pidgeons);
        this.towers = this.tsdi.get(Towers);
        this.gameWorld = this.tsdi.get(World);
    }

    public update() {
        const elapsed = this.game.time.elapsed / 1000;
        this.pidgeons.update(elapsed);
        this.towers.update(elapsed);
    }
}
