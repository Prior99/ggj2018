import { component, initialize, inject } from "tsdi";
import { Game, Text } from "phaser-ce";
import { MONEY_PER_PACKAGE, INITIAL_MONEY, MONEY_PER_STAMINA } from "../const";

const style = { font: "30px ancient", fill: "#FFFFFF" };

@component
export class Money {
    @inject private game: Game;
    private money: number = INITIAL_MONEY;
    private text: Text;

    @initialize
    private init() {
        this.text = this.game.add.text(this.game.width / 2, 10, "", style);
        this.updateBalance();
        this.text.fixedToCamera = true;
    }

    public packageDelivered() {
        this.money += MONEY_PER_PACKAGE;
        this.updateBalance();
    }

    private updateBalance() {
        this.text.text = `${this.balance.toFixed(2)}$`;
    }

    public buy(value: number): boolean {
        if (this.balance >= value ) {
            this.money -= value;
            this.updateBalance();
            return true;
        }
        return false;
    }

    public get balance() {
        return this.money;
    }

    public staminaRecharged(amount: number) {
        this.money -= amount * MONEY_PER_STAMINA;
        this.updateBalance();
    }
}
