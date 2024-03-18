interface PropType {
  name: string;
  label: string;
  inputType: string;
  value: string | null;
  onChange: any | null;
}

function InputField({ name, label, inputType, value, onChange }: PropType) {
  return (
    <div className="inputfield__container">
      <input
        className="inputfield__input"
        type={inputType}
        value={value}
        name={name}
        id={name}
        onChange={onChange}
        autoComplete="false"
        required
      />
      <label htmlFor={name} className="inputfield__label">
        {label}
      </label>
    </div>
  );
}

export default InputField;
