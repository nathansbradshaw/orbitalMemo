//TODO ensure that user is not already logged in before creating a new reminder

import { createReminder } from "./reminders.server";
import { IReminder } from "./types.server";
import { json } from "@remix-run/node";

export async function addReminder(userId: string, reminder: IReminder) {
  //TODO check if user is signed in

  const newReminder = await createReminder(userId, reminder);
  if (!newReminder) {
    return json(
      {
        error: `Something went wrong trying to creatte a new reminder`,
        fields: { reminder },
      },
      { status: 400 }
    );
  }
  return "/";
}
