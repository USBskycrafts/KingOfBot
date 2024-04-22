import { Barrier } from "./Barrier";
import { GameObject } from "./GameObject";
import { Snake } from "./Snake";


export class GameMap extends GameObject {
    constructor(context, parent, store) {
        super();
        this.context = context;
        this.parent = parent;
        this.L = 0;
        this.rows = 13;
        this.cols = 14;
        this.store = store;

        this.barriers = [];
        this.BARRIER_NR = parseInt(this.rows * this.cols / 5);
    }

    start() {
        super.start();
        this.create_barriers(); 
        this.create_snakes();
        this.binding_key_listening();
    }

    create_snakes() {
        this.snakes = [
            new Snake({
                id: 0, 
                color: '#4876EC',
                r: this.rows - 2,
                c: 1},
                this),
            new Snake({
                id: 1,
                color: '#F94848',
                r: 1,
                c: this.cols - 2
            }, this)
        ];
    }


    /// 保证连通性， 保证轴对称
    create_barriers() {
        const g = this.store.state.pk.map;
        /// 创建barrier 
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (g[i][j]) 
                    this.barriers.push(new Barrier(i, j, this));
            }
        }
    }

    update() {
        super.update();
        this.update_size();
        if (this.check_ready()) {
            this.next_step(); 
        }
        this.render();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.context.canvas.width = this.L * this.cols;
        this.context.canvas.height = this.L * this.rows;
    }

    destroy() {
        super.destroy();
    }

    render() {
        this.render_map();
    }

    render_map() {
        const context =  this.context;
        let colors = ['#AAD751', '#A2D149']
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                context.fillStyle = colors[(i + j) % 2];
                context.fillRect(i * this.L, j * this.L, this.L, this.L);
            }
        }
    }

    /// 判断两条蛇是否准备好移动
    check_ready() {
        for (const snake of this.snakes) { 
            if (snake.status !== 'idle')
                return false;
            if (snake.direction === -1)
                return false;
        }
        return true; 
    }

    /// conflict detection
    check_valid(cell) {
        for (let barrier of this.barriers) {
            if (cell.r === barrier.row && cell.c === barrier.col) 
                return false;
        }
        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_if_increasing()) {
                k--;
            }
            const cells = snake.cells;
            for (let i = 0; i < k; i++) {
                if (cells[i].r === cell.r && cells[i].c === cell.c)
                    return false;
            }
        }
        return true;
    }

    /// 让两条蛇进入下一回合
    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    /// 绑定键盘监听事件
    binding_key_listening() {
        let canvas = this.context.canvas;
        canvas.focus();
        canvas.addEventListener('keydown', e => {
            // const [snake0, snake1] = this.snakes;
            let d = -1;
            switch(e.key) {
            case 'w':
                d = 0
                break;
            case 'a':
                d = 1;
                break;
            case 's':
                d = 2;
                break;
            case 'd':
                d = 3;
                break;
            default:
            }
            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({
                    event: "move",
                    direction: d
                }));
            }
        });
    }
}