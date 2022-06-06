import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { getUser } from "~/utils/auth.server";
import { getReminderById } from "~/utils/reminders.server";

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
  const { user, reminder } = useLoaderData();
  return (
    <Layout>
      <div className="p-8 h-full w-full text-slate-50">
        <div className="w-full p-8 border-solid border-teal-600 border-4 my-3 ">
          <h1 className=" text-5xl">{reminder.title}</h1>
        </div>
        <div className="container p-8 border-solid border-teal-600 border-4 w-full rounded-lg h-full">
          <p>{reminder.description}</p>
        </div>
      </div>
    </Layout>
  );
}
