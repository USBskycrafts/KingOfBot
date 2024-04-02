<template>
  <NavBar />
  <router-view />
</template>


<script>
import NavBar from "@/components/NavBar.vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  setup() {
    // $.ajax({
    //   url: "http://localhost:3000/user/account/register/",
    //   type: "post",
    //   data: {
    //     username: "google",
    //     password: "password",
    //     confirmedPassword: "password"
    //   },
    //   success: (resp) => {
    //     console.log(resp);
    //   },
    //   error: (resp) => {
    //     console.log(resp)
    //   }
    // });
  },
  components: {
    NavBar
  }
}
</script>

<style scoped></style>
