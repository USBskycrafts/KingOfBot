import { GameObject } from "./GameObject";

export class Barrier extends GameObject {
    constructor(row, col, map) {
        super();
        this.row = row;
        this.col = col;
        this.map = map;
        this.color = '#B37226'
    }

    start() {
        super.start();
    }

    update() {
        super.update();
        this.render();
    }

    destroy() {
        super.destroy();
    }

    render() {
        const L = this.map.L;
        const context = this.map.context;

        context.fillStyle = this.color;
        context.fillRect(this.col * L, this.row * L, L, L);
    }
}