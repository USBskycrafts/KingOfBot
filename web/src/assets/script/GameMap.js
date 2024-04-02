import { Barrier } from "./Barrier";
import { GameObject } from "./GameObject";
import { Snake } from "./Snake";


export class GameMap extends GameObject {
    constructor(context, parent) {
        super();
        this.context = context;
        this.parent = parent;
        this.L = 0;
        this.rows = 13;
        this.cols = 14;

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
        
        let create_bitmap = () => {
            let g = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
            /// 四周加上障碍
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (i == 0 || i == this.rows - 1
                        || j == 0 || j == this.cols - 1)
                        g[i][j] = true;
                }
            }


            /// 随机障碍
            for (let i = 0; i < this.BARRIER_NR / 2; i++) {
                for (let j = 0; j < 1000; j++) {
                    let r = parseInt(Math.random() * this.rows);
                    let c = parseInt(Math.random() * this.cols);
                    let r_prime = this.rows - 1 - r;
                    let c_prime = this.cols - 1 - c;
                    if (g[r][c] || g[r_prime][c_prime]) 
                        continue; 
                    if (r == this.rows - 2 && c == 1)
                        continue;
                    if (c == 1 && c == this.cols - 2)
                        continue;
                    g[r][c] = g[r_prime][c_prime] = true;
                    break;
                }
            }
            return g;
        }

        let is_connective = (g, x, y) => {
            if (x == 1 && y == this.cols - 2)
                return true; 
            g[x][y] = true;
            let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
            for (let i = 0; i < 4; i++) {
                let u = x + dx[i], v = y + dy[i];
                if (u < 1 || u >= this.rows - 1)
                    continue;
                if (v < 1 || v >= this.cols - 1)
                    continue;
                if (!g[u][v] && is_connective(g, u, v)) 
                    return true;

            } 
            return false;
        }

        let g = create_bitmap();
        let g_copied = JSON.parse(JSON.stringify(g));
        while (!is_connective(g_copied, this.rows - 2, 1)) {
            g = create_bitmap();
            g_copied = JSON.parse(JSON.stringify(g));
        }

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
            const [snake0, snake1] = this.snakes;
            switch(e.key) {
            case 'w':
                snake0.set_direction(0);
                break;
            case 'ArrowUp':
                snake1.set_direction(0);
                break;
            case 'a':
                snake0.set_direction(1);
                break;
            case 'ArrowLeft':
                snake1.set_direction(1);
                break;
            case 's':
                snake0.set_direction(2);
                break;
            case 'ArrowDown':
                snake1.set_direction(2);
                break;
            case 'd':
                snake0.set_direction(3); 
                break;
            case 'ArrowRight':
                snake1.set_direction(3);
                break;
            default:
            }
        });
    }
}