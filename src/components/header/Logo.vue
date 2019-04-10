<template>
  <h1 class="logo-title">
    <a href="/">Habrascanner</a>
    <!-- <a href="/">Хабрасканер</a> -->
    <span
      :class="{
        loader: true,
        icon: true,
        'icon-spin4': true,
        _visible: this.$store.state.loading
      }"
    >
    </span>
    <div class="settings-link-container">
      <span class="settings-link" @click="toggleSettigns()">настройки</span>
    </div>
  </h1>
</template>

<script>
export default {
  name: 'Logo',
  methods: {
    toggleSettigns () {
      this.$store.commit('toggleSettingsPopup', !this.$store.state.showSettingsPopup)
    }
  }
}
</script>

<style lang="scss">
  .language-item {
    opacity: 0.7;
    display: inline-block;
    cursor: pointer;
    transition: 0.25s ease;

    &._active, &:hover {
      opacity: 1;
    }

    &>img {
      width: 12px;
    }
  }

  .settings-link-container {
    position: absolute;
    right: 0;
  }
  .settings-link {
    cursor: pointer;
    color: #555;

    [data-theme="dark"] & {
      color: #a2a5a6;
    }

    &:hover {
      border-bottom: 1px dashed;
    }
  }

  .logo-title {
    margin-top: 0;
    vertical-align: middle;
    position: relative;

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
