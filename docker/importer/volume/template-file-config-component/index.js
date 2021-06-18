const fs = require('fs')
const http = require('http')
const path = require('path')

let config = {
  message: 'Default server config',
  port: 7070
}

config = Object.assign(
  config,
  JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))
)

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
  .listen(config.port, () => {
    console.log(`Server running at: http://localhost:${config.port}`)
  })
