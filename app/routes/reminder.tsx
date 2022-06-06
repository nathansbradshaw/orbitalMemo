// app/routes/reminder.tsx

import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FormField } from "~/components/FormField/FormField";
import { Layout } from "~/components/Layout";
import { addReminder } from "~/utils/auth.reminder.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { backgroundColorMap } from "~/utils/constants";
import { IReminder } from "~/utils/types.server";
import { validateName } from "~/utils/validators.server";
import Pusher from "pusher-js";

export const loader: LoaderFunction = async ({ request }) => {
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;

  return json({ cluster });
};

export const pusherEventHandler = async (
  appkey: string,
  cluster: any,
  userId: any,
  reminder: IReminder
) => {
  const pusher = new Pusher(appkey, {
    cluster: cluster,
  });

  const channel = pusher.subscribe(`reminder-${userId}`);
  channel.trigger("new-reminder", {
    reminder: reminder,
  });
};

export const action: ActionFunction = async ({ request }) => {
  console.log("action");
  const userId = await requireUserId(request);
  const form = await request.formData();
  const action = form.get("_action");
  const title = form.get("title");
  const description = form.get("description");
  const dueDate = form.get("dueDate");
  const sendReminderAt = form.get("sendReminderAt");
  const repeatFreq = form.get("repeatFreq");
  const priority = form.get("priority");

  if (
    typeof action !== "string" ||
    typeof title !== "string" ||
    typeof description !== "string"
    // typeof dueDate !== "string" ||
    // typeof sendReminderAt !== "string" ||
    // typeof repeatFreq !== "string" ||
    // typeof priority !== "string"
  ) {
    console.log("Invalid form data");
    return json(
      {
        error: "Invalid Form Data",
        form: action,
      },
      { status: 400 }
    );
  }

  const errors = {
    title: validateName((title as string) || ""),
    description: validateName((description as string) || ""),
  };
  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { title, description },
        form: action,
      },
      { status: 400 }
    );
  }

  const reminder: IReminder = {
    title: title,
    description: description,
    dueDate: new Date(Date.now() + 5 * 60 * 1000),
    sendReminderAt: new Date(Date.now() + 5 * 60 * 1000),
    completed: false,
    repeatFreq: 0,
    priority: 0,
  };

  return (await addReminder(userId, reminder)) ? redirect("/") : null;
};

export default function Reminder() {
  const actionData = useActionData();
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
    description: actionData?.fields?.description || "",
  });

  useEffect(() => {}, [actionData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  return (
    <Layout>
      <div
        className={`h-full justify-center items-center flex flex-col gap-y-4 ${backgroundColorMap.SECONDARY_GRADIANT}`}
      >
        <div className="rounded-md bg-gray-200 p-6 w-96">
          <h1 className="text-5xl font-extrabold text-slate-900">Reminder</h1>
          <form method="POST">
            <FormField
              htmlFor="title"
              label="title"
              value={formData.title}
              onChange={(e) => handleInputChange(e, "title")}
              error={errors?.title}
            />
            <FormField
              htmlFor="description"
              label="description"
              value={formData.description}
              onChange={(e) => handleInputChange(e, "description")}
              error={errors?.description}
            />
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
      </div>
    </Layout>
  );
}
