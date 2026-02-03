import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction } from "@radix-ui/react-alert-dialog"
import { CheckCircle, XCircle, Info, Upload, Link, ExternalLink } from "lucide-react"
import { useState } from "react"

type AlertType = "success" | "error" | "info"

interface Props {
  isVisible: boolean
  title: string
  description: string
  type?: AlertType
  onClose: () => void
  onSubmit?: (link: string) => void
  topicId?: string
  topicName?: string
}

export default function TextAlert({
topicName,
  topicId,
  isVisible,
  title,
  description,
  type = "success",
  onClose,
  onSubmit,
}: Props) {
  const [link, setLink] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = () => {
    if (onSubmit && link.trim()) {
      setIsUploading(true)
      onSubmit(link)
      setTimeout(() => {
        setIsUploading(false)
        setLink("")
      }, 1000)
    }
  }

  const styles = {
    success: {
      icon: <CheckCircle className="w-10 h-10 text-emerald-600" />,
      border: "border-emerald-200",
      bg: "bg-white",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
      accent: "bg-emerald-50",
      text: "text-emerald-700",
    },
    error: {
      icon: <XCircle className="w-10 h-10 text-red-600" />,
      border: "border-red-200",
      bg: "bg-white",
      btn: "bg-red-600 hover:bg-red-700 text-white",
      accent: "bg-red-50",
      text: "text-red-700",
    },
    info: {
      icon: <Info className="w-10 h-10 text-blue-600" />,
      border: "border-blue-200",
      bg: "bg-white",
      btn: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
      accent: "bg-gradient-to-br from-blue-50 to-indigo-50",
      text: "text-blue-700",
    },
  }

  const s = styles[type]
  return (
    <AlertDialog open={isVisible}>
      <AlertDialogContent
        className={`max-w-md rounded-xl border ${s.border} ${s.bg} shadow-xl`}
      >
        <AlertDialogHeader className="space-y-4">
          {/* Header with Icon */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.accent}`}>
              {s.icon}
            </div>
            <div className="text-left">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                {title} - {topicName}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                {description}
              </AlertDialogDescription>
            </div>
          </div>

          {/* Notes Link Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Link className="w-4 h-4" />
              <span>Notes Link</span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste Google Drive, Dropbox, or cloud storage link"
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm placeholder:text-gray-400"
              />
              <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className={`text-xs p-3 rounded-lg ${s.accent} border ${s.border}`}>
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className={`text-xs ${s.text}`}>
                  Ensure the link is publicly accessible. File formats: PDF, DOC, PPT, TXT
                </span>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-4">
          <AlertDialogCancel
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={!link.trim() || isUploading}
            className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg ${s.btn} disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Notes
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>

        {/* Premium Badge - Subtle */}
        <div className="absolute -top-2 right-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow">
            PREMIUM
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}