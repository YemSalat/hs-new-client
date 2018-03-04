<template>
  <h1 class="logo-title">
    <a href="/">Habrascanner</a>
    <span
      :class="{
        loader: true,
        icon: true,
        'icon-spin4': true,
        _visible: this.$store.state.loading
      }"
    >
    </span>
  </h1>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang="scss">
  .logo-title {
    margin-top: 0;
    vertical-align: middle;

    & > * {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .loader {
    position: relative;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    margin: 0 4px;
    width: 12px;

    &::before, &::after {
      display: inline-block;
      line-height: 1;
      font-size: 12px;
      vertical-align: middle;
      transition: 0.3s ease;
      margin: 0;
    }

    &::before {
      animation: rotate-loading infinite 1s linear;
      transform-origin: 6px 6px;
      visibility: hidden;
      opacity: 0;
      left: 0;
      transform: scale(0);
    }

    &._visible::before {
      opacity: 1;
      visibility: visible;
    }

    // &::after {
    //   content: '→';
    //   opacity: 1;
    //   visibility: visible;
    //   transition-delay: 0.3s;
    // }

    // &._visible::after {
    //   opacity: 0;
    //   visibility: hidden;
    //   transition-delay: 0s;
    //   transform: scale(1.4) translateX(-3px);
    // }
  }

  @keyframes rotate-loading {
    from { transform: rotate3d(0, 0, 1, 0deg); }
    to { transform: rotate3d(0, 0, 1, 360deg); }
  }
</style>
