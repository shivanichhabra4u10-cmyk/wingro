import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    // You can add options here if needed
  },
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || '',
  azure: {
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',
  },
};
