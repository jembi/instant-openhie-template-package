const fs = require("fs");
const http = require("http");
const path = require("path");

let config;

try {
  config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "config.json")));
  console.log(`Current config: ${config.message}`);
} catch (e) {
  console.error(`Failed to read config file.\n${e}\n\n`);
}

http
  .createServer((request, response) => {
    request
      .on("data", (chunk) => {
        console.log(`Chunk data! ${chunk}`);
      })
      .on("end", () => {
        response.end(Buffer.from(config.message));
      });
  })
  .listen(9090, () => {
    console.log(`Server running at: http://localhost:9090`);
  });
