import { State, Animation } from "phaser-ce";
import { external } from "tsdi";
import { ZOOM } from "../const";

enum LoadType {
    ATLAS,
    IMAGE,
    AUDIO,
}

@external
export class StateBoot extends State {
    private toLoad: { key: string, baseName: string, type: LoadType, estimatedSize: number }[] = [];

    private get totalSize() {
        return this.toLoad.reduce((result, { estimatedSize }) => result + estimatedSize, 0);
    }

    public addResource(key: string, baseName: string, type: LoadType, estimatedSize: number) {
        this.toLoad.push({ key, baseName, type, estimatedSize });
    }

    public preload() {
        const container = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "progress-bar-container");
        const content = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "progress-bar-content");
        container.anchor.x = 0.5;
        container.anchor.y = 0.5;
        content.anchor.x = 0.5;
        content.anchor.y = 0.5;

        this.addResource("pidgeon", "pidgeon", LoadType.ATLAS, 0.00026);
        this.addResource("seagull", "seagull", LoadType.ATLAS, 0.000396);
        this.addResource("crow", "crow", LoadType.ATLAS, 0.000327);

        this.addResource("tower", "tower", LoadType.ATLAS, 0.000318);
        this.addResource("tower-router", "tower-router", LoadType.ATLAS, 0.000308);
        this.addResource("house", "house", LoadType.ATLAS, 0.000199);

        this.addResource("grass", "grass", LoadType.ATLAS, 0.0017);
        this.addResource("weed", "weed", LoadType.ATLAS, 0.000511);

        this.addResource("add-tower-button", "tower_add", LoadType.IMAGE, 0.000482);
        this.addResource("feather", "seagull-feather", LoadType.IMAGE, 0.000116);

        this.addResource("warning", "warning", LoadType.ATLAS, 0.000163);
        this.addResource("arrow-shaft", "arrow-shaft", LoadType.ATLAS, 0.00012);
        this.addResource("arrow-head", "arrow-head", LoadType.ATLAS, 0.000153);
        this.addResource("button", "button", LoadType.IMAGE, 0.0002);
        this.addResource("icon-coin", "icon-coin", LoadType.IMAGE, 0.0002);
        this.addResource("icon-add", "icon-add", LoadType.IMAGE, 0.0002);
        this.addResource("icon-tower-simple", "icon-tower-simple", LoadType.IMAGE, 0.0002);

        this.addResource("song", "song", LoadType.AUDIO, 5.5);
        this.addResource("package", "package", LoadType.ATLAS, 0.000129);

        const style = { font: "15px ancient", fill: "#FFFFFF" };
        const sizeText = `Loading ${this.totalSize.toFixed(2)} MB`;
        const totalText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 20, sizeText, style);
        totalText.anchor.x = 0.5;
        totalText.anchor.y = 1;

        let loaded = 0;
        this.toLoad.forEach(({ key, baseName, type, estimatedSize }) => {
            loaded += estimatedSize;
            switch (type) {
                case LoadType.ATLAS: {
                    this.game.load.atlas(key, `assets/${baseName}.png`, `assets/${baseName}.json`);
                    break;
                }
                case LoadType.IMAGE: {
                    this.game.load.image(key, `assets/${baseName}.png`);
                    break;
                }
                case LoadType.AUDIO: {
                    this.game.load.audio(key, `sounds/${baseName}.mp3`);
                    break;
                }
                default: break;
            }
            content.width = 100 * (loaded / this.totalSize);
            console.log(`Loading at ${content.width}%`);
        });
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
