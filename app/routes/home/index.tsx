// app/routes/home.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { getOtherUsers } from "~/utils/users.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";
import { Menu } from "~/components/menu";
import { useLoaderData, useOutlet, useOutletContext } from "@remix-run/react";
import Pusher from "pusher-js";
import { getUncompletedReminders } from "~/utils/reminders.server";
import { ReminderList } from "~/components/ReminderList/ReminderList";
import { IReminder } from "~/utils/types.server";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getUncompletedReminders(userId);
  const user = await getUser(request);
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;

  return json({ reminders, userId, user, appkey, cluster });
};

// export const pusherEventHandler = async (
//   appkey: string,
//   cluster: any,
//   userId: any
// ) => {
//   const pusher = new Pusher(appkey, {
//     cluster: cluster,
//   });

//   const channel = pusher.subscribe(`reminder-${userId}`);
//   channel.bind("overdue", function (newMessage: any) {
//     // find id of element to update

//     // update element

//     console.log(newMessage);
//     return newMessage;
//   });
// };
export default function Home() {
  const { reminders, userId, appkey, cluster, user } = useLoaderData();

  const [allReminders, setAllReminders] = useState(reminders);
  const { pusher } = useOutletContext<Pusher>();
  useEffect(() => {
    console.log("pusher", pusher);

    if (pusher) {
      console.log("pusher", pusher);
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
        console.log(newReminders);
        setAllReminders(newReminders);
        console.log(allReminders);
        return newMessage;
      });
      setAllReminders(reminders);
    }
  }, [allReminders]);

  return (
    <Layout>
      <div className="flex h-sceen">
        <ReminderList
          reminders={allReminders}
          // pastDueReminder={pastDueReminders}
        />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
