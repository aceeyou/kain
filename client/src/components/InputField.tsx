interface PropType {
  [key: string]: string;
  id: number;
  name: string;
  label: string;
  errorMessage?: string;
  type: string;
  required?: boolean | undefined;
  title?: string | undefined;
  value: string;
  onChange: any | null | ((e: any) => void | undefined);
  pattern?: string | undefined;
  error_msg?: string | null | undefined;

  handleViewPw?: ((e: any) => void | undefined) | undefined;
  handleOnSubmit?: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined;
}

import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

function InputField(props: PropType) {
  const [focused, setFocused] = useState(false);
  const {
    name,
    label,
    onChange,
    errorMessage,
    value,
    handleViewPw,
    handleOnSubmit,
    ...inputOptions
  } = props;
  return (
    <div className="inputfield__main-container">
      <div className="inputfield__input-container">
        <input
          name={name}
          // placeholder={name}
          className="inputfield__input"
          {...inputOptions}
          onChange={onChange}
          onBlur={() => setFocused(true)}
          onFocus={() =>
            (inputOptions.name === "confirmpw" || "password") &&
            setFocused(true)
          }
          focused={focused.toString()}
          autoComplete="false"
          autoCapitalize={`
          ${name === "fullname" ? "true" : "false"}
          `}
          tabIndex={1}
          onKeyDown={(e) => e.key === "Enter" && handleOnSubmit(e)}
        />
        <label
          htmlFor={name}
          className={`inputfield__label ${value ? "inputHasValue" : ""}`}
        >
          {label}
        </label>
      </div>
      {name === "password" && (
        <button
          type="button"
          className="password__view-btn"
          onClick={handleViewPw}
          tabIndex={1}
        >
          {props.type === "password" ? (
            <PiEyeClosed size={20} />
          ) : (
            <PiEye size={20} />
          )}
        </button>
      )}
      {value.length > 0 && (
        <p className="inputfield__error-message">{errorMessage}</p>
      )}
    </div>
  );
}

export default InputField;
