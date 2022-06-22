import { ActionFunction, json, redirect } from "@remix-run/node";
import {
  deleteUserAndSession,
  getUser,
  requireUserId,
} from "~/utils/auth.server";
import { deleteUser } from "~/utils/users.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const form = await request.formData();
  const action = form.get("_action");

  if (!userId || !user) {
    return (
      json(
        {
          error: "forbidden",
          form: action,
        },
        { status: 403 }
      ),
      redirect("/home")
    );
  }

  if (typeof action !== "string") {
    return (
      json(
        {
          error: "Invalid Form Data",
          form: action,
        },
        { status: 400 }
      ),
      redirect("/home")
    );
  }

  if (action === "delete") {
    return await deleteUserAndSession(request);
  }
  return redirect(`/home/user/${user.profile.firstName}/${userId}`);
};
