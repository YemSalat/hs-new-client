import Vue from 'vue'
import Logo from '@/components/Logo'

describe('Logo.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Logo)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#app h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
