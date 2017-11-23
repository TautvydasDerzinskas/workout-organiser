const constants = require('../constants.js')
const utilityService = require('./utilities.js')

class GetExercises {
  constructor () {
    this.exercises = {}
  }
  async start (categories) {
    for (let muscleCategory of categories) {
      console.log(`Fetching <${muscleCategory}> exercises...`)
      await this._scrapAllPagesForSpecificGroup(muscleCategory)
    }

    return this.exercises
  }

  _scrapAllPagesForSpecificGroup (muscleCategory) {
    return new Promise((resolve, reject) => {
      this._getPageExercises(muscleCategory, 1, resolve, reject)
    })
  }

  async _getPageExercises (muscleGroup, pageNumber, resolve, reject) {
    const $ = await utilityService.scrapUrl(
      `${constants.sourceUrl}${constants.exercisesPath}${constants.musclePath}${muscleGroup}/${pageNumber}`
    )

    const resultsCount = $('.ExResult-row').length
    if (resultsCount === 0) {
      resolve(this.exercises)
    } else {
      const _self = this
      $('.ExResult-row').each(function () {
        if (!_self.exercises[muscleGroup]) {
          _self.exercises[muscleGroup] = []
        }

        _self.exercises[muscleGroup].push(
          utilityService.extractExercise($(this))
        )
      })
      pageNumber++
      this._getPageExercises(muscleGroup, pageNumber, resolve, reject)
    }
  }
}

module.exports = new GetExercises()
