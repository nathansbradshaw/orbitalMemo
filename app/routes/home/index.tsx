// app/routes/home.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { getOtherUsers } from "~/utils/users.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";
import { Menu } from "~/components/menu";
import { useLoaderData } from "@remix-run/react";
import Pusher from "pusher-js";
import { getReminders } from "~/utils/reminders.server";
import { ReminderList } from "~/components/ReminderList/ReminderList";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const reminders = await getReminders(userId);
  const user = await getUser(request);
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;

  return json({ reminders, userId, user, appkey, cluster });
};

export const pusherEventHandler = async (
  appkey: string,
  cluster: any,
  userId: any
) => {
  const pusher = new Pusher(appkey, {
    cluster: cluster,
  });

  const channel = pusher.subscribe(`reminder-${userId}`);
  channel.bind("overdue", function (newMessage: any) {
    // find id of element to update

    // update element

    console.log(newMessage);
    return newMessage;
  });
};
export default function Home() {
  const { reminders, userId, appkey, cluster, user } = useLoaderData();
  // const pastDueReminders = pusherEventHandler(appkey, cluster, userId);

  return (
    <Layout>
      <div className='flex h-sceen'>
        {/* <Menu user={user} /> */}
        <ReminderList
          reminders={reminders}
          // pastDueReminder={pastDueReminders}
        />
        <div className='flex-1'></div>
      </div>
    </Layout>
  );
}
