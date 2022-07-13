// app/routes/addReminder.tsx

import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { FormField } from "~/components/FormField/FormField";
import { Layout } from "~/components/Layout";
import { addReminder } from "~/utils/auth.reminder.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { backgroundColorMap, colorMap } from "~/utils/constants";
import { IReminder } from "~/utils/types.server";
import { validateName } from "~/utils/validators.server";

import { safeParseInt } from "~/utils/utils";
import { getReminderById } from "~/utils/reminders.server";
import { IContextType } from "~/root";
import Pusher from "pusher-js";
import { Card, Input } from "@material-tailwind/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);

  if (typeof userId !== "string") {
    return redirect("/home");
  }
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;
  return { cluster, user };
};

export const pusherEventHandler = async (
  reminder: IReminder,
  userId: string,
  pusher: Pusher
) => {
  const channel = pusher.subscribe(`reminder-${userId}`);
  channel.trigger("new-reminder", {
    reminder: reminder,
  });
};

export const action: ActionFunction = async ({ request }) => {
  // Authenticate user
  const userId = await requireUserId(request);
  if (typeof userId !== "string") {
    return redirect("/home");
  }
  // Get form data
  const form = await request.formData();
  console.log("form data", form);
  const action = form.get("_action");
  const title = form.get("title");
  const description = form.get("description");
  const dueDate = form.get("dueDate");
  const reminderTime = form.get("reminderTime");
  const frequency = form.get("frequency");
  const sendReminderAt = form.get("sendReminderAt");
  const repeatFreq = form.get("repeatFreq");
  const priority = form.get("priority");
  // Validate form data
  if (
    typeof action !== "string" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof dueDate !== "string" ||
    typeof reminderTime !== "string" ||
    typeof frequency !== "string" ||
    typeof priority !== "string"
    // typeof priority !== "string"
  ) {
    return json(
      {
        error: "Invalid Form Data",
        form: action,
      },
      { status: 400 }
    );
  }

  const parsedDate = Date.parse(dueDate + " " + reminderTime);
  console.log("parsedDate", parsedDate);
  console.log("dueDate", new Date(parsedDate));
  console.log("original", dueDate, reminderTime);
  const errors = {
    title: validateName((title as string) || ""),
    description: validateName((description as string) || ""),
    frequency: validateName((frequency as string) || ""),
    reminderTime: validateName((reminderTime as string) || ""),
    dueDate: validateName((dueDate as string) || ""),
    priority: validateName((priority as string) || ""),
  };
  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: {
          title,
          description,
          frequency,
          reminderTime,
          dueDate,
          priority,
        },
        form: action,
      },
      { status: 400 }
    );
  }
  const freq = safeParseInt(frequency);
  const pri = safeParseInt(priority);
  if (
    freq === undefined ||
    freq === null ||
    pri === undefined ||
    pri === null
  ) {
    return json(
      {
        errors,
        fields: { frequency, priority },
        form: action,
      },
      { status: 400 }
    );
  }

  // Create reminder
  const reminder: IReminder = {
    title: title,
    description: description,
    dueDate: new Date(parsedDate),
    sendReminderAt: new Date(parsedDate),
    completed: false,
    repeatFreq: freq,
    priority: pri,
  };
  return (await addReminder(userId, reminder)) ? redirect("/") : null;
};

export default function Reminder() {
  const actionData = useActionData();
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
    reminderTime: actionData?.fields?.reminderTime || "",
    description: actionData?.fields?.description || "",
    dueDate: actionData?.fields?.dueDate || "",
    time: actionData?.fields?.time || "",
    frequency: actionData?.fields?.time || 0,
    priority: actionData?.fields?.priority || 0,
  });

  const today = new Date().toLocaleDateString("en-CA");
  useEffect(() => {}, [actionData]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    // console.log(event.target.value);
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  const isPresent = (date: Date) => {
    if (date >= new Date()) return date;
  };
  return (
    <Layout>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
      />

      <div
        className={`h-screen justify-center items-center flex flex-col gap-y-4 ${backgroundColorMap.SECONDARY_GRADIANT}`}
      >
        <Card className="rounded-md bg-gray-200 p-6 w-200">
          <h1 className="text-5xl font-extrabold text-slate-900">
            Add Reminder
          </h1>
          <form method="POST">
            <FormField
              htmlFor="title"
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange(e, "title")}
              error={errors?.title}
              maxlength={100}
            />
            <FormField
              htmlFor="description"
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange(e, "description")}
              error={errors?.description}
              formType="textarea"
            />
            <FormField
              htmlFor="dueDate"
              label="Due Date"
              type="date"
              min={today}
              max="2034-12-31"
              value={formData.dueDate}
              onChange={(e) => handleInputChange(e, "dueDate")}
              error={errors?.description}
            />
            <FormField
              htmlFor="reminderTime"
              label="Time"
              type="time"
              value={formData.reminderTime}
              onChange={(e) => handleInputChange(e, "reminderTime")}
              error={errors?.reminderTime}
            />

            <label className={`font-semibold ${colorMap.PRIMARY_DARK}`}>
              Repeat Frequency
            </label>
            <select
              name="frequency"
              className="w-full p-2 rounded-md my-2 border border-grey-400 bg-grey-100"
              value={formData.frequency}
              onChange={(e) => handleInputChange(e, "frequency")}
            >
              <option value={0}>None</option>
              <option value={10}>Daily</option>
              {/* <option value={12}>Week Days</option>
              <option value={24}>Weekends</option> */}
              <option value={20}>Weekly</option>
              <option value={30}>Monthly</option>
              <option value={40}>Yearly</option>
            </select>

            <label className={`font-semibold ${colorMap.PRIMARY_DARK}`}>
              Priority
            </label>
            <select
              name="priority"
              className="w-full p-2 rounded-md my-2 border border-grey-400 bg-grey-100"
              value={formData.priority}
              onChange={(e) => handleInputChange(e, "priority")}
            >
              <option value={0}>None</option>
              <option value={1}>Low</option>
              <option value={10}>High</option>
            </select>
            <button
              type="submit"
              name="_action"
              value={"reminder"}
              className="rounded-md bg-teal-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              set new reminder
            </button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
