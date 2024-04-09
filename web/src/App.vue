<template>
  <NavBar />
  <router-view />
</template>


<script>
import NavBar from "@/components/NavBar.vue"
import "jquery/dist/jquery"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  setup() {

  },
  components: {
    NavBar
  }
}
</script>

<style scoped>
h1+p::first-letter {
  font-size: 300px;
}
</style>
