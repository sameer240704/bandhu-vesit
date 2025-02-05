"use server";

import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongo.db";

export async function createUser(user: any) {
  try {
    await connect();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
