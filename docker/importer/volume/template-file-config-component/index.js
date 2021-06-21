const fs = require('fs')
const http = require('http')
const path = require('path')

let config = {
  message: 'Default server config'
}

try {
  config = Object.assign(
    config,
    JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))
  )
} catch (e) {
  console.error(`Failed to read config file - using default config.\n${e}\n\n`)
}

http
  .createServer((request, response) => {
    request
      .on('data', chunk => {
        console.log(`Chunk data! ${chunk}`)
      })
      .on('end', () => {
        response.end(Buffer.from(config.message))
      })
  })
  .listen(9090, () => {
    console.log(`Server running at: http://localhost:9090`)
  })
