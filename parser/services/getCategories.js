const constants = require('../constants.js')
const utilityService = require('./utilities.js')

class GetCategories {
  constructor () {
    this.categories = []
  }

  async start () {
    const $ = await utilityService.scrapUrl(
      constants.sourceUrl + constants.exercisesPath
    )
    this._extractCategories($)
    return this.categories
  }

  _extractCategories ($) {
    const selectors = ['exercise-list-left', 'exercise-list-right']
    for (let selector of selectors) {
      const _self = this
      $(`.${selector}`).children('li').each(function () {
        const categoryId = $(this).children('a').attr('href')
          .replace(constants.exercisesPath, '')
          .replace(constants.musclePath, '')
          .replace('/', '')

        _self.categories.push(categoryId)
      })
    }
  }
}

module.exports = new GetCategories()
