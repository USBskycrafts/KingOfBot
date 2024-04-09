<template>
    <ContentField id="play-ground">
        <PlayGround />
    </ContentField>
</template>


<script>
import ContentField from "@/components/ContentField.vue"
import PlayGround from "@/components/PlayGround.vue"

export default {
    setup() {
        // const store = useStore();
        // $.ajax({
        //     url: "http://localhost:3000/user/bot/add/",
        //     type: "post",
        //     data: {
        //         title: "Bot",
        //         description: "description",
        //         content: "content",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // });

        // $.ajax({
        //     url: "http://localhost:3000/user/bot/update/",
        //     type: "post",
        //     data: {
        //         "bot-id": 1,
        //         "title": "alice",
        //         "description": "description",
        //         "content": "content",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // });

        // $.ajax({
        //     url: "http://localhost:3000/user/bot/get-list/",
        //     type: "get",
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // });
    },
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
