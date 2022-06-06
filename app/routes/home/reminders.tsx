import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ReminderList } from "~/components/ReminderList/ReminderList";
import { updateUserReminder } from "~/utils/auth.reminder.server";
import { requireUserId } from "~/utils/auth.server";
import { getReminderById, getReminders } from "~/utils/reminders.server";
import { IReminder } from "~/utils/types.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getReminders(userId);
  return json({ reminders, userId });
};

export const action: ActionFunction = async ({ request }) => {
  console.log("action1");
  const userId = await requireUserId(request);
  const form = await request.formData();
  const action = form.get("_action");
  const reminderId = form.get("reminderId");
  if (typeof action !== "string" || typeof reminderId !== "string") {
    console.log("error1", action, reminderId);
    return (
      json(
        {
          error: "Invalid Form Data",
          form: action,
        },
        { status: 400 }
      ),
      redirect("/home")
    );
  }
  const reminder = await getReminderById(reminderId);
  if (!reminder) {
    console.log("error2");

    return (
      json(
        {
          error: "Invalid Form Data",
          form: action,
        },
        { status: 400 }
      ),
      redirect("/home")
    );
  }
  const completedTime = new Date();
  let pastCompletedDate = reminder.pastCompletedDate;
  pastCompletedDate.push(completedTime);
  const updatedReminder: IReminder = {
    ...reminder,
    completed: true,
    pastCompletedDate: pastCompletedDate,
  };

  return await updateUserReminder(userId, updatedReminder), redirect("/home");
};

export default function Reminders() {
  const { reminders } = useLoaderData();
  return <ReminderList reminders={reminders} />;
}
