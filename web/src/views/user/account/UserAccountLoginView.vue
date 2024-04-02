<template>
    <ContenField>
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="username" class="form-label">username</label>
                        <input v-model="username" type="text" class="form-control" id="username"
                            placeholder="Input your username here">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">password</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Input your password here">
                    </div>
                    <div class="error-message"> {{ errorMessage }}</div>
                    <button type="submit" class="btn btn-primary">login</button>
                </form>
            </div>
        </div>
    </ContenField>
</template>


<script>
import ContenField from "@/components/ContentField.vue"
import { useStore } from "vuex"
import { ref } from "vue";
import router from "@/router/index";

export default {
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let errorMessage = ref('');

        const login = () => {
            errorMessage.value = "";
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getInfo", {
                        success() {
                            router.push({ name: 'home' });
                        },
                    })
                },
                error() {
                    errorMessage.value = "login fault";
                }
            });
        };
        return {
            username,
            password,
            errorMessage,
            login,
        }
    },
    components: {
        ContenField
    }
}
</script>

<style scoped>
button {
    width: 100%;
}

div.error-message {
    color: red;
    font-weight: bolder;
}
</style>