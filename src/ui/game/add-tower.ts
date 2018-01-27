import { external, inject, initialize } from "tsdi";
import { Game, Button } from "phaser-ce";

import { Towers } from "../../controllers/towers";

@external
class AddTowerButton {
    @inject private game: Game;
    @inject private towerController: Towers;

    private button: Button;

    @initialize
    public init() {
        this.button = this.game.add.button(20, 20, "add-tower-button", this.click, this);
        this.button.fixedToCamera = true;
    }

    private click(): void {
        this.towerController.spawnGhost(20, 20);
    }
}

export function createAddTowerButton(): AddTowerButton {
    return new AddTowerButton();
}
