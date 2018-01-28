import { Events, Pointer } from "phaser-ce";

export function onLeftClick(
    target: { inputEnabled?: boolean; events: Events; }, onClick: (...args: any[]) => void, context?: any
) {
    let leftClick = false;

    function down(_, pointer: Pointer) {
        leftClick = pointer.leftButton.isDown;
    }

    function up() {
        if (leftClick) {
            onClick(...arguments);
        }
        leftClick = false;
    }

    target.inputEnabled = true;
    target.events.onInputDown.add(down, undefined, undefined, context);
    target.events.onInputUp.add(up, undefined, undefined, context);
}
