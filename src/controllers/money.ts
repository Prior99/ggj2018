import { component, initialize, inject } from "tsdi";
import { Game, Text } from "phaser-ce";
import { MONEY_PER_PACKAGE, INITIAL_MONEY } from "../const";

const style = { font: "30px ancient", fill: "#FFFFFF" };

@component
export class Money {
    @inject private game: Game;
    private money: number = INITIAL_MONEY;
    private text: Text;

    @initialize
    private init() {
        this.text = this.game.add.text(this.game.width / 2, 10, `${this.balance}$`, style);
        this.text.fixedToCamera = true;
    }

    public packageDelivered() {
        this.money += MONEY_PER_PACKAGE;
        this.text.text = `${this.balance}$`;
    }

    public buy(value: number): boolean {
        if (this.balance >= value ) {
            this.money -= value;
            this.text.text = `${this.balance}$`;

            return true;
        }

        return false;
    }

    public get balance() {
        return this.money;
    }
}
