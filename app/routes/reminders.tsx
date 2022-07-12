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
      <Card className="m-20 text-center rounded-sm">
        <Typography variant="h1">All Reminders</Typography>
      </Card>
      <div className="flex h-sceen">
        <ReminderList reminders={reminders} userId={userId} />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
