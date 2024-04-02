<template>
    <ContenField>
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="register">
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
                    <div class="mb-3">
                        <label for="confirmedPassword" class="form-label">password</label>
                        <input v-model="confirmedPassword" type="password" class="form-control" id="confirmedPassword"
                            placeholder="Input your password again">
                    </div>
                    <div class="error-message"> {{ errorMessage }}</div>
                    <button type="submit" class="btn btn-primary">register</button>
                </form>
            </div>
        </div>
    </ContenField>
</template>


<script>
import ContenField from "@/components/ContentField.vue"
import { ref } from "vue";
import $ from "jquery"
import router from "@/router/index";
import store from "@/store/index";

export default {
    setup() {
        let username = ref('');
        let password = ref('');
        let confirmedPassword = ref('');
        let errorMessage = ref('');

        const register = () => {
            $.ajax({
                url: "http://localhost:3000/user/account/register/",
                type: "post",
                data: {
                    username: username.value,
                    password: password.value,
                    confirmedPassword: confirmedPassword.value
                },
                success(resp) {
                    if (resp['error-message'] === 'success') {
                        errorMessage.value = 'register successfully';
                        setTimeout(() => store.dispatch("login", {
                            username: username.value,
                            password: password.value,
                            success(resp) {
                                if (resp['error-message'] === 'success')
                                    router.push({ name: 'home' });
                            },
                            error() {

                            }
                        }), 1000);
                    } else {
                        errorMessage.value = resp['error-message'];
                    }
                }
            });
        };
        return {
            username,
            password,
            confirmedPassword,
            errorMessage,
            register,
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