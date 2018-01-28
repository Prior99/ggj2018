import { component, inject, initialize } from "tsdi";
import { Game, Sprite, Text, Keyboard } from "phaser-ce";

import { createAddTowerButton } from "./game/add-tower";
import { Bird } from "../actors/bird";
import { Layers } from "../layers";
import { Controller } from "../controller";
import { Discovery } from "../actors/birds/discovery";

import { TowerType } from "../utils/tower";

@component
export class UI implements Controller {
    @inject private game: Game;
    @inject private layers: Layers;

    public focusedBird: Bird;
    private focusedChildren?: {
        targetText: Text;
        originText: Text;
        currentText: Text;
        stamina: {
            container: Sprite;
            content: Sprite;
        };
    };

    @initialize
    public init(): void {
        createAddTowerButton(20, 20, TowerType.SIMPLE);
        createAddTowerButton(60, 20, TowerType.ROUTER);

        this.game.input.keyboard.addKey(Keyboard.X).onDown.add(() => {
            if (this.focusedBird) {
                this.focusedBird.kill();
                this.clickedRandom();
            }
        });
    }

    public focusBird(bird: Bird) {
        this.clickedRandom();
        this.focusedBird = bird;
        this.focusedChildren = {
            currentText: this.game.add.text(10, this.game.height / 2 - 100, "I am heading here", {
                font: "15px ancient", fill: "#0000FF",
            }),
            originText: this.game.add.text(10, this.game.height / 2 - 80, "I started here", {
                font: "15px ancient", fill: "#00FF00",
            }),
            targetText: this.game.add.text(10, this.game.height / 2 - 60, "I am trying to find this", {
                font: "15px ancient", fill: "#FF0000",
            }),
            stamina: {
                container: this.game.add.sprite(10, this.game.height / 2 - 40, "progress-bar-container"),
                content: this.game.add.sprite(10, this.game.height / 2 - 40, "progress-bar-content"),
            },
        };
        this.focusedChildren.targetText.visible = false;
        this.focusedChildren.originText.visible = false;
        this.focusedChildren.currentText.visible = false;
        this.focusedChildren.targetText.fixedToCamera = true;
        this.focusedChildren.originText.fixedToCamera = true;
        this.focusedChildren.currentText.fixedToCamera = true;
        this.focusedChildren.stamina.container.fixedToCamera = true;
        this.focusedChildren.stamina.content.fixedToCamera = true;

    }

    public update() {
        if (this.focusedBird) {
            const relevant = [];
            this.focusedChildren.stamina.content.width = 100 * this.focusedBird.staminaRelative;
            relevant.push(this.focusedBird.sprite);
            if (this.focusedBird.target) {
                relevant.push(this.focusedBird.target.sprite);
                this.focusedChildren.currentText.visible = true;
            } else {
                this.focusedChildren.currentText.visible = false;
            }
            if (this.focusedBird instanceof Discovery) {
                const { query } = this.focusedBird;
                if (query) {
                    this.focusedChildren.originText.visible = true;
                    this.focusedChildren.targetText.visible = true;
                    relevant.push(query.target.sprite);
                    relevant.push(query.origin.sprite);
                } else {
                    this.focusedChildren.originText.visible = false;
                    this.focusedChildren.targetText.visible = false;
                }
            }
            this.layers.allWorldSprites.forEach((sprite: Sprite) => {
                if (!relevant.includes(sprite)) {
                    sprite.tint = 0x333333;
                } else {
                    sprite.tint = 0x9999FF;
                }
            });
        }
    }

    public clickedRandom() {
        if (this.focusedChildren) {
            this.focusedChildren.targetText.destroy();
            this.focusedChildren.originText.destroy();
            this.focusedChildren.currentText.destroy();
            this.focusedChildren.stamina.container.destroy();
            this.focusedChildren.stamina.content.destroy();
        }
        delete this.focusedBird;
        delete this.focusedChildren;
        this.layers.allWorldSprites.forEach((sprite: Sprite) => {
            sprite.tint = 0xFFFFFF;
        });
    }
}
