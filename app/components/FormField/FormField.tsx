import type { IFormField } from "./IFormField";
import { useState, useEffect } from "react";
import { colorMap } from "~/utils/constants";

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
  error = "",
}: IFormField) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`font-semibold ${colorMap.PRIMARY_DARK}`}
      >
        {label}
      </label>
      <input
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-md my-2 hover:shadow-lg focus:shadow-lg  transition duration-300 ease-in-out hover:-translate-y-1 focus:-translate-y-1"
        value={value}
      />
      <div
        className={`text-s font-semibold text-center tracking-wide w-full ${colorMap.RED}`}
      >
        {errorText || " "}
      </div>
    </>
  );
}
