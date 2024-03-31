import { GameObject } from "./GameObject";

export class SnakeCell extends GameObject {
    constructor(r, c) {
        super();
        this.r = r;
        this.c = c;
        this.x = c + 0.5;
        this.y = r + 0.5;
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
         
    }
}