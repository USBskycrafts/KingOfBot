<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="{ name: 'home' }">King of Bots</router-link>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link :class="route_name == 'pk-index' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'pk-index' }">PK</router-link>
                    </li>
                    <li class=" nav-item">
                        <router-link :class="route_name == 'rank-index' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'rank-index' }">Rank</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :class="route_name == 'record-index' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'record-index' }">Record</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav" v-if="$store.state.user.isLogin">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ $store.state.user.username }}
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link :class="route_name == 'user-bot-index' ? 'nav-link active' : 'nav-link'"
                                    :to="{ name: 'user-bot-index' }">My
                                    bots</router-link></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#" @click="logout">Exit else here</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="navbar-nav" v-else>
                    <router-link class="nav-link" :to="{ name: 'user-account-login' }" role="button">
                        login
                    </router-link>
                    <router-link class="nav-link" :to="{ name: 'user-account-register' }" role="button">
                        register
                    </router-link>
                </ul>
            </div>
        </div>

    </nav>
</template>


<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const route = useRoute();
        const store = useStore();
        let route_name = computed(() => route.name);

        const logout = () => {
            store.dispatch("logout");
        }

        return {
            route_name,
            logout
        };
    }
}
</script>

<style scoped></style>