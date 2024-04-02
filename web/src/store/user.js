import $ from "jquery"

export default {
    state: {
        id: "",
        username: "",
        avator: "",
        token: "",
        isLogin: ""
    },
    getters: {

    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.avator = user.avator;
            state.isLogin = user.isLogin;
        },
        updateToken(state, token) {
            state.token = token   
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.avator = "";
            state.token = "";
            state.isLogin = false;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/token/",
                type: "post",
                data: {
                    username: data.username,
                    password: data.password
                },
                success: (resp) => {
                    if (resp['error-message'] === 'success') {
                        context.commit("updateToken", resp.token);
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error: (resp) => {
                    console.log(resp)
                }
            });
        },
        getInfo(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/info/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + context.state.token
                },
                success(resp) {
                    if (resp['error-message'] === 'success') {
                        context.commit("updateUser", {
                            ...resp,
                            isLogin: true
                        })
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                    console.log(resp)
                },
                error(resp) {
                    console.log(resp)
                }
            });
        },
        logout(context) {
            context.commit("logout");
        }
    },
    mudules: {

    }
}