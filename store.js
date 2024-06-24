async function createStore() {
  const { default: Store } = await import('electron-store')

  const schema = {
    passwords: {
      type: 'array',
      items: {
        type: 'string',
      },
      default: [],
    },
  }

  return new Store({ schema })
}

module.exports = createStore
