package org.kob.backend.consumer.utils;

import com.alibaba.fastjson2.JSONObject;
import lombok.Data;
import org.kob.backend.consumer.WebSocketServer;
import org.kob.backend.pojo.Record;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Data
public class GameMap implements Runnable {
    private Integer rows, cols;
    private Integer barriersNr;
    private int[][] g;
    private Player playerA, playerB;
    private Integer nextStepA = null, nextStepB = null;
    private String status = "";
    private String loser = "";
    static private Logger logger = LoggerFactory.getLogger(GameMap.class);

    public GameMap(int rows, int cols, int barriersNr, Integer idA, Integer idB) {
        this.rows = rows;
        this.cols = cols;
        this.barriersNr = barriersNr;
        this.g = new int[rows][cols];
        this.playerA = new Player(idA, this.rows - 2, 1, new ArrayList<>());
        this.playerB = new Player(idB, 1, this.cols - 2, new ArrayList<>());
    }

    public void createMap() {
        Logger logger = LoggerFactory.getLogger(GameMap.class);
        for (int i = 0; i < 1000 && !draw(); i++) {
            if (i == 999) {
                logger.error("cannot draw a valid map");
                throw new RuntimeException("cannot draw a valid map");
            }
        }
        logger.debug("\nbarriers:\n" + Arrays.deepToString(this.g).replace("],", "],\n") + "\n");
    }

    private boolean checkConnectivity(int sx, int sy, int tx, int ty) {
        if (sx == tx && sy == ty)
            return true;
        g[sx][sy] = 1;
        int[] dx = new int[] {-1 ,0, 1, 0};
        int[] dy = new int[] {0, 1, 0, -1};
        for (int i = 0; i < 4; i++) {
            int x = sx + dx[i], y = sy + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && g[x][y] == 0) {
                if (checkConnectivity(x, y, tx, ty)) {
                    g[sx][sy] = 0;
                    return true;
                }
            }
        }
        g[sx][sy] = 0;
        return false;
    }

    private boolean draw() {
        Arrays.stream(g).forEach(row -> Arrays.fill(row, 0));

        for (int r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = 1;
        }

        for (int c = 0; c < this.cols; c++) {
            g[0][c] = g[this.rows - 1][c] = 1;
        }

        Random random = new Random();
        for (int i = 0; i < this.barriersNr / 2; i++) {
            for (int j = 0; j < 1000; j++) {
                int r = random.nextInt(this.rows);
                int c = random.nextInt(this.cols);

                if (g[r][c] == 1) {
                    continue;
                }
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                    continue;
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = 1;
                break;
            }
        }

        return checkConnectivity(this.rows - 2, 1, 1, this.cols - 2);
    }


    public void setNextStepA(Integer nextStepA) {
        synchronized (this) {
            this.nextStepA = nextStepA;
        }
    }

    public void setNextStepB(Integer nextStepB) {
        synchronized (this) {
            this.nextStepB = nextStepB;
        }
    }


    /// waiting for next step
    private boolean nextStep() throws InterruptedException {
        Thread.sleep(200);
        for (int i = 0; i < 50; i++) {
            Thread.sleep(100);
            synchronized (this) {
                if (nextStepA != null && nextStepB != null) {
                    playerA.getSteps().add(nextStepA);
                    playerB.getSteps().add(nextStepB);
                    return true;
                }
            }
        }
        return false;
    }

    private String getMapString() {
        StringBuilder map = new StringBuilder();
        for (int i = 0; i < this.rows; i++) {
            for (int j = 0; j < this.cols; j++) {
                map.append(g[i][j]);
            }
        }
        return map.toString();
    }

    private void saveToDataBase() {
        Record record = new Record(
                null,
                playerA.getId(),
                playerA.getStartX(),
                playerA.getStartY(),
                playerB.getId(),
                playerB.getStartX(),
                playerB.getStartY(),
                playerA.getStepsStrings(),
                playerB.getStepsStrings(),
                getMapString(),
                loser,
                new Date()
        );

        WebSocketServer.recordMapper.insert(record);
    }

    private void sendResult() {
        saveToDataBase();
        JSONObject resp = new JSONObject();
        resp.put("event", "result");
        resp.put("loser", loser);
        sendAllMessage(resp.toJSONString());
    }

    private void sendMove() {
        JSONObject resp = new JSONObject();
        resp.put("event", "move");
        synchronized (this) {
            resp.put("a-direction", nextStepA);
            resp.put("b-direction", nextStepB);
            nextStepA = nextStepB = null;
        }
        sendAllMessage(resp.toJSONString());
    }

    private void sendAllMessage(String message) {
        logger.debug("Sending message to clients writing: " + message);
        WebSocketServer.users.get(playerA.getId()).sendMessage(message);
        WebSocketServer.users.get(playerB.getId()).sendMessage(message);
    }


    private boolean checkValid(List<SnakeCell> cellsA, List<SnakeCell> cellsB) {
        int n = cellsA.size();
        SnakeCell cell = cellsA.get(n - 1);
        if (g[cell.x][cell.y] == 1)
            return false;
        for (int i = 0; i < n - 1; i++) {
            if (cellsA.get(i).x == cell.x && cellsA.get(i).y == cell.y)
                return false;
        }

        for (int i = 0 ; i < n - 1; i++) {
            if (cellsB.get(i).x == cell.x && cellsB.get(i).y == cell.y)
                return false;
        }
        return true;
    }

    private void judge() {
        List<SnakeCell> cellsA = playerA.getCells();
        List<SnakeCell> cellsB = playerB.getCells();
        logger.debug("cells A: " + cellsA.toString() + " cells B " + cellsB.toString());
        boolean isAValid = checkValid(cellsA, cellsB);
        boolean isBValid = checkValid(cellsB, cellsA);
        logger.debug("A is " + isAValid + " and B is " + isBValid);
        if (!isAValid || !isBValid) {
            status = "finished";
            if (!isAValid && !isBValid)
                loser = "all";
            else if (!isAValid)
                loser = "A";
            else
                loser = "B";
        }
    }

    @Override
    public void run() {
        status = "playing";
        for (int i = 0; i < 1000; i++) {
            try {
                if (nextStep()) {
                    judge();
                    if ("playing".equals(status)) {
                        // broadcast the step to two players
                        sendMove();
                    } else {
                        sendResult();
                        break;
                    }
                } else {
                    status = "finished";
                    synchronized (this) {
                        if (nextStepA == null && nextStepB == null) {
                            loser = "all";
                        } else if (nextStepA == null) {
                            loser = "A";
                        } else if (nextStepB == null) {
                            loser = "B";
                        } else {
                            throw new RuntimeException();
                        }
                    }
                    sendResult();
                    break;
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
