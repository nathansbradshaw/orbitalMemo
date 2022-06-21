import { Reminder } from "@prisma/client";
import { ReminderItem } from "./ReminderItem";

export function ReminderList({
  reminders,
  pastDueReminder,
}: {
  reminders: Reminder[];
  pastDueReminder?: Reminder | Reminder[];
}) {
  //   console.log("New past due reminder", pastDueReminder);
  return (
    <div className=" flex flex-col w-full px-6 items-center">
      <div className="flex-1 py-4 flex flex-col gap-y-10 max-w-screen-xl px-6 w-full">
        {reminders?.length &&
          reminders.map((reminder) => (
            <ReminderItem key={reminder.id} Reminder={reminder} />
          ))}
      </div>
    </div>
  );
}
