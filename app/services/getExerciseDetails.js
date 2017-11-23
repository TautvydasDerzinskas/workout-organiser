const constants = require('../constants.js')
const utilityService = require('./utilities.js')

class GetExercise {
  async start (exercises) {
    this.exercises = exercises
    for (let category in this.exercises) {
      for (let i = 0; i < this.exercises[category].length; i++) {
        await this._getDetails(this.exercises[category][i])
      }
    }

    return this.exercises
  }

  async _getDetails (exercise) {
    console.log(`Fethiching details for ${exercise.name}`)
    return new Promise(async (resolve, reject) => {
      const $ = await utilityService.scrapUrl(
        constants.sourceUrl + constants.exercisesPath + exercise.id
      )

      exercise.level = $('.bb-list--plain').children().last().text().replace('Level:', '').trim()
      exercise.alternativeName = $('.bb-list--plain').next().text().trim()

      exercise.instructions = []
      $('.ExDetail-descriptionStep').each(function () {
        exercise.instructions.push($(this).text().trim())
      })

      exercise.similar = []
      $('.ExResult-row--relatedExercises').each(function () {
        exercise.similar.push(utilityService.extractExercise($(this)))
      })

      await this._downloadTheImages(exercise, $)

      resolve(this.exercises)
    })
  }

  async _downloadTheImages (exercise, $) {
    /*
    * Downloading exercise images
    */
    const images = []
    $('.ExDetail-img').each(function () {
      images.push({
        small: $(this).attr('src'),
        large: $(this).attr('data-large-photo')
      })
    })
    exercise.imageCount = images.length

    for (let i = 0; i < images.length; i++) {
      await utilityService.downloadImage({
        url: images[i].small,
        dest: `${constants.assetsPath}${exercise.category}/${exercise.id}/small_${(i + 1)}.jpg`
      })
      await utilityService.downloadImage({
        url: images[i].large,
        dest: `${constants.assetsPath}${exercise.category}/${exercise.id}/large_${(i + 1)}.jpg`
      })
    }

    /*
    * Downloading category images
    */
    await utilityService.downloadImage({
      url: $('.ExDetail-guide').find('.ExImg').attr('src'),
      dest: `${constants.assetsPath}${exercise.category}/category.jpg`
    })
  }
}

module.exports = new GetExercise()
