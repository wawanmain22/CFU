import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface Props {
  message: string;
  onClose?: () => void;
}

export default function AlertSuccess({ message, onClose }: Props) {
  const [open, setOpen] = useState(true);
  const [countdown, setCountdown] = useState(3.0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setOpen(false);
          onClose?.();
          return 0;
        }
        return +(prev - 0.1).toFixed(1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader className="flex flex-row items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div className="flex-1">
            <AlertDialogTitle className="text-green-600 flex justify-between items-center">
              Success
              <span className="text-sm text-gray-500">{countdown}s</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {message}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
} 