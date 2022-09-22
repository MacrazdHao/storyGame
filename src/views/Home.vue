<template>
  <div class="Home">
    <p @click="start">start</p>
    <p @click="maker">Maker</p>
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
    },
    maker () {
      this.$router.push({ path: 'maker' })
    }
  }
}
</script>
