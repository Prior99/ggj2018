import { State, Animation, Keyboard, Point, CursorKeys } from "phaser-ce";
import { external, inject, TSDI } from "tsdi";
import Victor = require("victor");
import { Towers } from "../controllers/towers";
import { Pidgeons } from "../controllers/pidgeons";
import { Houses } from "../controllers/houses";
import { Packages } from "../controllers/packages";
import { World } from "../world";
import { CAMERA_SPEED, ZOOM } from "../const";
import { Controller } from "../controller";
import { UI } from "../ui/game-ui";
import { Money } from "../controllers/money";

@external
export class StateGame extends State {
    @inject private tsdi: TSDI;

    private dragPoint: Point;
    private cursor: CursorKeys;
    private controllers: Controller[] = [];

    public create() {
        this.stage.backgroundColor = "#222222";
        this.tsdi.get(World);
        this.tsdi.get(UI);
        this.tsdi.get(Money);

        this.controllers.push(this.tsdi.get(Houses));
        this.controllers.push(this.tsdi.get(Towers));
        this.controllers.push(this.tsdi.get(Pidgeons));
        this.controllers.push(this.tsdi.get(Packages));

        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(-1000, -1000, 2000, 2000);
        this.game.camera.focusOnXY(0, 0);

        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(ZOOM, ZOOM);
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.time.advancedTiming = true;
    }

    public update() {
        const elapsed = this.game.time.elapsed / 1000;
        if (this.game.input.activePointer.rightButton.isDown) {
            if (this.dragPoint) {
                this.game.camera.x += this.dragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.dragPoint.y - this.game.input.activePointer.position.y;
            }
            this.dragPoint = this.game.input.activePointer.position.clone();
        }
        else {
            delete this.dragPoint;
        }
        if (this.cursor.up.isDown) {
            this.game.camera.y -= CAMERA_SPEED;
        }
        if (this.cursor.down.isDown) {
            this.game.camera.y += CAMERA_SPEED;
        }
        if (this.cursor.left.isDown) {
            this.game.camera.x -= CAMERA_SPEED;
        }
        if (this.cursor.right.isDown) {
            this.game.camera.x += CAMERA_SPEED;
        }

        this.controllers.forEach(controller => controller.update && controller.update(elapsed));
    }

    public render() {
        const { DEBUG_CAMERA, DEBUG_FPS } = window as any;
        if (DEBUG_CAMERA) { this.game.debug.cameraInfo(this.game.camera, 32, 32); }
        if (DEBUG_FPS) { this.game.debug.text(`FPS: ${this.game.time.fps}` || "FPS: --", 2, 15, "#FFFFFF"); }
        this.controllers.forEach(controller => controller.render && controller.render());
    }
}
