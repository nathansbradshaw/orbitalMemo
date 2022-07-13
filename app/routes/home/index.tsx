// app/routes/home.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { getOtherUsers } from "~/utils/users.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";
import { useLoaderData } from "@remix-run/react";
import { getUncompletedReminders } from "~/utils/reminders.server";
import { ReminderList } from "~/components/ReminderList/ReminderList";

import { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getUncompletedReminders(userId);
  const user = await getUser(request);

  return json({ reminders, userId, user });
};

export default function Home() {
  const { reminders, userId } = useLoaderData();
  const [allReminders, setAllReminders] = useState(reminders);

  return (
    <Layout>
      <Typography variant="h1" className={"m-6 text-center text-grey-200"}>
        Home
      </Typography>

      <div className="flex h-sceen">
        <ReminderList
          reminders={allReminders}
          userId={userId}
          // pastDueReminder={pastDueReminders}
        />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
