import { Button, Card, Typography } from "@material-tailwind/react";
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
        <Card>
          <div className="w-full p-8 my-3 ">
            <h1 className=" text-5xl">
              Hello {user.profile.firstName} {user.profile.lastName}
            </h1>
          </div>
          <div className="container p-8   "></div>
        </Card>
        <Card className="my-8 p-6">
          <Typography>Current Email: {user.contact}</Typography>
          <form
            action={`/home/accountServices?${user.id}`}
            method="POST"
            className="bg-gray-200 text-gray-900 w-full flex flex-wrap"
          >
            <FormField
              htmlFor="email"
              label="New Email"
              // value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="w-5/6"
            />
            <input type="hidden" name="reminderId" value={user.id} />
            <Button
              type="submit"
              name="_action"
              value={"change_contact"}
              className={`rounded-md mx-3 ${
                showDelete ? "bg-red-400" : "bg-gray-600"
              } text-slate-900 p-6 `}
              disabled={!showDelete}
              color={showDelete ? "blue" : "blue"}
            >
              Change Email
            </Button>
          </form>
        </Card>
        <Card className="my-8 p-6">
          <Typography>Danger Zone</Typography>
          <form
            action={`/home/accountServices?${user.id}`}
            method="POST"
            className="bg-gray-200 text-gray-900 w-full flex flex-wrap"
          >
            <FormField
              htmlFor="title"
              label={`Type in your user id: "${user.id}" to enable the delete button`}
              value={formData.title}
              onChange={(e) => handleInputChange(e, "title")}
              color="red"
              className="w-5/6"
              //   error={errors?.title}
            />
            <input type="hidden" name="reminderId" value={user.id} />
            <Button
              type="submit"
              name="_action"
              value={"delete"}
              className={`rounded-md mx-3 ${
                showDelete ? "bg-red-400" : "bg-gray-600"
              } text-slate-900 p-6 `}
              disabled={!showDelete}
              color={showDelete ? "red" : "grey"}
            >
              Delete Account
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
    // TODO: add delete user option
    // TODO: add
  );
}
