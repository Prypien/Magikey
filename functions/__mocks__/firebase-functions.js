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
  onCall: (handler) => handler,
  HttpsError: class HttpsError extends Error {
    constructor(code, message, details) {
      super(message)
      this.code = code
      this.details = details
    }
  },
}

module.exports = {
  logger,
  config,
  firestore,
  https,
  __setConfig,
}
