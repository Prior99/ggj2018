import { State, Animation } from "phaser-ce";
import { external } from "tsdi";

@external
export class StateBoot extends State {
    public preload() {
        this.game.load.atlas("pidgeon", "assets/pidgeon.png", "assets/pidgeon.json");
        this.game.load.atlas("seagull", "assets/seagull.png", "assets/seagull.json");
        this.game.load.atlas("crow", "assets/crow.png", "assets/crow.json");

        this.game.load.atlas("tower", "assets/tower.png", "assets/tower.json");
        this.game.load.atlas("tower-router", "assets/tower-router.png", "assets/tower-router.json");
        this.game.load.atlas("house", "assets/house.png", "assets/house.json");

        this.game.load.atlas("grass", "assets/grass.png", "assets/grass.json");
        this.game.load.atlas("weed", "assets/weed.png", "assets/weed.json");

        this.game.load.image("add-tower-button", "assets/tower_add.png");
        this.game.load.image("feather", "assets/seagull-feather.png");

        this.game.load.atlas("warning", "/assets/warning.png", "/assets/warning.json");
        this.game.load.atlas("arrow-shaft", "/assets/arrow-shaft.png", "/assets/arrow-shaft.json");
        this.game.load.atlas("arrow-head", "/assets/arrow-head.png", "/assets/arrow-head.json");

        this.game.load.audio("song", "sounds/song.wav");
        this.game.load.atlas("package", "assets/package.png", "assets/package.json");
    }

    public create() {
        this.game.state.start("game");
        const music = this.game.add.audio("song");
        music.loop = true;
        music.play();
        document.querySelector("canvas").onselectstart = () => false;
        document.querySelector("canvas").oncontextmenu = () => false;
    }
}
