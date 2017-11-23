const constants = require('./app/constants.js')
const utilityService = require('./app/services/utilities.js')

const categoriesService = require('./app/services/getCategories.js')
const exercisesService = require('./app/services/getExercises.js')
const detailsService = require('./app/services/getExerciseDetails.js')

class ExercisesParser {
  constructor () {
    this.exercises = {}
  }

  async parse () {
    const categories = await categoriesService.start()
    this.exercises = await exercisesService.start(categories)
    this.exercises = await detailsService.start(this.exercises)

    this._generateDatabaseFiles()
  }

  async _generateDatabaseFiles () {
    const categories = []

    for (let category in this.exercises) {
      await utilityService.writeFile(`${constants.dbPath}${category}.json`, this.exercises[category])

      categories.push({
        name: category,
        exerciseCount: this.exercises[category].length
      })
    }

    utilityService.writeFile(`${constants.dbPath}categories.json`, categories)
    console.log('Database files successfully generated')
  }
}

const parser = new ExercisesParser()
parser.parse()
