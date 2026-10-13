import mongoose from 'mongoose';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakeease';
  
  try {
    // Attempt standard connection first with a 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local/specified MongoDB (${uri}): ${err.message}`);
    console.log('🔄 Attempting fallback to embedded in-memory MongoDB server for instant zero-config development...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'bakeease',
        },
      });
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB running & connected at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB fallback:', memErr);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
