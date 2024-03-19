interface PropType {
  name: string;
  label: string;
  inputType: string;
  value: string;
  onChange: any | null;
  pattern?: string;
  error_msg?: string | null;
}

function InputField({
  name,
  label,
  inputType,
  value,
  onChange,
  pattern,
  error_msg = null,
}: PropType) {
  return (
    <div className="inputfield__outside-container">
      <div className="inputfield__container">
        <input
          className="inputfield__input"
          type={inputType}
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          autoComplete="false"
          pattern={pattern}
          required
        />
        <label htmlFor={name} className="inputfield__label">
          {label}
        </label>
      </div>
      <p className="inputfield__error-message">{error_msg}</p>
    </div>
  );
}

export default InputField;
