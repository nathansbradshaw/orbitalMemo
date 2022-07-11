import { colors } from "@material-tailwind/react/types/generic";

export interface IFormField {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
  maxlength?: number;
  formType?: "input" | "textarea";
  min?: number | string;
  max?: number | string;
  color?: colors;
  className?: string;
}
