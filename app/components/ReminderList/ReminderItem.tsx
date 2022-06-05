import { IReminder } from "~/utils/types.server";

export function ReminderItem({ Reminder }: { Reminder: IReminder }) {
  return (
    <div className="bg-gray-200 flex flex-col w-full rounded-md p-2">
      <p>{Reminder?.title}</p>
      <p>{Reminder.description}</p>
      <p>{Reminder.dueDate}</p>
      <button>Completed</button>
    </div>
  );
}
