import { TOWER_VALUE, TOWER_RANGE } from "../const";

export enum TowerType {
    SIMPLE,
    ROUTER,
}

export function getTowerProps(type: TowerType) {
    switch (type) {
        case TowerType.SIMPLE:
            return {
                icon: "icon-tower-simple",
                sprite: "tower",
                value: TOWER_VALUE.SIMPLE,
                range: TOWER_RANGE.SIMPLE,
            };
        case TowerType.ROUTER:
            return {
                icon: "icon-tower-router",
                sprite: "tower-router",
                value: TOWER_VALUE.ROUTER,
                range: TOWER_RANGE.ROUTER,
            };
        default:
    }
}
