<template>
    <div class="match-ground">
        <div class="row">
            <div class="col-6">
                <div class="user-avatar">
                    <img :src="$store.state.user.avatar" alt="user's avatar">
                </div>
                <div class="user-username">{{ $store.state.user.username }}</div>
            </div>
            <div class="col-6">
                <div class="user-avatar">
                    <img :src="$store.state.pk.competitorAvatar" alt="another's user avatar">
                </div>
                <div class="user-username">{{ $store.state.pk.competitorName }}</div>
            </div>
            <div class="col-12" style="text-align: center; padding-top: 15vh;">
                <button @click="btnOnClick" type="button" class="btn btn-warning btn-lg">{{ btnMatching }}</button>
            </div>
        </div>
    </div>
</template>


<script>
import store from '@/store';
import { ref } from 'vue';
export default {
    setup() {
        let btnMatching = ref('Start Matching');
        const btnOnClick = () => {
            if (btnMatching.value === 'Start Matching') {
                btnMatching.value = 'Stop';
                store.state.pk.socket.send(JSON.stringify({
                    event: "start-matching"
                }));
            } else if (btnMatching.value === 'Stop') {
                btnMatching.value = 'Start Matching';
                store.state.pk.socket.send(JSON.stringify({
                    event: "stop-matching"
                }));
            } else {
                throw "cannot be such status";
            }
        }


        return {
            btnMatching,
            btnOnClick
        }
    }
}
</script>

<style scoped>
.match-ground {
    height: 70vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

div.row {
    width: 100%;
    text-align: centers;
}

div.user-avatar {
    text-align: center;
}

div.user-avatar>img {
    width: 10vh;
}

div.user-username {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
</style>