let firestoreImpl = () => ({
  collection: () => ({
    doc: () => ({
      delete: async () => {},
    }),
    where: () => ({
      async get() {
        return { empty: true, docs: [] }
      },
    }),
  }),
})

let authImpl = () => ({
  async deleteUser() {},
})

function setFirestoreImpl(impl) {
  firestoreImpl = impl
}

function setAuthImpl(impl) {
  authImpl = impl
}

module.exports = {
  initializeApp: () => {},
  firestore: (...args) => firestoreImpl(...args),
  auth: (...args) => authImpl(...args),
  __setFirestoreImpl: setFirestoreImpl,
  __setAuthImpl: setAuthImpl,
}
