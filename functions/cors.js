const useStub = process.env.MAGIKEY_USE_FUNCTIONS_STUB === 'true'

const corsModule = useStub ? require('./__mocks__/cors') : require('cors')

module.exports = corsModule
