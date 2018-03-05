<template>
  <span
    class="back-drop-splash"
    :style="getStyle()"
  />
</template>

<script>
export default {
  name: 'BackDrop',
  data () {
    return {
      updateTimer: -1,
      updateDelay: 300
    }
  },
  props: {
    group: {
      type: String,
      required: true
    }
  },
  methods: {
    getStyle () {
      let item = document.querySelector(`input[value="${this.$store.state.selectedFilters[this.group]}"]`)
      if (!item) return ''
      item = item.parentNode // use parent node instead of input itself

      let style = ''
      style += `transform: translate3d(${item.offsetLeft}px, ${item.offsetTop}px, 0);`
      style += `width: ${item.offsetWidth}px;`
      style += `height: ${item.offsetHeight}px;`

      return style
    },
    scheduleUpdate () {
      window.clearTimeout(this.updateTimer)
      this.updateTimer = window.setTimeout(() => this.$forceUpdate(), this.updateDelay)
    }
  },
  mounted () {
    window.addEventListener('resize', this.scheduleUpdate)
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.scheduleUpdate)
  }
}
</script>
