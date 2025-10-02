const useStub = process.env.MAGIKEY_USE_FUNCTIONS_STUB === 'true'

const adminModule = useStub
  ? require('./__mocks__/firebase-admin')
  : require('firebase-admin')

module.exports = adminModule
