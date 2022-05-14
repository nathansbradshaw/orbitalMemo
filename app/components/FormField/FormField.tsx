import type { IFormField }  from './IFormField';
  export function FormField({ htmlFor, label, type = 'text', value, onChange = () => {} }: IFormField) {
    return (
      <>
        <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type}
          id={htmlFor}
          name={htmlFor}
          className="w-full p-2 rounded-xl my-2"
          value={value}
        />
      </>
    )
  }
  