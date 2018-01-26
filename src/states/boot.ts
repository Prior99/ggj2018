import { State, Animation } from "phaser-ce";
import { external } from "tsdi";

@external
export class Boot extends State {
    public preload() {
        this.game.load.atlas("pidgeon", "/assets/pidgeon.png", "/assets/pidgeon.json");
        this.game.load.atlas("tower", "/assets/tower.png", "/assets/tower.json");
    }

    public create() {
        this.game.state.start("game");
    }
}
