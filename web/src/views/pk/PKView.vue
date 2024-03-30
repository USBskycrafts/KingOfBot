<template>
    <ContentField id="play-ground">
        <PlayGround />
    </ContentField>
</template>


<script>
import ContentField from "@/components/ContentField.vue"
import PlayGround from "@/components/PlayGround.vue"
export default {
    components: {
        ContentField,
        PlayGround
    }
}
</script>

<style scoped>
#play-ground {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
