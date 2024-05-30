import * as ToastRadix from "@radix-ui/react-toast";
import "./Toast.css";

interface PropTypes {
  open: boolean;
  onOpenChange: any;
  message: string;
}

function Toast({ open, onOpenChange, message }: PropTypes) {
  return (
    <ToastRadix.Root
      open={open}
      onOpenChange={onOpenChange}
      className="ToastRoot"
    >
      <ToastRadix.Title className="ToastTitle">{message}</ToastRadix.Title>
    </ToastRadix.Root>
  );
}

export default Toast;
