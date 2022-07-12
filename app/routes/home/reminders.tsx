import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ReminderList } from "~/components/ReminderList/ReminderList";
import {
  deleteReminder,
  updateUserReminder,
} from "~/utils/auth.reminder.server";
import { requireUserId } from "~/utils/auth.server";
import {
  deleteReminderById,
  getReminderById,
  getReminders,
} from "~/utils/reminders.server";
import { IReminder } from "~/utils/types.server";

// export const loader: LoaderFunction = async ({ request }) => {
//   const userId = await requireUserId(request);
//   const reminders = await getReminders(userId);
//   return json({ reminders, userId });
// };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const action = form.get("_action");
  const reminderId = form.get("reminderId");
  if (!userId) {
    return (
      json(
        {
          error: "forbidden",
          form: action,
        },
        { status: 403 }
      ),
      redirect("/home")
    );
  }
  if (typeof action !== "string" || typeof reminderId !== "string") {
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
  if (action === "complete") {
    const completedTime = new Date();
    let pastCompletedDate = reminder.pastCompletedDate;
    pastCompletedDate.push(completedTime);
    let updatedReminder: IReminder | undefined;

    switch (reminder.repeatFreq) {
      case 0:
        updatedReminder = {
          ...reminder,
          completed: true,
          pastCompletedDate: pastCompletedDate,
        };
        break;
      case 10: // daily
        updatedReminder = {
          ...reminder,
          dueDate: new Date(reminder.dueDate.getTime() + 24 * 60 * 60 * 1000),
          sendReminderAt: new Date(
            reminder.sendReminderAt.getTime() + 24 * 60 * 60 * 1000
          ),
          completed: false,
          pastCompletedDate: pastCompletedDate,
        };
        break;
      case 20: // weekly
        updatedReminder = {
          ...reminder,
          dueDate: new Date(
            reminder.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000
          ),
          sendReminderAt: new Date(
            reminder.sendReminderAt.getTime() + 7 * 24 * 60 * 60 * 1000
          ),
          completed: false,
          pastCompletedDate: pastCompletedDate,
        };
        break;
      case 30: // monthly
        updatedReminder = {
          ...reminder,
          dueDate: new Date(
            reminder.dueDate.getTime() + 30 * 24 * 60 * 60 * 1000
          ),
          sendReminderAt: new Date(
            reminder.sendReminderAt.getTime() + 30 * 24 * 60 * 60 * 1000
          ),
          completed: false,
          pastCompletedDate: pastCompletedDate,
        };
        break;
      case 40: // yearly
        updatedReminder = {
          ...reminder,
          dueDate: new Date(
            reminder.dueDate.getTime() + 365 * 24 * 60 * 60 * 1000
          ),
          sendReminderAt: new Date(
            reminder.sendReminderAt.getTime() + 365 * 24 * 60 * 60 * 1000
          ),
          completed: false,
          pastCompletedDate: pastCompletedDate,
        };
        break;

      default:
        updatedReminder = {
          ...reminder,
          completed: true,
          pastCompletedDate: pastCompletedDate,
        };
        break;
    }
    return await updateUserReminder(userId, updatedReminder), redirect("/home");
  }
  if (action === "delete") {
    return await deleteReminder(userId, reminderId), redirect("/reminders");
  }
  return redirect("/home");
};

export default function Reminders() {
  // const { reminders } = useLoaderData();
  return <div />;
}
