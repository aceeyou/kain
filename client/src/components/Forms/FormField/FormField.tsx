import * as Form from "@radix-ui/react-form";
import "./FormField.css";
import { TextArea } from "@radix-ui/themes";

interface FieldProps {
  name: string;
  label: string;
  message?: string | null;
  as?: string | "input";
  placeholder?: string | null;
  inputType: string;
  value: string;
  onChange: (name: string, newData: string) => void;
}

function FormField({
  name,
  label,
  message,
  as = "input",
  inputType,
  value,
  onChange,
}: FieldProps) {
  return (
    <Form.Field name={name} className="edit__form-field">
      <Form.Label className="edit__form-label">{label}</Form.Label>
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
              name="bio"
              variant="classic"
              placeholder="Say something about yourself..."
              resize="none"
              size="3"
              className="edit__form-textarea"
            />
          )
        )}
      </Form.Control>
      <Form.Message className="edit__form-err-msg" match="valueMissing">
        {message}
      </Form.Message>
    </Form.Field>
  );
}

export default FormField;
