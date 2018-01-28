import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { Tower } from "../tower";
import { Bird } from "../bird";
import { Discovery } from "../birds/discovery";
import { Carrier } from "../birds/carrier";

export interface Route {
    via: Tower;
    used: number;
}

export interface Query {
    target: Tower;
    failed: Tower[];
    active: Tower[];
    started: Date;
    origin: Tower;
    parent?: Query;
    fulfilledVia?: Tower;
    allFailed?: boolean;
}

@external
export class Router extends Tower {
    private animations: {
        default: Animation;
    };

    private routingTable = new Map<Tower, Route>();
    private activeQueries: Query[] = [];

    constructor(pos: Victor, capacity = 4) {
        super(pos, capacity);
    }

    protected init() {
        this.sprite = this.game.add.sprite(0, 0, "tower-router");

        this.animations = {
            default: this.sprite.animations.add(
                "default", Animation.generateFrameNames("tower-router ", 0, 5, ".ase", 1),
            ),
        };
        this.animations.default.play(3, true);
    }

    public update(dt: number) {
        super.update(dt);
        return;
    }

    public canConnect(target: Tower): boolean {
        return true;
    }

    private get oldestActiveQuery() {
        return this.activeQueries.reduce((result, query) => {
            if (!result) {
                return query;
            }
            if (result.started < query.started) {
                return result;
            }
            return query;
        }, undefined);
    }

    private findDiscoveryTarget(bird: Discovery): Tower {
        const { query } = bird;
        if (query) {
            if (query.fulfilledVia) {
                return query.origin;
            }
            if (this.possibleTargets.every(target => query.failed.includes(target))) {
                return query.origin;
            }
            return;
        }
        if (this.activeQueries.length === 0) {
            return this.findRandomTarget();
        }
        const { oldestActiveQuery } = this;
        const via = this.possibleTargets.find(possible => {
            return !oldestActiveQuery.active.includes(possible) && !oldestActiveQuery.failed.includes(possible);
        });
        bird.query = oldestActiveQuery;
        if (!via) {
            if (this.possibleTargets.every(possible => oldestActiveQuery.failed.includes(possible))) {
                this.activeQueries = this.activeQueries.filter(active => active !== oldestActiveQuery);
                return oldestActiveQuery.origin;
            }
            return this.findRandomTarget();
        }
        oldestActiveQuery.active.push(via);
        return via;
    }

    private findCarrierTarget(bird: Carrier): Tower {
        if (!bird.freight) {
            return this.findRandomTarget();
        }
        const { target } = bird.freight;
        if (this.routingTable.has(target)) {
            const route = this.routingTable.get(target);
            route.used++;
            return route.via;
        }
        if (this.activeQueries.some(query => query.target === target)) {
            return;
        }
        this.activeQueries.push({
            target,
            failed: [],
            active: [],
            started: new Date(),
            origin: this,
        });
        return;
    }

    private findRandomTarget(): Tower {
        return this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
    }

    protected getTarget(bird: Bird): Tower {
        if (bird instanceof Carrier) {
            return this.findCarrierTarget(bird);
        }
        if (bird instanceof Discovery) {
            return this.findDiscoveryTarget(bird);
        }
        return this.findRandomTarget();
    }
    protected sendBirdAway(bird: Bird) {
        return;
    }

    protected docked(bird: Bird) {
        if (!(bird instanceof Discovery)) {
            return;
        }
        const { query } = bird;
        if (!query) {
            return;
        }
        delete bird.query;
        const { parent } = query;
        if (parent && parent.origin === this) {
            if (query.fulfilledVia) {
                parent.fulfilledVia = query.origin;
                this.routingTable.set(parent.target, { used: 0, via: query.origin });
                this.activeQueries = this.activeQueries.filter(active => active !== parent);
            } else {
                parent.failed.push(query.origin);
                parent.active.filter(current => current !== query.origin);
            }
            return;
        }
        if (this.routingTable.has(query.target)) {
            query.fulfilledVia = this;
            return;
        }
        this.activeQueries.push({
            parent: query,
            failed: [],
            active: [],
            started: new Date(),
            origin: this,
            target: query.target,
        });
    }
}
