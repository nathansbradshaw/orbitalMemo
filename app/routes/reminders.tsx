// app/routes/reminders.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";

import { useLoaderData, useOutletContext } from "@remix-run/react";

import { getReminders } from "~/utils/reminders.server";
import { ReminderList } from "~/components/ReminderList/ReminderList";
import { Card, Typography } from "@material-tailwind/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getReminders(userId);
  const user = await getUser(request);

  return json({ reminders, userId, user });
};

export default function Reminders() {
  const { reminders, userId } = useLoaderData();

  return (
    <Layout>
      <h1 className="text-5xl font-extrabold text-grey-200 font-sans text-center m-20">
        All Reminders
      </h1>

      <div className="flex h-sceen">
        <ReminderList reminders={reminders} userId={userId} />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
