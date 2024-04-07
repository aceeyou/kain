// interface PropType {
//   name: string;
//   label: string;
//   inputType: string;
//   value: string;
//   onChange: any | null;
//   pattern?: string;
//   error_msg?: string | null;
// }

import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

function InputField(props: any) {
  const [focused, setFocused] = useState(false);
  const {
    name,
    label,
    onChange,
    errorMessage,
    value,
    handleViewPw,
    ...inputOptions
  } = props;
  return (
    <div className="inputfield__main-container">
      <div className="inputfield__input-container">
        <input
          name={name}
          placeholder={name}
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
            ${
              inputOptions.name === "fullname" &&
              inputOptions.name !== "username"
                ? "true"
                : "false"
            }
          `}
        />
        <label
          htmlFor={name}
          className={`inputfield__label ${value ? "inputHasValue" : ""}`}
        >
          {label}
        </label>
        {name === "password" && (
          <button className="password__view-btn" onClick={handleViewPw}>
            {props.type === "password" ? (
              <PiEyeClosed size={20} />
            ) : (
              <PiEye size={20} />
            )}
          </button>
        )}
      </div>
      <p className="inputfield__error-message">{errorMessage}</p>
    </div>
  );
}

export default InputField;
