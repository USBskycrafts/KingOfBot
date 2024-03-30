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
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            User Template
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link :class="route_name == 'user-bot-index' ? 'nav-link active' : 'nav-link'"
                                    :to="{ name: 'user-bot-index' }">My
                                    bots</router-link></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Exit else here</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

    </nav>
</template>


<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
    setup() {
        const route = useRoute();
        let route_name = computed(() => route.name);
        return {
            route_name
        };
    }
}
</script>

<style scoped></style>