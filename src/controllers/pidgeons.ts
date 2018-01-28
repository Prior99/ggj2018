import { component, initialize, inject } from "tsdi";
import Victor = require("victor");
import { Bird } from "../actors/bird";
import { Carrier } from "../actors/birds/carrier";
import { Discovery } from "../actors/birds/discovery";
import { Controller } from "../controller";
import { Sprite, Game, Particles } from "phaser-ce";

import { MAX_BIRDS, INITIAL_BIRDS, CARRIER_CHANCE, SPAWN_INTERVAL } from "../const";
import { Query } from "../actors/towers/router";

@component("Pidgeons")
export class Pidgeons implements Controller {
    @inject private game: Game;

    private pidgeons: Bird[] = [];
    private featherEmitter: Particles.Arcade.Emitter;

    private timstSinceSpawn = 0;

    private spawn<T extends Bird>(B: {new(pos: Victor): T; }) {
        const x = Math.random() * 600 - 300;
        const y = Math.random() * 600 - 300;
        this.pidgeons.push(new B(new Victor(x, y)));
    }

    @initialize
    public init() {
        for (let i = 0; i < Math.floor(CARRIER_CHANCE * INITIAL_BIRDS); ++i) {
            this.spawn(Carrier);
        }
        for (let i = 0; i < Math.ceil((1 - CARRIER_CHANCE) * INITIAL_BIRDS); ++i) {
            this.spawn(Discovery);
        }

        this.featherEmitter = this.game.add.emitter(0, 0, 2000);
        this.featherEmitter.makeParticles("feather");
    }

    public update(dt: number) {
        this.timstSinceSpawn += dt;

        this.featherEmitter.forEachAlive((p) => { p.alpha = p.lifespan / this.featherEmitter.lifespan; });
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

            // 'explode', 'lifetime', ignored when explosion, 'numParticles'
            this.featherEmitter.start(true, 1000, null, 50);
        });
        this.pidgeons = alive;

        if (this.pidgeons.length < MAX_BIRDS && this.timstSinceSpawn > SPAWN_INTERVAL) {
            this.timstSinceSpawn = 0;
            if (Math.random() <= CARRIER_CHANCE) {
                this.spawn(Carrier);
            } else {
                this.spawn(Discovery);
            }
        }

        this.pidgeons.map(bird => bird.update(dt));
    }

    public cancelQuery(query: Query) {
        this.pidgeons.forEach(bird => {
            if (bird instanceof Discovery) {
                if (bird.query  === query) {
                    delete bird.query;
                }
            }
        });
    }

    public render() {
        this.pidgeons.forEach(bird => bird.render());
    }
}
