import { external, inject, initialize } from "tsdi";
import { bind } from "decko";
import { Game, Sprite } from "phaser-ce";

import { TOWER_VALUE } from "../../const";
import { Layers } from "../../layers";
import { Towers } from "../../controllers/towers";

import { onLeftClick } from "../../utils/click";
import { TowerType, getTowerProps } from "../../utils/tower";

const style = { font: "8px Arial", fill: "#FFFFFF" };

@external
class AddTowerButton {
    @inject private game: Game;
    @inject private layers: Layers;
    @inject("Towers") private towerController: Towers;

    private button: Sprite;
    private buyMode = false;

    private x: number;
    private y: number;
    private type: TowerType;

    public constructor(x: number, y: number, type: TowerType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    @initialize
    public init() {
        this.button = this.game.add.sprite(this.x, this.y, "button");
        onLeftClick(this.button, this.click);
        this.button.fixedToCamera = true;

        this.layers.ui.add(this.button);

        const props = getTowerProps(this.type);

        const tower = this.game.add.sprite(7, 8, props.icon);
        const add = this.game.add.sprite(22, 22, "icon-add");
        const coin = this.game.add.sprite(5, 4, "icon-coin");
        const cost = this.game.add.text(10, 1, `${props.value}$`, style);

        this.button.addChild(tower);
        this.button.addChild(add);
        this.button.addChild(coin);
        this.button.addChild(cost);
    }

    @bind
    private click(): void {
        this.buyMode = !this.buyMode;

        if (this.buyMode) {
            this.towerController.spawnGhost(this.x, this.y, this.type, () => this.buyMode = false);
        } else {
            this.towerController.removeGhost();
        }
    }
}

export function createAddTowerButton(x: number, y: number, type: TowerType): AddTowerButton {
    return new AddTowerButton(x, y, type);
}
