import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = (global).mongoose;

if (!cached) {
  cached = (global).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connect = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGO_URI, {
      dbName: "MindPlay",
      bufferCommands: false,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
    });

  cached.conn = await cached.promise;
};
