import type { IFormField } from "./IFormField";
import { useState, useEffect } from "react";
import { colorMap } from "~/utils/constants";
import { Input, Alert, Textarea } from "@material-tailwind/react";

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
  error = "",
  maxlength,
  formType,
  max,
  min,
  color,
  className = "my-4",
}: IFormField) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <div className={className}>
      {formType === "textarea" ? (
        <>
          <Textarea
            onChange={(e) => {
              onChange(e);
              setErrorText("");
            }}
            variant="outlined"
            label={label}
            id={htmlFor}
            name={htmlFor}
            value={value}
            maxLength={maxlength}
          />
          <Alert show={!!errorText} color="red" className="my-2">
            {errorText || " "}
          </Alert>
        </>
      ) : (
        <>
          <Input
            onChange={(e) => {
              onChange(e);
              setErrorText("");
            }}
            variant="outlined"
            label={label}
            type={type}
            id={htmlFor}
            name={htmlFor}
            value={value}
            maxLength={maxlength}
            max={max}
            min={min}
            color={color}
          />
          <Alert show={!!errorText} color="red" className="my-2">
            {errorText || " "}
          </Alert>
        </>
      )}
    </div>
  );
}
