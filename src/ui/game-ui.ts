import { component, inject, initialize } from "tsdi";
import { Game } from "phaser-ce";

import { createAddTowerButton } from "./game/add-tower";

@component
export class UI {
    @initialize
    public init(): void {
        createAddTowerButton();
    }
}
