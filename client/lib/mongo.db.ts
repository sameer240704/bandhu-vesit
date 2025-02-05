/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
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
      connectTimeoutMS: 30000,
    });

  cached.conn = await cached.promise;
};
