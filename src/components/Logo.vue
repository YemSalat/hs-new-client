<template>
  <h1 class="logo-title"><a href="/">Habrascanner</a>
    <span
      :class="{
        loader: true,
        _visible: this.$store.state.loading
      }"
    >
      <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class=""></path>
      </svg>
    </span>
  </h1>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang="scss">
  .loader {
    display: inline-block;
    line-height: 1;
    width: 12px;
    vertical-align: middle;
    animation: rotate-loading infinite 1s linear;
    transform-origin: 6px 7px;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s ease;

    &._visible {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes rotate-loading {
    from { transform: rotate3d(0, 0, 1, 0deg); }
    to { transform: rotate3d(0, 0, 1, 360deg); }
  }
</style>
