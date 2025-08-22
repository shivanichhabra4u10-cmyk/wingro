import mongoose from 'mongoose';
import * as appInsights from 'applicationinsights';
import { config } from '../config';

export const databaseService = {
    async init() {
        // Initialize Application Insights if key is provided
        if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
            appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
                .setAutoDependencyCorrelation(true)
                .setAutoCollectRequests(true)
                .setAutoCollectPerformance(true)
                .setAutoCollectExceptions(true)
                .setAutoCollectDependencies(true)
                .setAutoCollectConsole(true)
                .setUseDiskRetryCaching(true)
                .setSendLiveMetrics(true)
                .start();
        }
        
        // Get MongoDB connection string from environment with fallbacks
        const mongoURI = process.env.MONGODB_URI || config.mongodbUri || 'mongodb://localhost:27017/wingrox_db';
        
        console.log('===== MongoDB Connection Info =====');
        console.log(`Attempting to connect to MongoDB`);
        
        try {
            // Connect to MongoDB with options
            await mongoose.connect(mongoURI, {
              serverSelectionTimeoutMS: 5000,  // Keep trying to connect for 5 seconds
              socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
              family: 4                        // Use IPv4, skip trying IPv6
            });
              console.log('✅ Connected to MongoDB successfully!');
            console.log(`Database: ${mongoose.connection.name}`);
            console.log('===================================');
            
            return mongoose.connection;
        } catch (error: any) {
            console.error('❌ MongoDB connection error:');
            console.error(`Error name: ${error.name}`);
            console.error(`Error message: ${error.message}`);
            
            if (error.name === 'MongoNetworkError') {
                console.error(`\nTROUBLESHOOTING STEPS:`);
                console.error(`1. Is MongoDB running? Try: docker-compose up -d mongodb`);
                console.error(`2. Check your MongoDB connection string in .env file`);
                console.error(`3. For local development, use: mongodb://localhost:27017/wingrox_db`);
                console.error(`4. MongoDB Atlas? Check credentials and network access`);
            }
            
            throw error;
        }
    },

    // Helper function to check connection status
    isConnected() {
        return mongoose.connection.readyState === 1;
    }
};
