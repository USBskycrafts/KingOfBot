<template>
    <ContentField>
        <PlayGround v-if="$store.state.pk.status === 'playing'" />
        <MatchField v-else-if="$store.state.pk.status === 'matching'" />
        <ResultBoard v-if="$store.state.pk.loser != 'none'" />
    </ContentField>
</template>


<script>
import ContentField from "@/components/ContentField.vue"
import PlayGround from "@/components/PlayGround.vue"
import MatchField from "@/components/MatchField.vue";
import ResultBoard from "@/components/ResultBoard.vue"
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        let socketURL = `ws://localhost:3000/websocket/${store.state.user.token}/`;
        let socket = new WebSocket(socketURL);
        onMounted(() => {
            store.commit("updateCompetitor", {
                username: "mein competitor",
                avatar: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png"
            });

            socket.onopen = () => {
                store.commit("updateSocket", socket);
            }

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if (data.event === 'start-matching') {
                    store.commit("updateCompetitor", {
                        username: data.competitorName,
                        avatar: data.competitorAvatar
                    });
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                        store.commit("updateMap", data.map);
                    }, 2000);
                } else if (data.event === "move") {
                    console.log(data);
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;
                    snake0.set_direction(data['a-direction']);
                    snake1.set_direction(data['b-direction']);
                } else if (data.event === "result") {
                    console.log(data);
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;

                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "dead";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "dead";
                        store.commit("updateLoser", data.loser);
                    }
                }
            }

            socket.onclose = () => {
                store.commit('updateSocket', {
                    socket: null
                });
            }
        });

        onUnmounted(() => {
            socket.close();
            store.commit("updateStatus", "matching");
        })
    },
    components: {
        ContentField,
        PlayGround,
        MatchField,
        ResultBoard
    }
}
</script>

<style scoped></style>
