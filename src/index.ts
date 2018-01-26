import "p2";
import "pixi";
import * as Phaser from "phaser-ce";
import { TSDI, component, factory, external } from "tsdi";
import * as States from "./states";

@external
export class GGJ2018 extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super(config);
        this.state.add("boot", States.Boot);
        this.state.add("main-menu", States.MainMenu);
        this.state.add("game", States.Game);
        this.state.start("boot");
    }
}

@component
class GameFactory {
    @factory({ name: "GGJ2018" })
    public createGame(): GGJ2018 {
        const gameConfig: Phaser.IGameConfig = {
            width: 800,
            height: 600,
            renderer: Phaser.AUTO,
            parent: "",
            resolution: 1,
        };
        return new GGJ2018(gameConfig);
    }
}

window.onload = async () => {
    const tsdi = new TSDI();
    tsdi.enableComponentScanner();
    tsdi.get(GGJ2018);
};
