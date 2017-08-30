const fs = require('fs')

const inputFile = process.argv[2]
if (typeof inputFile === 'undefined') {
  console.log('input json file required')
  process.exit(-1)
}

// inputPoints must be an array of 2d points
// points must be arrays [x,y]
// see sample.json for an example input json

let inputPoints = []
try {
  inputPoints = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
} catch (e) {
  console.log('could not parse input file')
  process.exit(-1)
}

const method = process.argv[3]
const methods = ['monte', 'gridlinear']
if (typeof method === 'undefined' || !methods.includes(method)) {
  console.log('must specify method', methods)
  process.exit(-1)
}

// we will search on a grid from 0,0 to 100,100
// this should be changed to be an input

const grid = [
  [-100,-100],
  [100,100]
]

const euclidDistance = (p1, p2) => {
  var a = p1[0] - p2[0]
  var b = p1[0] - p2[1]
  return Math.sqrt( a*a + b*b )
}

const monte = (inputPoints, grid) => {
  console.log('monte carlo')
  let found = false
  let point = []
  let distances = []
  while(!found) {
    const x = Math.random() * grid[1][0] + grid[0][0]
    const y = Math.random() * grid[1][1] + grid[0][1]
    const testPoint = [x, y]
    distances = []
    // Assume this is a good testPoint
    found = true
    point = testPoint
    inputPoints.forEach((point) => {
      const distance = euclidDistance(point, testPoint)
      if (distances.includes(distance)) {
        found = false
      }
      distances.push(distance)
    })
    console.log(testPoint,distances)
  }
  console.log('distances:')
  console.log(distances)
  return point
}

const gridlinear = (inputPoints, grid) => {
  console.log('gridlinear')
  // TODO: refine grid to smaller steps than 1 when all x's and y's fail
  // on the dx = dy = 1 grid
  let found = false
  let point = []
  let distances = []
  let x = grid[0][0]
  let y = grid[0][1]
  let dx = 1
  let dy = 1
  let testPoint = [x,y]
  while ((!found) && (x <= grid[1][0]) && (y <= grid[1][1])) {
    testPoint = [x, y]
    distances = []
    // Assume this is a good testPoint
    found = true
    point = testPoint
    inputPoints.forEach((point) => {
      const distance = euclidDistance(point, testPoint)
      if (distances.includes(distance)) {
        found = false
      }
      distances.push(distance)
    })
    console.log(testPoint,distances)

    if (x === grid[1][0]) {
      // reset grid scan x coordinate, increment y
      x = grid[0][0]
      y = y + dy
    }
    else {
      x = x + dx
    }

  }
  console.log('distances:')
  console.log(distances)
  return point
}

const methodFns = {
  'monte': monte,
  'gridlinear': gridlinear
}

console.log('inputPoints:')
console.log(inputPoints)

console.log('search grid:')
console.log(grid)

const foundPoint = methodFns[method](inputPoints, grid)
console.log('foundPoint:')
console.log(foundPoint)
