import { component, initialize, inject } from "tsdi";
import Victor = require("victor");
import { Bird } from "../actors/bird";
import { Carrier } from "../actors/birds/carrier";
import { Discovery } from "../actors/birds/discovery";
import { Controller } from "../controller";
import { Sprite, Game, Particles } from "phaser-ce";

@component("Pidgeons")
export class Pidgeons implements Controller {
    @inject private game: Game;

    private pidgeons: Bird[] = [];
    private featherEmitter: Particles.Arcade.Emitter;

    @initialize
    public init() {
        for (let i = 0; i < 30; ++i) {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 600 - 300;
            this.pidgeons.push(new Carrier(new Victor(x, y)));
        }
        for (let i = 0; i < 10; ++i) {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 600 - 300;
            this.pidgeons.push(new Discovery(new Victor(x, y)));
        }

        this.pidgeons[0].follow = true;

        this.game.load.image("feather", "assets/sprites/diamond.png");
        this.featherEmitter = this.game.add.emitter(0, 0, 100);
        this.featherEmitter.makeParticles("feather");
    }

    public update(dt: number) {
        const { dead, alive } = this.pidgeons.reduce((processed, pidgeon) => {
            if (pidgeon.timeOfDeath) {
                return { ...processed, dead: [...processed.dead, pidgeon] };
            }
            return { ...processed, alive: [...processed.alive, pidgeon] };

        }, { dead: [], alive: [] });
        dead.forEach(bird => {
            bird.die();
            this.featherEmitter.x = bird.pos.x;
            this.featherEmitter.y = bird.pos.y;

            this.featherEmitter.setAlpha();
            // 'explode', 'lifetime', ignored when explosion, 'numParticles'
            this.featherEmitter.start(true, 500, null, 50);
        });
        this.pidgeons = alive;
        this.pidgeons.map(bird => bird.update(dt));
    }
}
