// app/components/UserPanel.tsx
import { User } from "@prisma/client";
import { NavLink } from "react-router-dom";
import { backgroundColorMap, colorMap } from "~/utils/constants";

export function Menu({ user }: { user: User }) {
  return (
    <div className="w-1/6 bg-gray-200 flex flex-col ">
      <div className="text-center bg-gray-800 h-20 items-center justify-center ">
        <h2 className={`text-xl ${colorMap.YELLOW} font-semibold`}>
          Orbital<span className="text-teal-300">Memo</span>
        </h2>
        <p className="text-teal-50">{user.profile.firstName}</p>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
        <div className={`text-center`}>
          <div
            className={`transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:shadow-lg rounded-md flex`}
          >
            <NavLink
              className={`transition duration-300 ease-in-out text-slate-900 text-xl  p-6 w-full bg-gray-400 hover:bg-gray-300 focus:bg-gray-300`}
              to="/"
            >
              Home
            </NavLink>
          </div>
          <div
            className={`mt-6 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:shadow-lg rounded-md flex`}
          >
            <NavLink
              className={`transition duration-300 ease-in-out text-slate-900 text-xl  p-6 w-full bg-gray-400 hover:bg-gray-300 focus:bg-gray-300`}
              to="/"
            >
              All Reminders
            </NavLink>
          </div>
          <div
            className={`mt-6    transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:shadow-lg rounded-md flex`}
          >
            <NavLink
              className={`transition duration-300 ease-in-out text-slate-900 text-xl  p-6 w-full bg-gray-400 hover:bg-gray-300 focus:bg-gray-300`}
              to="/reminder"
            >
              New Reminder
            </NavLink>
          </div>
        </div>
      </div>
      <div className="text-center p-6 bg-gray-800">
        <form action="/logout" method="post">
          <button
            type="submit"
            className={`rounded-md ${
              (colorMap.PRIMARY_DARK, backgroundColorMap.TEAL)
            } font-semibold px-3 py-2 transition duration-300 ease-in-out hover:bg-teal-300 hover:-translate-y-1 hover:shadow-lg focus:shadow-lg`}
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
