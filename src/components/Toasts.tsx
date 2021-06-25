import toast from "react-hot-toast";

export function notifySuccess(message: string) {
  return toast.success(message);
}

export function notifyError(message: string) {
  return toast.error(message);
}

export function notifyCopied(message: string) {
  return toast.success(message, {
    icon: '📝'
  })
}
