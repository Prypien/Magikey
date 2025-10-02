let configData = {}

const logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
}

function config() {
  return configData
}

function __setConfig(value) {
  configData = value
}

const firestore = {
  document: () => ({
    onCreate: (handler) => handler,
  }),
}

const https = {
  onRequest: (handler) => handler,
}

module.exports = {
  logger,
  config,
  firestore,
  https,
  __setConfig,
}
