export default {
    state: {
        // 1. matching, playing
        status: "matching",
        socket: null,
        competitorName: "",
        competitorAvatar: "",
        map: null,
        "a-id": 0,
        'a-startX': 0,
        "a-startY": 0,
        "b-id": 0,
        'b-startX': 0,
        "b-startY": 0,
        gameObject: null,
        loser: "none" /// none, all, A, B
    },
    getters: {

    },
    mutations: {
        updateSocket(state, socket) {
            state.socket = socket;
        },
        updateCompetitor(state, competitor) {
            state.competitorName = competitor.username;
            state.competitorAvatar = competitor.avatar;
        },
        updateStatus(state, status) {
            state.status = status;
        },
        updateMap(state, game) {
            state.map = game.map;
            state["a-id"] = game["a-id"];
            state['a-startX'] = game["a-startX"];
            state["a-startY"] = game["a-startY"];
            state["b-id"] = game["b-id"];
            state['b-startX'] =  game['b-startX'];
            state['b-startY'] = game['b-startY'];
        },
        updateGameObject(state, gameObject) {
            state.gameObject = gameObject
        },
        updateLoser(state, loser) {
            state.loser = loser
        }
    },
    actions: {

    },
    mudules: {

    }
}