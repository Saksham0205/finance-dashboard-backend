export default () => ({
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'financial_dashboard',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpireMinutes: parseInt(process.env.JWT_EXPIRE_MINUTES || '60', 10),
});
