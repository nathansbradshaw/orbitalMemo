import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { getUser } from "~/utils/auth.server";
import { getReminderById } from "~/utils/reminders.server";
import {
  Card,
  CardHeader,
  Button,
  CardFooter,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/");
  }
  const reminder = await getReminderById(params.reminderId ?? "");
  if (!reminder || reminder.userId !== user.id) {
    //TODO add unathorized error
    return redirect("/");
  }
  return { user, reminder };
};

export default function reminderId() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user, reminder } = useLoaderData();
  const dueDate = new Date(reminder.dueDate);
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <Layout>
      <Card className="p-8 h-full w-auto text-slate-50 m-6">
        <CardHeader
          className=" p-8 border-solid  my-3 text-center"
          color="cyan"
        >
          <h1 className=" text-5xl">{reminder.title}</h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap">
            <div className="text-slate-500 w-4/6 p-2">
              <hr />
              <Typography className="text-center">Description</Typography>

              <Typography>{reminder.description}</Typography>
            </div>
            <div className="text-slate-500 p-2 w-auto">
              <hr />
              <Typography className="text-center">Due Date</Typography>
              <p>{dueDate.toLocaleDateString("en-US", options)}</p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between py-3" divider>
          <form action={`/addReminder?${reminder.id}`} method="POST">
            <input type="hidden" name="reminderId" value={reminder.id} />
            <Button
              type="submit"
              name="_action"
              value={"edit"}
              className="rounded-md bg-teal-500 text-slate-900 p-6 h-full "
            >
              Edit Reminder
            </Button>
          </form>
          <form action={`/home/reminders?${reminder.id}`} method="POST">
            <input type="hidden" name="reminderId" value={reminder.id} />
            <Button
              type="submit"
              name="_action"
              value={"delete"}
              className="rounded-md bg-red-500 text-slate-900 p-6 h-full "
            >
              Delete Reminder
            </Button>
          </form>
        </CardFooter>
      </Card>
    </Layout>
  );
}
