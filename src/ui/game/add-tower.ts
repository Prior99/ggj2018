import { external, inject, initialize } from "tsdi";
import { bind } from "decko";
import { Game, Sprite } from "phaser-ce";

import { TOWER_VALUE } from "../../const";
import { Layers } from "../../layers";
import { Towers } from "../../controllers/towers";

import { onLeftClick } from "../../utils/click";

const style = { font: "8px Arial", fill: "#FFFFFF" };

@external
class AddTowerButton {
    @inject private game: Game;
    @inject private layers: Layers;
    @inject private towerController: Towers;

    private button: Sprite;
    private buyMode = false;

    @initialize
    public init() {
        this.button = this.game.add.sprite(20, 20, "add-tower-button");
        onLeftClick(this.button, this.click);
        this.button.fixedToCamera = true;

        this.layers.ui.add(this.button);

        const text = this.game.add.text(10, 1, `${TOWER_VALUE.SIMPLE}$`, style);
        this.button.addChild(text);
    }

    @bind
    private click(): void {
        this.buyMode = !this.buyMode;

        if (this.buyMode) {
            this.towerController.spawnGhost(20, 20, undefined, () => this.buyMode = false);
        } else {
            this.towerController.removeGhost();
        }
    }
}

export function createAddTowerButton(): AddTowerButton {
    return new AddTowerButton();
}
