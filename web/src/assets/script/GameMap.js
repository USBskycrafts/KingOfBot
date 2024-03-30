import { Barrier } from "./Barrier";
import { GameObject } from "./GameObject";


export class GameMap extends GameObject {
    constructor(context, parent) {
        super();
        this.context = context;
        this.parent = parent;
        this.L = 0;
        this.rows = 13;
        this.cols = 13;

        this.barriers = [];
        this.BARRIER_NR = parseInt(this.rows * this.cols / 5);
    }

    start() {
        super.start();
        this.create_barriers();
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
                    if (g[r][c]) 
                        continue; 
                    if (r == this.rows - 2 && c == 1)
                        continue;
                    if (c == 1 && c == this.cols - 2)
                        continue;
                    g[r][c] = g[c][r] = true;
                    break;
                }
            }
            return g;
        }

        let is_connective = (g, x, y) => {
            if (x == 1 && y == this.cols - 2)
                return true; 
            g[x][y] = true;
            console.log(g);
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
                    new Barrier(i, j, this);
            }
        }
    }

    update() {
        super.update();
        this.update_size();
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
}