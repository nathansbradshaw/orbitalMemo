import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IReminder } from "~/utils/types.server";

export function ReminderItem({ Reminder }: { Reminder: IReminder }) {
  const actionData = useActionData();
  useEffect(() => {}, [actionData]);
  const dueDate = new Date(Reminder.dueDate);
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const borderColor = getBorderColor(Reminder);
  return (
    <>
      {Reminder && (
        <div
          className={`bg-slate-900 flex flex-row w-full justify-between rounded-lg p-2
    border-solid ${borderColor} border-4 transition duration-300 ease-in-out hover:-translate-x-2 hover:shadow-lg`}
        >
          <div>
            <a
              href={`/home/reminders/${Reminder.id}`}
              className="text-4xl text-amber-300"
            >
              {Reminder?.title}
            </a>
            <p className="text-amber-400">{Reminder.description}</p>
            <p className="text-slate-50">
              {dueDate.toLocaleDateString("en-US", options)}
            </p>
          </div>
          <div>
            {/* <button className="rounded-md bg-amber-500 text-slate-900 p-6 h-full mx-6">
          View
        </button> */}
            <div className="h-full ">
              {!Reminder.completed && (
                <form
                  method="POST"
                  className="h-full "
                  id={Reminder.id}
                  action={`home/reminders?${Reminder.id}`}
                >
                  <input type="hidden" name="reminderId" value={Reminder.id} />
                  <button
                    type="submit"
                    name="_action"
                    value={"complete"}
                    className="rounded-md bg-teal-500 text-slate-900 p-6 h-full "
                  >
                    Done?
                  </button>
                </form>
              )}
              {Reminder.completed && (
                <form
                  method="POST"
                  className="h-full "
                  id={Reminder.id}
                  action={`home/reminders?${Reminder.id}`}
                >
                  <input type="hidden" name="reminderId" value={Reminder.id} />
                  <button
                    type="submit"
                    name="_action"
                    value={"delete"}
                    className="rounded-md bg-red-500 text-slate-900 p-6 h-full "
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
}

function getBorderColor(Reminder: IReminder) {
  if (Reminder.completed) {
    return "border-teal-600";
  }
  const dueDate = new Date(Reminder.dueDate);
  const isPastDue = dueDate < new Date();
  if (isPastDue) {
    return "border-red-600";
  }
  return "border-amber-600";
}
