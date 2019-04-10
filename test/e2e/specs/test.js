// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'All elements are rendered on page': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('h1', 5000)
      .assert.containsText('h1', 'Habrascanner')
      .assert.containsText('.settings-link', 'настройки')
      .assert.containsText('.e-query-info-content', 'постов за два дня')
      .elements('css selector', '.query-item', function (result) {
        console.log('All 4 filters are present')
        browser.assert.equal(result.value.length, 4)
      })

    browser.click('.settings-link')
    browser.pause(500)
    browser.assert.visible('.popup')
    browser.elements('css selector', '.popup-tabs > li', function (result) {
      console.log('All 4 popup tabs are present')
      browser.assert.equal(result.value.length, 4)
    })
    browser.elements('css selector', '.popup-content:first-child > .label', function (result) {
      console.log('First popup tab has 6 items on it')
      browser.assert.equal(result.value.length, 6)
    })
    browser.click('.popup-tabs > li[data-tab="favorites"]')
    browser.pause(500)
    browser.assert.visible('.popup-content[data-tab="favorites"]')
    browser.assert.containsText('.popup-content[data-tab="favorites"]', 'У вас нет закладок')

    browser.click('.close-popup')
    browser.pause(500)
    browser.assert.hidden('.popup')

    browser.end()
  }
}
