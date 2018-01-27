import { State, Animation } from "phaser-ce";
import { external } from "tsdi";

@external
export class StateBoot extends State {
    public preload() {
        this.game.load.atlas("pidgeon", "/assets/pidgeon.png", "/assets/pidgeon.json");
        this.game.load.atlas("seagull", "/assets/seagull.png", "/assets/seagull.json");
        this.game.load.atlas("tower", "/assets/tower.png", "/assets/tower.json");
        this.game.load.atlas("grass", "/assets/grass.png", "/assets/grass.json");
        this.game.load.atlas("weed", "/assets/weed.png", "/assets/weed.json");
        this.game.load.atlas("weed", "/assets/weed.png", "/assets/weed.json");
        this.game.load.atlas("house", "/assets/house.png", "/assets/house.json");
        this.game.load.audio("song", "/sounds/song.wav");
    }

    public create() {
        this.game.state.start("game");
        const music = this.game.add.audio("song");
        music.loop = true;
        music.play();
    }
}
