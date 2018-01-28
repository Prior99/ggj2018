import { component, inject, initialize } from "tsdi";
import { bind } from "decko";
import { Game, Pointer } from "phaser-ce";
import Victor = require("victor");

import { Towers } from "../controllers/towers";
import { Tower } from "../actors/tower";
import { Arrow } from "../ui/arrow";

@component("Connector")
export class ConnectionHandler {
    @inject protected game: Game;
    @inject("Towers") private towerController: Towers;

    public selected: Tower;

    private currentTarget: Tower;
    private from: Tower;
    private arrow: Arrow;
    private onMove: number;

    @initialize
    private init() {
        // ?
    }

    public select(tower: Tower) {
        if (this.selected) {
            this.selected.selected = false;
        }

        tower.selected = true;
        this.selected = tower;
    }

    public deselect() {
        if (this.selected) {
            this.selected.selected = false;
            this.selected = undefined;
        }
    }

    public setupConnectionHandling(tower: Tower) {
        const over = () => {
            this.currentTarget = tower;
        };
        const down = (_, pointer: Pointer) => {
            const isLeftClick = pointer.leftButton.isDown;

            if (isLeftClick) {
                if (!this.selected || this.selected !== tower) {
                    this.select(tower);
                } else {
                    this.initConnection(tower);
                }
            }
        };
        const up = () => {
            const { worldX, worldY } = this.game.input.activePointer;

            if (this.from) {
                this.connect(worldX, worldY);
            }
        };

        const drawable = tower.drawable;

        drawable.inputEnabled = true;
        drawable.events.onInputDown.add(down);
        drawable.events.onInputOver.add(over);
        drawable.events.onInputUp.add(up);
    }

    private initConnection(tower: Tower) {
        this.from = tower;

        const { worldX, worldY } = this.game.input.activePointer;

        this.arrow = new Arrow(this.from.position, new Victor(worldX, worldY));

        this.onMove = this.game.input.addMoveCallback(this.updateArrow, this);
    }

    private updateArrow(pointer: Pointer) {
        const { worldX, worldY } = pointer;

        this.arrow.target = new Victor(worldX, worldY);

        const canConnect = !this.currentTarget || this.from.canConnect(this.currentTarget);
        // this.arrow.disabled = !canConnect;
    }

    private connect(x: number, y: number) {
        if (this.currentTarget && this.currentTarget !== this.from) {
            const s = this.currentTarget.drawable;

            const bounds = new Phaser.Polygon([
                new Phaser.Point(s.left, s.top),
                new Phaser.Point(s.right, s.top),
                new Phaser.Point(s.right, s.bottom),
                new Phaser.Point(s.left, s.bottom),
            ]);

            if (bounds.contains(x, y)) {
                this.from.addTarget(this.currentTarget);
            }
        }

        this.from = undefined;
        this.arrow.destroy();
        this.arrow = undefined;
        this.game.input.deleteMoveCallback(this.updateArrow, this);
        this.onMove = undefined;
        this.currentTarget = undefined;
    }
}
