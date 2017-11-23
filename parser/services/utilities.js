const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const download = require('image-downloader')
const mkdirp = require('mkdirp')

class Utilities {
  scrapUrl (url) {
    return new Promise((resolve, reject) => {
      request({
        url: url,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }, (err, response, html) => {
        if (err) {
          reject(err)
        }

        const $ = cheerio.load(html)
        resolve($)
      })
    })
  }

  downloadImage (options) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(options.dest)) {
        const path = options.dest.substring(0, options.dest.lastIndexOf('/'))
        mkdirp(path, err => {
          if (err) {
            reject(err)
          }

          options.headers = { 'User-Agent': 'Mozilla/5.0' }
          download.image(options).then(resp => {
            resolve(resp)
          }).catch(err => {
            reject(err)
          })
        })
      } else {
        resolve('File already exist')
      }
    })
  }

  writeFile (dest, content) {
    return new Promise((resolve, reject) => {
      const path = dest.substring(0, dest.lastIndexOf('/'))
      mkdirp(path, err => {
        if (err) {
          reject(err)
        }

        if (typeof content !== 'string') {
          content = JSON.stringify(content)
        }
        fs.writeFile(dest, content, 'utf8', writeErr => {
          if (writeErr) {
            reject(writeErr)
          }

          resolve(dest)
        })
      })
    })
  }

  extractExercise (element) {
    return {
      id: element.find('.ExResult-resultsHeading').children('a').attr('href').replace('/exercises/', ''),
      name: element.find('.ExResult-resultsHeading').text().trim(),
      category: element.find('.ExResult-muscleTargeted').children('a').text().trim(),
      equipment: element.find('.ExResult-equipmentType').children('a').text().trim()
    }
  }
}

module.exports = new Utilities()
