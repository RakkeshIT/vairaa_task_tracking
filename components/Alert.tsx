import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { CheckCircle, XCircle, Info } from "lucide-react"

type AlertType = "success" | "error" | "info"

interface Props {
  isVisible: boolean
  title: string
  description: string
  type?: AlertType
  onClose: () => void
}

export default function AlertDialog1({
  isVisible,
  title,
  description,
  type = "success",
  onClose,
}: Props) {

  const styles = {
    success: {
      icon: <CheckCircle className="w-14 h-14 text-green-500" />,
      border: "border-green-300",
      bg: "bg-green-50",
      btn: "bg-green-600 hover:bg-green-700 text-white",
    },
    error: {
      icon: <XCircle className="w-14 h-14 text-red-500" />,
      border: "border-red-300",
      bg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700 text-white",
    },
    info: {
      icon: <Info className="w-14 h-14 text-blue-500" />,
      border: "border-blue-300",
      bg: "bg-blue-50",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  }

  const s = styles[type]

  return (
    <AlertDialog open={isVisible}>
      <AlertDialogContent
        className={`max-w-sm rounded-2xl border-2 ${s.border} ${s.bg} text-center`}
      >
        <AlertDialogHeader className="items-center space-y-3">
          {s.icon}
          <AlertDialogTitle className="text-lg font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel
            onClick={onClose}
            className={`px-6 py-2 rounded-lg ${s.btn}`}
          >
            OK
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
