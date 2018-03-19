
const dbConfig = {
  development: {
    connection: 'localhost:27017/branchtasks'
  },
  production: {
    connection: 'localhost:27017/branchtasks'
  }
};



export default (process.env.NODE_ENV == 'development') ? dbConfig.development : dbConfig.production;