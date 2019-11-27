module.exports = {
  environment: 'development',
  port: 4000,
  api: {
    apollo: {
      endpoints: [
        {
          name: 'customers',
          url: 'http://localhost:4001'
        }
      ]
    }
  }
};