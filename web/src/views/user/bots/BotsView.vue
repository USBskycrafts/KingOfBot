<template>
    <ContentField>
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <img :src="$store.state.user.avatar" alt="avatar" class="avatar">
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="card">
                        <div class="card-header">
                            <span style="font-size: 130%;">My Bot</span>
                            <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal"
                                data-bs-target="#add-bot-modal">
                                Create a Bot
                            </button>

                            <BotModal modalName="add-bot-modal">
                                <template #modal-title>Create a bot</template>

                                <template #modal-body>
                                    <form>
                                        <div class="mb-3">
                                            <label for="add-bot-title" class="form-label">Title</label>
                                            <input v-model="botAdded.title" type="text" class="form-control"
                                                id="add-bot-title" placeholder="please give a name for your bot">
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-description" class="form-label">Description</label>
                                            <textarea v-model="botAdded.description" class="form-control"
                                                id="add-bot-description" placeholder="add your description here"
                                                rows="3"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-code" class="form-label">Code</label>
                                            <textarea v-model="botAdded.content" class="form-control" id="add-bot-code"
                                                rows="7" placeholder="then add your code"></textarea>
                                        </div>
                                    </form>
                                </template>

                                <template #modal-footer>
                                    <div class="error-message" style="color: red; font-weight: bolder;"> {{
                                botAdded["error-message"] }}
                                    </div>
                                    <button type="button" class="btn btn-primary" @click="addBot">Create</button>
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cancel</button>
                                </template>
                            </BotModal>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Create Time</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bot in bots" :key="bot.botId">
                                    <td>{{ bot.title }}</td>
                                    <td>{{ bot.createAt }}</td>
                                    <td>
                                        <button class="btn btn-secondary" data-bs-toggle="modal"
                                            :data-bs-target="'#modifty-bot-modal' + bot.botId"
                                            style="margin-right: 10px;">
                                            Modify
                                        </button>

                                        <BotModal :modalName="'modifty-bot-modal' + bot.botId">
                                            <template #modal-title>Modify the Bot</template>
                                            <template #modal-body>
                                                <form>
                                                    <div class="mb-3">
                                                        <label for="add-bot-title" class="form-label">Title</label>
                                                        <input v-model="bot.title" type="text" class="form-control"
                                                            id="add-bot-title"
                                                            placeholder="please give a name for your bot">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="add-bot-description"
                                                            class="form-label">Description</label>
                                                        <textarea v-model="bot.description" class="form-control"
                                                            id="add-bot-description"
                                                            placeholder="add your description here" rows="3"></textarea>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="add-bot-code" class="form-label">Code</label>
                                                        <textarea v-model="bot.content" class="form-control"
                                                            id="add-bot-code" rows="7"
                                                            placeholder="then add your code"></textarea>
                                                    </div>
                                                </form>
                                            </template>
                                            <template #modal-footer>
                                                <div class="error-message" style="color: red; font-weight: bolder;"> {{
                                bot["error-message"] }}
                                                </div>
                                                <button type="button" class="btn btn-primary"
                                                    @click="updateBot(bot)">Modifty</button>
                                                <button type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Cancel</button>
                                            </template>
                                        </BotModal>


                                        <button class="btn btn-danger" @click="removeBot(bot)">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </ContentField>
</template>


<script>
import ContentField from "@/components/ContentField.vue"
import BotModal from "@/components/BotModal.vue"
import { ref, reactive } from "vue";
import $ from "jquery";
import { useStore } from "vuex";
import { Modal } from "bootstrap";
export default {
    setup() {
        const store = useStore();
        const bots = ref([]);
        const botAdded = reactive({
            "title": "",
            "description": "",
            "content": "",
            "error-message": ""
        });

        const refreshBots = () => {
            $.ajax({
                url: "http://localhost:3000/user/bot/get-list/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                },
                error() {
                }
            });
        }

        const addBot = () => {
            botAdded["error-message"] = '';
            $.ajax({
                url: "http://localhost:3000/user/bot/add/",
                type: 'post',
                data: {
                    title: botAdded.title,
                    description: botAdded.description,
                    content: botAdded.content
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token
                },
                success(resp) {
                    if (resp['error-message'] === 'success') {
                        botAdded.title = "";
                        botAdded.content = "";
                        botAdded.description = "";
                        Modal.getInstance('#add-bot-title').hide();
                        $('.modal-backdrop').remove();
                        refreshBots();
                    } else {
                        botAdded["error-message"] = resp['error-message'];
                    }
                }
            })
        }

        const removeBot = (bot) => {
            $.ajax({
                url: "http://localhost:3000/user/bot/remove/",
                type: 'post',
                headers: {
                    Authorization: "Bearer " + store.state.user.token
                },
                data: {
                    "bot-id": bot.botId
                },
                success() {
                    refreshBots();
                }
            });
        }

        const updateBot = (bot) => {
            bot["error-message"] = '';
            $.ajax({
                url: "http://localhost:3000/user/bot/update/",
                type: 'post',
                data: {
                    "bot-id": bot.botId,
                    "title": bot.title,
                    "description": bot.description,
                    "content": bot.content
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token
                },
                success(resp) {
                    if (resp['error-message'] === 'success') {
                        Modal.getInstance('#modifty-bot-modal' + bot.botId).hide();
                        $('.modal-backdrop').remove();
                        refreshBots();
                    } else {
                        bot["error-message"] = resp['error-message'];
                    }
                }
            })
        }

        refreshBots();
        return {
            bots,
            botAdded,
            addBot,
            removeBot,
            updateBot
        }
    },
    components: {
        ContentField,
        BotModal
    }
}
</script>

<style scoped>
.avatar {
    width: 100%;
}

.card {
    margin-top: 20px;
}
</style>
