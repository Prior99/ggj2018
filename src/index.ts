import "p2";
import "pixi";
import * as Phaser from "phaser-ce";
import { TSDI, component, factory, external } from "tsdi";
import * as States from "./states";

@external
export class GGJ2018 extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super(config);
        this.state.add("boot", States.StateBoot);
        this.state.add("main-menu", States.StateMainMenu);
        this.state.add("game", States.StateGame);
        this.state.start("boot");
        this.antialias = false
    }
}

@component
class GameFactory {
    private game: GGJ2018;

    @factory({ name: "GGJ2018" })
    public createGame(): GGJ2018 {
        const gameConfig: Phaser.IGameConfig = {
            width: 400,
            height: 300,
            renderer: Phaser.AUTO,
            parent: "",
            resolution: 1,
        };
        this.game = new GGJ2018(gameConfig);
        return this.game;
    }

    @factory
    public getGame(): Phaser.Game {
        return this.game;
    }
}

window.onload = async () => {
    const tsdi = new TSDI();
    tsdi.enableComponentScanner();
    (window as any).game = tsdi.get(GGJ2018);
};
