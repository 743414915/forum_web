import { ElMessage } from "element-plus";

const showMessage = (type, msg, callback) => {
  ElMessage({
    type,
    message: msg,
    duration: 2000,
    onClose: () => {
      callback && callback();
    }
  })
}

const message = {
  error: (msg, callback) => {
    showMessage("error", msg, callback)
  },
  success: (msg, callback) => {
    showMessage("success", msg, callback)
  },
  warning: (msg, callback) => {
    showMessage("warning", msg, callback)
  },
}

export default message;