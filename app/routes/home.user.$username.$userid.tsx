import { LoaderFunction, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FormField } from "~/components/FormField/FormField";
import { Layout } from "~/components/Layout";
import { getUser, requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const userId = await requireUserId(request);

  if (!user) {
    return redirect("/home");
  }
  return { user, userId };
};

export default function UserPage() {
  const { user } = useLoaderData();
  const actionData = useActionData();
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    console.log("vall");
    console.log(event.target.value);
    if (event.target.value === user.id) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  return (
    <Layout>
      <div className="p-8 h-full w-full text-slate-50">
        <div className="w-full p-8 border-solid border-teal-600 border-4 my-3 ">
          <h1 className=" text-5xl">Hello {user.profile.firstName}</h1>
        </div>
        <div className="container p-8 border-solid border-teal-600 border-4 w-full rounded-md h-full ">
          <form
            action={`/home/accountServices?${user.id}`}
            method="POST"
            className="bg-gray-200 text-gray-900 "
          >
            <FormField
              htmlFor="title"
              label={`Type in your user id: "${user.id}" to enable the delete button`}
              value={formData.title}
              onChange={(e) => handleInputChange(e, "title")}
              //   error={errors?.title}
            />
            <input type="hidden" name="reminderId" value={user.id} />
            <button
              type="submit"
              name="_action"
              value={"delete"}
              className={`rounded-md ${
                showDelete ? "bg-red-400" : "bg-gray-600"
              } text-slate-900 p-6 h-full`}
              disabled={!showDelete}
            >
              Delete Account
            </button>
          </form>

          <form action={`/addReminder?`} method="POST">
            <input type="hidden" name="reminderId" value={user.id} />
            <button
              type="submit"
              name="_action"
              value={"edit"}
              className="rounded-md bg-teal-500 text-slate-900 p-6 h-full "
            >
              Edit Reminder
            </button>
          </form>
        </div>
        <div className="container p-8 border-solid border-teal-600 border-4 w-full rounded-md h-full">
          <p>{}</p>
        </div>
        <div className="container p-8 border-solid border-teal-600 border-4 w-full rounded-md h-full">
          <p>{}</p>
        </div>
      </div>
    </Layout>
    // TODO: add delete user option
    // TODO: add
  );
}
