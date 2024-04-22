<template>
    <div ref="parent" id="game-map">
        <canvas ref="canvas" id="canvas" tabindex="0"></canvas>
    </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { GameMap } from "@/assets/script/GameMap.js";
import { useStore } from "vuex";
export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);
        const store = useStore();

        onMounted(() => {
            const gameObject = new GameMap(canvas.value.getContext('2d'), parent.value, store);
            store.commit("updateGameObject", gameObject);
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