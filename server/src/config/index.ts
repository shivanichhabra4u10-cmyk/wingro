export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  database: {
    // PostgreSQL config (legacy)
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'wingrox_db'
  },  mongodb: {
    uri: 'mongodb://localhost:27017/wingrox_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  azure: {
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
  }
};
