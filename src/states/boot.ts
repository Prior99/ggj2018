import { State, Animation } from "phaser-ce";
import { external } from "tsdi";

@external
export class Boot extends State {
    public preload() {
        this.game.load.atlas("character", "/assets/character/fred.png", "/assets/character/fred.json");
    }

    public create() {
        this.game.state.start("game");
    }
}
