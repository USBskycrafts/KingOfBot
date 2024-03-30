<template>
    <GameMap id="map" />
</template>


<script>
import GameMap from "@/components/GameMap"
export default {
    components: {
        GameMap
    }
}
</script>

<style scoped>
#map {
    height: 70vh;
    width: 60vw;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>