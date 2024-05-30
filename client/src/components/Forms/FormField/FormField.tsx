import * as Form from "@radix-ui/react-form";
import "./FormField.css";
import { TextArea } from "@radix-ui/themes";
import { IoMdClose } from "react-icons/io";

interface FieldProps {
  name: string;
  label: string;
  message?: string | null;
  as?: string | "input";
  placeholder?: string;
  inputType: string;
  value?: string;
  isTaken?: boolean | null;
  onChange: (name: string, newData: string) => void;
}

function FormField({
  name,
  label,
  message,
  as = "input",
  inputType,
  value,
  isTaken,
  onChange,
}: FieldProps) {
  return (
    <Form.Field
      name={name}
      className={`edit__form-field ${isTaken && "edit__form-invalid"}`}
    >
      <Form.Label htmlFor={name} className="edit__form-label">
        {label}
      </Form.Label>
      <Form.Control asChild>
        {as === "input" ? (
          <input
            className="edit__form-input"
            type={inputType}
            name={name}
            id={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : (
          as === "textarea" && (
            <TextArea
              name={name}
              variant="classic"
              placeholder="Say something about yourself..."
              resize="none"
              size="3"
              className="edit__form-textarea"
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
            />
          )
        )}
      </Form.Control>
      <Form.Message className="edit__form-err-msg" match="valueMissing">
        {message}
      </Form.Message>
      {name === "username" && isTaken && (
        <IoMdClose className="icon__invalid" size={25} />
      )}
    </Form.Field>
  );
}

export default FormField;
