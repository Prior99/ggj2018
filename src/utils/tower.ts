import { TOWER_VALUE } from "../const";

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
            };
        case TowerType.ROUTER:
            return {
                icon: "icon-tower-router",
                sprite: "tower-router",
                value: TOWER_VALUE.ROUTER,
            };
        default:
    }
}
