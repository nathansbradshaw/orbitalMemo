// app/routes/reminders.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { getOtherUsers } from "~/utils/users.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";
import { Menu } from "~/components/menu";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import Pusher from "pusher-js";
import { getReminders } from "~/utils/reminders.server";
import { ReminderList } from "~/components/ReminderList/ReminderList";
import { useEffect, useState } from "react";
import { IContextType } from "~/root";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getReminders(userId);
  const user = await getUser(request);
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;

  return json({ reminders, userId, user, appkey, cluster });
};

export default function Reminders() {
  const { reminders, userId, appkey, cluster, user } = useLoaderData();
  const [allReminders, setAllReminders] = useState(reminders);
  const { pusher } = useOutletContext<IContextType>();
  useEffect(() => {
    if (pusher) {
      // const message = pusherEventHandler(appkey, cluster, userId);
      const channel = pusher.subscribe(`reminder-${userId}`);
      channel.bind("overdue", function (newMessage: any) {
        // find id of element to update
        const { reminder } = newMessage;
        const newReminders = [...allReminders];
        newReminders.forEach((rem) => {
          if (rem.id === reminder.id) {
            rem.completed = true;
          }
        });
        setAllReminders(newReminders);
        return newMessage;
      });
      setAllReminders(reminders);
    }
  }, [allReminders]);
  // const pastDueReminders = pusherEventHandler(appkey, cluster, userId);

  return (
    <Layout>
      <div className="flex h-sceen">
        {/* <Menu user={user} /> */}
        <ReminderList
          reminders={reminders}
          // pastDueReminder={pastDueReminders}
        />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
