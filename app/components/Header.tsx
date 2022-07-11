import { NavLink, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { colorMap } from "~/utils/constants";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { json, LoaderFunction } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Button } from "@material-tailwind/react";
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  console.log(user);
  // const user = null;

  return json(user);
};

export default function Navbar() {
  const { user } = useLoaderData() || {};
  // console.log(user);
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-slate-700 ">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <NavLink
              to="/"
              className={`text-xl ${colorMap.YELLOW} font-semibold hover:shadow-lg focus:shadow-lg  transition duration-300 ease-in-out hover:-translate-y-1 focus:-translate-y-1 rounded-md`}
            >
              Orbital<span className="text-teal-300 uppercase ">Memo</span>
            </NavLink>
            <button
              className="text-white cursor-pointer text-2xl leading-none px-3 py-1 border border-solid
               border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              {navbarOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
            </button>
          </div>
          <div
            className={`lg:flex flex-grow items-center
              ${navbarOpen ? "flex" : "hidden"}`}
          >
            {user ? (
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="nav-item">
                  <NavLink
                    className=" hover:shadow-lg focus:shadow-lg  transition duration-300 ease-in-out hover:-translate-y-1 focus:-translate-y-1 rounded-md
                                     px-3 py-2 flex items-center text-xl uppercase font-bold leading-snug text-white"
                    to={`/home/user/${user.profile.firstName}/${user.id}`}
                  >
                    <i className="fab fa-facebook-square text-lg leading-lg text-white"></i>
                    <span className="ml-2 text-teal-300">
                      -{user.profile.firstName}-
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className=" hover:shadow-lg focus:shadow-lg  transition duration-300 ease-in-out hover:-translate-y-1 focus:-translate-y-1 rounded-md
                                    px-3 py-2 flex items-center text-xl uppercase font-bold leading-snug text-white "
                    to="/reminders"
                  >
                    <i className="fab fa-twitter text-lg leading-lg text-white"></i>
                    <span className="ml-2">Reminders</span>
                  </NavLink>
                </li>
                <li className="nav-item hover:shadow-lg focus:shadow-lg  transition duration-300 ease-in-out hover:-translate-y-1 focus:-translate-y-1 rounded-md">
                  <NavLink
                    className="px-3 py-2 flex items-center text-xl uppercase font-bold leading-snug text-white"
                    to="/addReminder"
                  >
                    <i className="fab fa-pinterest text-lg leading-lg text-white"></i>
                    <span className="ml-2">New Reminder</span>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <form action="/logout" method="post">
                    <Button color="cyan" type="submit">
                      Sign Out
                    </Button>
                  </form>
                </li>
              </ul>
            ) : (
              <> </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
