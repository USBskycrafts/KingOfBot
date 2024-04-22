package org.kob.backend.consumer.utils;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    private Integer id;
    private Integer startX, startY;
    private List<Integer> steps;


    private boolean checkTailIncreasing(int step) {
        if (step <= 10)
            return true;
        return step % 3 == 1;
    }
    public List<SnakeCell> getCells() {
        List<SnakeCell> cells = new ArrayList<>();
        /// const dy = [-1, 0, 1, 0], dx = [0, -1, 0, 1];
        int[] dx = {-1, 0, 1, 0};
        int[] dy = {0, -1, 0, 1};

        int step = 0;
        int x = startX, y = startY;
        cells.add(new SnakeCell());
        for (int d : steps) {
            x += dx[d];
            y += dy[d];
        }
        cells.add(new SnakeCell(x, y));
        if (checkTailIncreasing(++step)) {
            cells.removeFirst();
        }
        return cells;
    }

    public String getStepsStrings() {
        StringBuilder steps = new StringBuilder();
        for (int d : this.steps) {
            steps.append(d);
        }
        return steps.toString();
    }
}
