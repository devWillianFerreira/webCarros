/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface inputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

const Input = ({
  type,
  name,
  placeholder,
  register,
  error,
  rules,
}: inputProps) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border-1 mb-3 border-gray-200 h-11 px-2"
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
