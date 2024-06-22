import mongoose from 'mongoose';

const mongoDBConnectionURL = process.env.MONGO_DB_CONNECTION_URL;

console.log('MONGO_DB_CONNECTION_URL:', mongoDBConnectionURL);

async function ConnectDB() {
  try {
    const res = await mongoose.connect(mongoDBConnectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

export { ConnectDB };
