// app/routes/login.tsx

import { useRef, useEffect, useState } from "react";
import { Layout } from "~/components/Layout";
import { FormField } from "~/components/FormField/FormField";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";
import { login, register, getUser } from "~/utils/auth.server";
import { useActionData } from "@remix-run/react";
import { backgroundColorMap, colorMap } from "~/utils/constants";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    // console.log("Invalid form data");
    return json(
      {
        error: "Invalid Form Data",
        form: action,
      },
      { status: 400 }
    );
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    // console.log("Invalid form data");

    return json(
      {
        error: "Invalid Form Data",
        form: action,
      },
      { status: 400 }
    );
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };
  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export default function Login() {
  const [action, setAction] = useState("login");
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
  });

  useEffect(() => {
    console.log(actionData);
    if (!firstLoad.current) {
      const newState = {
        email: actionData?.fields?.email || "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [actionData]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className='h-screen justify-center items-center flex flex-col gap-y-4'>
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className={`absolute top-1 right-8 rounded-md font-semibold ${
            (colorMap.PRIMARY_DARK, backgroundColorMap.TEAL)
          } px-3 py-2 transition duration-300 ease-in-out hover:bg-amber-300 hover:-translate-y-1`}
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className='text-5xl font-extrabold text-amber-300'>
          Orbital<span className='text-teal-300'>Memo</span>
        </h2>
        <p className='font-semibold text-slate-300'>
          {action === "login"
            ? "Log In To start creating reminders!"
            : "Sign Up To Get Started!"}
        </p>

        <form method='POST' className='rounded-md bg-gray-200 p-6 w-96'>
          <div className='text-xs font-semibold text-center tracking-wide text-red-500 w-full'>
            {formError}
          </div>
          <FormField
            htmlFor='email'
            label='Email'
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor='password'
            type='password'
            label='Password'
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={errors?.password}
          />
          {action === "register" && (
            <>
              <FormField
                htmlFor='firstName'
                label='First Name'
                onChange={(e) => handleInputChange(e, "firstName")}
                value={formData.firstName}
                error={errors?.firstName}
              />
              <FormField
                htmlFor='lastName'
                label='Last Name'
                onChange={(e) => handleInputChange(e, "lastName")}
                value={formData.lastName}
                error={errors?.lastName}
              />
            </>
          )}
          <div className='w-full text-center'>
            <div className='flex flex-row justify-center'>
              <button
                type='submit'
                name='_action'
                value={action}
                className={`mt-2 rounded-md ${
                  (colorMap.PRIMARY_DARK, backgroundColorMap.TEAL)
                } font-semibold px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-amber-300 hover:-translate-y-1`}
              >
                {action === "login" ? "Sign In" : "Sign Up"}
              </button>
              {formError && (
                <>
                  <button
                    onClick={() => {
                      setAction("register");
                      setFormError("");
                    }}
                    className={`mt-2 rounded-md ${
                      (colorMap.PRIMARY_DARK, backgroundColorMap.TEAL)
                    } font-semibold px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-amber-300 hover:-translate-y-1 ml-2`}
                  >
                    Sign up?
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
