import { external, inject, initialize } from "tsdi";
import { Sprite, Animation, Game } from "phaser-ce";
import Victor = require("victor");

import { Tower } from "../tower";
import { Bird } from "../bird";
import { Discovery } from "../birds/discovery";
import { Carrier } from "../birds/carrier";
import { House } from "./house";
import { ROUTING_TIMEOUT } from "../../const";

import { TowerType } from "../../utils/tower";

export interface Route {
    via: Tower;
    used: number;
}

export interface Active {
    when: Date;
    to: Tower;
    bird: Discovery;
}

export interface Query {
    /**
     * The final house the original router has been looking for.
     */
    target: House;
    /**
     * All immediate neighboruing towers which have been visited already from this router
     * and of which the discovery birds have returned and reported that
     * this tower does not lead to the requested target.
     */
    failed: Tower[];
    /**
     * All immediate neighbouring towers to which discovery birds have beeen sent, but which
     * have not yet returned.
     */
    active: Active[];
    started: Date;
    /**
     * The immediate router (not the overall original router which started the routing) which
     * created this exact query.
     */
    origin: Router;
    /**
     * Queries are chained. This is the parenting query. Go down to the chain of `query.parent`
     * and you will reach the original router which initiated the routing.
     */
    parent?: Query;
    /**
     * If a child query or even this query reached the final target of the routing,
     * then this property will carry the immediate neighbour which lead to finding the final target.
     */
    fulfilledVia?: Tower;
}

@external
export class Router extends Tower {
    private animations: {
        default: Animation;
    };

    private routingTable = new Map<Tower, Route>();
    /**
     * Contains all queries which are currently in progress. These were all initiated by this exact router.
     * In progress means no target has been found yet.
     */
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

    public get type() {
        return TowerType.ROUTER;
    }

    public update(dt: number) {
        super.update(dt);
        this.scrubActiveTimeouts();
        this.activeQueries = this.activeQueries.filter(activeQuery => {
            return !this.possibleTargets.every(possible => activeQuery.failed.includes(possible));
        });
        return;
    }

    private scrubActiveTimeouts() {
        const now = Date.now();
        this.activeQueries.forEach(query => {
            const timedOut = query.active.reduce((result: Active[], active) => {
                if ((now - active.when.getTime()) / 1000 > ROUTING_TIMEOUT) {
                    result.push(active);
                    delete active.bird.query;
                }
                return result;
            }, []);
            query.active = query.active.filter(current => !timedOut.includes(current));
            query.failed.push(...timedOut.map(active => active.to));
        });
    }

    public canConnect(target: Tower): boolean {
        return true;
    }

    private get oldestActiveQueryNotAllBusy() {
        return this.activeQueries
            // Ignore all queries where all of this routers neighbours have either failed or are currently active.
            .filter(query => {
                const { failed, active } = query;
                const activeTowers = active.map(pair => pair.to);
                return this.possibleTargets.some(possible =>
                    !failed.includes(possible) && !activeTowers.includes(possible),
                );
            })
            // Of the remaining queries, return the oldest one, or `undefined`.
            .reduce((result, query) => {
                if (!result) {
                    return query;
                }
                if (result.started < query.started) {
                    return result;
                }
                return query;
            }, undefined);
    }

    /**
     * Called when a bird wants to take of and is a discovery bird.
     * Called by `getTarget`.
     */
    private findDiscoveryTarget(bird: Discovery): Tower {
        const { query } = bird;
        // If the bird is already on a mission and wants to take off,
        // then it needs some time to be on it's way back. As discovery birds
        // always just go one step in the network ahead, initiate a new routing process
        // and report back to the router they were sent by.
        if (query) {
            const success = Boolean(query.fulfilledVia);
            const failure = Boolean(this.possibleTargets.every(target => query.failed.includes(target)));
            if (this.routingTable.has(query.target) && !query.fulfilledVia) {
                query.fulfilledVia = this;
            }
            // If the query was successfull (Note that it has been given to other birds as a reference),
            // or failed (= all neighbours have been tested and non had a route to the target), send
            // the bird back to the origin of the query to report back. The reporting happens when the
            // bird docks to the router.
            if (success || failure || this.routingTable.has(query.target)) {
                if (query.origin === this) {
                    delete bird.query;
                    return this.findRandomTarget();
                }
                return query.origin;
            }
            // If neither success nor failure have been determined yet, the bird needs to wait for subsequent
            // queries initiated by this router.
            return;
        }
        // If the bird was not yet on a mission and no queries are currently active and not completely busy,
        // just send that bird away.
        const { oldestActiveQueryNotAllBusy: nextQuery } = this;
        if (!nextQuery) {
            return this.findRandomTarget();
        }
        bird.query = nextQuery;
        const activeTowers = nextQuery.active.map(pair => pair.to);
        // Find a neighbour to which no discovery bird has been sent yet.
        const neighbour = this.possibleTargets.find(possible => {
            return !activeTowers.includes(possible) && !nextQuery.failed.includes(possible);
        });
        // If we could not find such a neighbour, this means there is currently nothing to do for this query.
        if (!neighbour) {
            return this.findRandomTarget();
        }
        nextQuery.active.push({ when: new Date(), to: neighbour, bird });
        return neighbour;
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

    /**
     * Called when an incoming bird got a seat on the perch for sure and docked to this tower.
     */
    protected docked(bird: Bird) {
        // Nothing to do for carriers.
        if (!(bird instanceof Discovery)) {
            return;
        }
        const { query } = bird;
        // If the bird isn't on a mission from another router, ignore it.
        if (!query) {
            return;
        }
        // The parent of the query is the last step of the query chain.
        const { parent } = query;
        if (query.origin === this) {
            delete bird.query;
            if (query.fulfilledVia) {
                if (parent) {
                    parent.fulfilledVia = this;
                }

                this.routingTable.set(query.target, { used: 0, via: bird.from });
                this.activeQueries = this.activeQueries.filter(active => active !== query);
            } else {
                query.failed.push(bird.from);
                query.active.filter(current => current.to !== bird.from);
            }
            return;
        }
        if (this.routingTable.has(query.target)) {
            query.fulfilledVia = this;
            return;
        }
        this.activeQueries.push({
            parent: query,
            failed: [this, bird.from],
            active: [],
            started: new Date(),
            origin: this,
            target: query.target,
        });
    }
}
