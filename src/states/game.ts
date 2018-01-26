import { State, Animation, Keyboard } from "phaser-ce";
import { external, inject } from "tsdi";
import { Character } from "../actors";

@external
export class Game extends State {
    @inject private character: Character;

    public create() {
        this.stage.backgroundColor = "#FFFFFF";
    }

    public update() {
        if (this.game.input.keyboard.isDown(Keyboard.A)) {
            this.character.left();
        }
        if (this.game.input.keyboard.isDown(Keyboard.D)) {
            this.character.right();
        }
        if (this.game.input.keyboard.isDown(Keyboard.W)) {
            this.character.up();
        }
        if (this.game.input.keyboard.isDown(Keyboard.S)) {
            this.character.down();
        }
    }
}
