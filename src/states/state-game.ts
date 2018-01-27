import { State, Animation, Keyboard, Point, CursorKeys } from "phaser-ce";
import { external, inject, TSDI } from "tsdi";
import Victor = require("victor");
import { Towers } from "../controllers/towers";
import { Pidgeons } from "../controllers/pidgeons";
import { World } from "../world";
import { CAMERA_SPEED } from "../const";

@external
export class StateGame extends State {
    @inject private tsdi: TSDI;

    private pidgeons: Pidgeons;
    private towers: Towers;
    private gameWorld: World;
    private dragPoint: Point;
    private cursor: CursorKeys;

    public create() {
        this.stage.backgroundColor = "#222222";
        this.gameWorld = this.tsdi.get(World);
        this.pidgeons = this.tsdi.get(Pidgeons);
        this.towers = this.tsdi.get(Towers);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(-1000, -1000, 2000, 2000);
        this.game.camera.focusOnXY(0, 0);

        // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        // this.scale.setUserScale(2, 2);
        // this.game.renderer.renderSession.roundPixels = true;
        // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    }

    public update() {
        const elapsed = this.game.time.elapsed / 1000;
        if (this.game.input.activePointer.isDown) {
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

        this.pidgeons.update(elapsed);
        this.towers.update(elapsed);
    }

    public render() {
        const { DEBUG_CAMERA } = window as any;
        if (DEBUG_CAMERA) { this.game.debug.cameraInfo(this.game.camera, 32, 32); }
    }
}
