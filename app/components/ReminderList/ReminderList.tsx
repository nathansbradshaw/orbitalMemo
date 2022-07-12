import { Button, Card, Typography } from "@material-tailwind/react";
import { Reminder } from "@prisma/client";
import { Link, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IContextType } from "~/root";
import { useIsMounted } from "~/utils/hooks/useIsMounted";
import { ReminderItem } from "./ReminderItem";

export function ReminderList({
  reminders,
  userId,
}: {
  reminders: Reminder[];
  userId: string;
}) {
  const [allReminders, setAllReminders] = useState(reminders);
  const { pusher } = useOutletContext<IContextType>();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (pusher && isMounted.current) {
      const channel = pusher.subscribe(`reminder-${userId}`);
      channel.bind("overdue", function (newMessage: any) {
        const { reminder } = newMessage;
        const newReminders = [...allReminders];
        newReminders.forEach((rem) => {
          if (rem.id === reminder.id) {
            rem.pulse = true;
            toast(`${reminder.title} is overdue!`);
          }
        });
        setAllReminders(newReminders);
        return newMessage;
      });
    }
  }, []);

  useEffect(() => {}, [allReminders]);
  return (
    <div className=" flex flex-col w-full px-6 items-center">
      <div className="flex-1 py-4 flex flex-col gap-y-10 max-w-screen-xl px-6 w-full">
        {allReminders.length ? (
          allReminders?.length &&
          allReminders.map((reminder) => (
            <ReminderItem key={reminder.id} Reminder={reminder} />
          ))
        ) : (
          <Card className="h-full p-10">
            <Typography>No Reminders Found</Typography>

            <Link to="/addReminder" className="w-full">
              <Button className="mt-6 w-full">Create Reminder</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
