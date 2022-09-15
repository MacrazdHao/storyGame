<template>
  <div class="Home">
    <p @click="start">start</p>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    start () {
      this.$router.push({ path: 'sceen' })
    }
  }
}
</script>
