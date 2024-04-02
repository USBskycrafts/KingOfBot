import $ from "jquery"

export default {
    state: {
        id: "",
        username: "",
        avator: "",
        token: "",
        isLogin: false,
        // if now fetching from backend
        isFetching: true,
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
        },
        updateFetching(state, isFetching) {
            state.isFetching = isFetching;
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
                success(resp) {
                    if (resp['error-message'] === 'success') {
                        context.commit("updateToken", resp.token);
                        localStorage.setItem("user-token", resp.token);
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
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
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        logout(context) {
            localStorage.removeItem('user-token');
            context.commit("logout");
        }
    },
    mudules: {

    }
}