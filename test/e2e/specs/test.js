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
      .assert.containsText('.e-query-info-content', '20 постов за два дня отсортированы по комментариям в порядке убывания')
      .elements('css selector', '.query-item', function (result) {
        console.log('All 5 filters are present')
        browser.assert.equal(result.value.length, 5)
      })
      .end()
  }
}
