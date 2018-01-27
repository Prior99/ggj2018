import { external } from "tsdi";
import Victor = require("victor");

import { Tower } from "../tower";
import { Bird } from "../bird";

@external
export class SimpleTower extends Tower {
    constructor(pos: Victor, capacity = 4) {
        super(pos, capacity);

        console.log("create simepl tower");
    }

    public canConnect(target: Tower): boolean {
        return this.connections.length < 1;
    }

    protected getTarget(bird: Bird): Tower {
        return this.connections[0];
    }
}
