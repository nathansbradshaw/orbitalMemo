//TODO ensure that user is not already logged in before creating a new reminder

import {
  createReminder,
  deleteReminderById,
  getReminderById,
  updateReminder,
} from "./reminders.server";
import { IReminder } from "./types.server";
import { json } from "@remix-run/node";

export async function addReminder(userId: string, reminder: IReminder) {
  if (!userId) {
    return json(
      {
        error: `Unauthorized`,
        fields: { reminder },
      },
      { status: 401 }
    );
  }
  const newReminder = await createReminder(userId, reminder);
  if (!newReminder) {
    return json(
      {
        error: `Something went wrong trying to create a new reminder`,
        fields: { reminder },
      },
      { status: 400 }
    );
  }
  return "/";
}

export async function updateUserReminder(userId: string, reminder: IReminder) {
  if (!userId || reminder.userId !== userId) {
    return json(
      {
        error: `unauthorized`,
        fields: { reminder },
      },
      { status: 401 }
    );
  }
  try {
    await updateReminder(reminder);
  } catch (error) {
    console.log(error);
    return json(
      {
        error: `Something went wrong trying to update the reminder`,
        fields: { reminder },
      },
      { status: 400 }
    );
  }
  return "/";
}

export async function deleteReminder(userId: string, reminderId: string) {
  if (!userId) {
    return json(
      {
        error: `unauthorized`,
        fields: { reminderId },
      },
      { status: 401 }
    );
  }
  if (!reminderId) {
    return json(
      {
        error: `reminderId is required`,
        fields: { reminderId },
      },
      { status: 400 }
    );
  }
  const reminderUserId = await getReminderUserId(reminderId);
  // only delete reminders that belong to the user
  if (reminderUserId !== userId) {
    return json(
      {
        error: `unauthorized`,
        fields: { reminderId },
      },
      { status: 401 }
    );
  }
  await deleteReminderById(reminderId);
  return "/";
}

export async function getReminderUserId(reminderId: string) {
  const reminder = await getReminderById(reminderId);
  if (!reminder) {
    return null;
  }
  return reminder.userId;
}
