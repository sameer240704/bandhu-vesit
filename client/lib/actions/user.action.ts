"use server";

import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongo.db";
import { UserType } from "@/types/user";

export async function createUser(user: UserType) {
  try {
    await connect();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
