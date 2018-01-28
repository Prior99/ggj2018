import { State, Animation } from "phaser-ce";
import { external } from "tsdi";
import { ZOOM } from "../const";

@external
export class StatePreBoot extends State {
    private progress = 0;

    public preload() {
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(ZOOM, ZOOM);
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.load.image("progress-bar-container", "assets/progress-bar-container.png");
        this.game.load.image("progress-bar-content", "assets/progress-bar-content.png");
    }

    public create() {
        this.game.state.start("boot");
        document.querySelector("canvas").onselectstart = () => false;
        document.querySelector("canvas").oncontextmenu = () => false;
    }
}
