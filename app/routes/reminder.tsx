// app/routes/reminder.tsx

import { ActionFunction } from "@remix-run/node";
import { Layout } from "~/components/Layout";
import { addReminder } from "~/utils/auth.reminder.server";
import { IReminder } from "~/utils/types.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");

  const reminder: IReminder = {
    title: "test",
    description: "test",
    dueDate: new Date(Date.now() + 5 * 60 * 1000),
    sendReminderAt: new Date(Date.now() + 5 * 60 * 1000),
    completed: false,
    repeatFreq: 0,
    priority: 0,
  };

  return await addReminder("627ffe29e56564d90ffbc178", reminder);
};

export default function Reminder() {
  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <h1>Reminder</h1>
        <form method="POST">
          <button
            type="submit"
            name="_action"
            value={"reminder"}
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            set new reminder
          </button>
        </form>
      </div>
    </Layout>
  );
}
