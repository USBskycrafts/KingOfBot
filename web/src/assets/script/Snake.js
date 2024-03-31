import { GameObject } from "./GameObject";
import { SnakeCell } from "./SnakeCell";


export class Snake extends GameObject {
    constructor(info, map) {
        super();
        this.info = info;
        this.map = map;

        this.cells = [];
        this.speed = 5;

        /// -1 no direction, 0, 1, 2, 3 represent up, left, down, right
        this.direction = -1;
        /// idle, moving, dead
        this.status = "idle";
        /// where the head at the next round
        this.next_cell = null;
        /// round number
        this.round = 0;


        /// snake's eye direction
        if (info.id === 0) {
            this.eye_direction = 0;
        } else if (info.id === 1) {
            this.eye_direction = 2;
        } else {
            throw "no such id";
        }


        /// the eyes' coordinate
        this.eye_dx = [
            [-1, 1],
            [-1, -1],
            [-1, 1],
            [1, 1]
        ];

        this.eye_dy = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [1, -1]
        ];
    }


    start() {
        super.start();
        /// cells[0]为蛇头
        this.cells.push(new SnakeCell(this.info.r, this.info.c));
    }

    update() {
        super.update();
        if (this.status === 'moved') {
            this.update_move();
        }
        this.render();
    }

    destroy() {
        super.destroy();
    }

    render() {
        this.render_cells();
        this.render_eyes();
    }

    render_cells() {
        const L = this.map.L;
        const context = this.map.context;
        const cell_size = this.map.L * 0.8;
        
        context.fillStyle = this.info.color;
        if (this.status === 'dead') {
            context.fillStyle = 'white';
        }
        this.cells.map((cell) => {
            context.beginPath();
            context.arc(cell.x * L, 
                cell.y * L, 
                cell_size / 2,
                0, 2 * Math.PI);
            context.fill();
        });

        // Rect补圆之间的空
        for (let i in this.cells) {
            if (i == 0)
                continue;
            const a = this.cells[i], b = this.cells[i - 1];
            const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
            if (dx < 1e-2 && dy < 1e-2) {
                continue;
            } else if (dx < 1e-2) {
                context.fillRect((a.c + 0.1) * L, Math.min(a.y, b.y) * L, cell_size, Math.abs(a.y - b.y) * L);
            } else if (dy < 1e-2) {
                context.fillRect(Math.min(a.x, b.x) * L, (a.r + 0.1) * L, Math.abs(a.x - b.x) * L, cell_size);
            } else {
                throw "cannot drop here";
            }
        }
    }
    
    render_eyes() {
        const context = this.map.context;
        const L = this.map.L;
        context.fillStyle = 'black';
        for (let i = 0; i < 2; i++) {
            const head = this.cells[0];
            const eye_x = (head.x + this.eye_dx[this.eye_direction][i] * 0.2) * L;
            const eye_y = (head.y + this.eye_dy[this.eye_direction][i] * 0.2) * L;

            context.beginPath();
            context.arc(eye_x, eye_y, L * 0.05, 0, 2 * Math.PI);
            context.fill();
        }
    }

    update_move() {
        /// 两帧之间走的距离
        const mov_dis = this.speed * this.timedelta / 1000;
        const head = this.cells[0];
        const dx = this.next_cell.x - head.x;
        const dy = this.next_cell.y - head.y;

        const tail = this.cells.at(-1);
        const sec_tail = this.cells.at(-2);
        const dx_t = sec_tail.x - tail.x;
        const dy_t = sec_tail.y - tail.y;

        const dis = Math.sqrt(dx * dx + dy * dy);
        if (dis < 1e-2) {
            this.cells[0] = this.next_cell;
            if (!this.check_if_increasing()) {
                this.cells.pop();
            }
            this.next_cell = null;
            this.status = 'idle';
            this.direction = -1;  
        } else {
            head.x += mov_dis * dx / dis;
            head.y += mov_dis * dy / dis;
            if (!this.check_if_increasing()) {
                tail.x += mov_dis * dx_t / dis;
                tail.y += mov_dis * dy_t / dis;
            }
        }
    }

    /// 判断是否增长蛇尾
    check_if_increasing() {
        if (this.round <= 10)
            return true;
        if (this.round % 3 === 1)
            return true;
        return false;
    }


    set_direction(d) {
        this.direction = d;
    }

    /// 变更蛇的状态为走下一步
    next_step() {
        const d = this.direction;
        const dy = [-1, 0, 1, 0], dx = [0, -1, 0, 1];
        const head = this.cells[0];


        /// moving the cells
        this.next_cell = new SnakeCell(head.r + dy[d], head.c + dx[d]);
        this.direction = -1;
        this.status = 'moved';
        ++this.round;
        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }  
        if (!this.map.check_valid(this.next_cell)) {
            this.status = 'dead';
        }


        /// moving eye direction
        this.eye_direction = d;
    }
}