import { readdir, stat as _stat } from 'fs'
import { resolve } from 'path'

export default function listdir (dir, done) {
  var results = []

  readdir(dir, function (err, list) {
    if (err) {
      return done(err)
    }

    var pending = list.length

    if (!pending) {
      return done(null, results)
    }

    list.forEach(function (file) {
      file = resolve(dir, file)
      _stat(file, function (err, stat) {
        if (err) {
          done(err)
        }

        if (stat && stat.isDirectory()) {
          listdir(file, function (err, res) {
            if (err) {
              done(err)
            }

            results = results.concat(res)
            if (!--pending) {
              done(null, results)
            }
          })
        } else {
          results.push(file)
          if (!--pending) {
            done(null, results)
          }
        }
      })
    })
  })
}
