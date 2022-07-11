import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IReminder } from "~/utils/types.server";
import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";

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

  const Color = getColor(Reminder);
  return (
    <>
      {Reminder && (
        <Card
          shadow={true}
          className={`${Color.bg} transition duration-300 ease-in-out hover:-translate-x-10 hover:shadow-lg rounded-md`}
        >
          <div
            className={`bg-slate-900 flex flex-row w-full flex-nowrap justify-between p-2 ${Color.border}
 border-4 transition duration-300 ease-in-out hover:translate-x-10 hover:shadow-lg rounded-sm`}
          >
            <div className="w-full">
              <CardBody>
                <a
                  href={`/home/reminders/${Reminder.id}`}
                  className="text-4xl text-amber-300"
                >
                  {Reminder?.title}
                </a>
              </CardBody>

              <CardFooter divider={true} className="w-full flex">
                <div>
                  <p className="text-amber-400 ">
                    {Reminder.description.length > 600
                      ? Reminder.description.substring(0, 600) + " . . . "
                      : Reminder.description}
                  </p>
                  <p className="text-slate-50">
                    {dueDate.toLocaleDateString("en-US", options)}
                  </p>
                </div>
                <div className="ml-auto">
                  {!Reminder.completed && (
                    <div>
                      <form
                        method="POST"
                        className="h-full "
                        id={Reminder.id}
                        action={`home/reminders?${Reminder.id}`}
                      >
                        <input
                          type="hidden"
                          name="reminderId"
                          value={Reminder.id}
                        />

                        <Button
                          color="cyan"
                          type="submit"
                          name="_action"
                          value={"complete"}
                          className="rounded-md bg-teal-500 text-slate-900 p-6 m-2 h-full min-w-full  "
                        >
                          Done?
                        </Button>
                      </form>
                    </div>
                  )}
                  {Reminder.completed && (
                    <div>
                      <form
                        method="POST"
                        className="h-full "
                        id={Reminder.id}
                        action={`home/reminders?${Reminder.id}`}
                      >
                        <input
                          type="hidden"
                          name="reminderId"
                          value={Reminder.id}
                        />

                        <Button
                          color="cyan"
                          type="submit"
                          name="_action"
                          value={"edit"}
                          className="rounded-md text-slate-900 m-2 p-6 h-full min-w-full "
                        >
                          Edit
                        </Button>

                        <Button
                          color="red"
                          type="submit"
                          name="_action"
                          value={"delete"}
                          className="rounded-md bg-red-500 text-slate-900 m-2 h-full min-w-full "
                        >
                          Delete
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

function getColor(Reminder: IReminder) {
  if (Reminder.completed) {
    return { border: "border-teal-600", bg: "bg-teal-600" };
  }
  const dueDate = new Date(Reminder.dueDate);
  const isPastDue = dueDate < new Date();
  if (isPastDue) {
    return { border: "border-red-600", bg: "bg-red-600" };
  }
  return { border: "border-amber-600", bg: "bg-amber-600" };
}
