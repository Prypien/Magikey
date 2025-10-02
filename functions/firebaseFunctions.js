const useStub = process.env.MAGIKEY_USE_FUNCTIONS_STUB === 'true'

const functionsModule = useStub
  ? require('./__mocks__/firebase-functions')
  : require('firebase-functions')

module.exports = functionsModule
