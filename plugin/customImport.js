import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'

import { newlinePattern } from './constants'

const walk = function(dir, targetFilename) {
  let results = []
  const list = readdirSync(dir)
  list.forEach(function(file) {
    file = path.join(dir, file)
    const stat = statSync(file)
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file, targetFilename))
    } else if (path.parse(file).name === targetFilename) {
      /* Is a file */
      results.push(file)
    }
  })
  return results
}

export function getFilepaths(src, relFile, resolve) {
  const imports = src.split(newlinePattern).filter(line => line.startsWith('#import'))
  return imports.map(statement => {
    if (statement.startsWith('#importu')) {
      const filename = statement.split(/[\s\n]+/g)[1]
      const importPath = walk('.', filename)[0]
      return resolve(importPath, '.')
    } else {
      const importPath = statement.split(/[\s\n]+/g)[1].slice(1, -1)
      return resolve(importPath, relFile)
    }
  })
}

export function getSources(filepath, resolve, acc = []) {
  const importSrc = readFileSync(filepath.replace(/'/g, '')).toString()
  const nestedPaths = getFilepaths(importSrc, filepath, resolve)
  const srcs =
    nestedPaths.length > 0
      ? [
          ...nestedPaths.reduce((srcArr, fp) => [...srcArr, ...getSources(fp, resolve, [])], []),
          importSrc
        ]
      : [importSrc]
  return [...srcs, ...acc]
}
