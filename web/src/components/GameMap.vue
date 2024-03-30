<template>
    <div ref="parent" id="game-map">
        <canvas ref="canvas" id="canvas"></canvas>
    </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { GameMap } from "@/assets/script/GameMap.js";
export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value);
        });

        return {
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
#game-map {
    height: 100%;
    width: 100%;
}
</style>