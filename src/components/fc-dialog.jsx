import {isPcMode} from "@/common/util.js";
import {Modal} from "antd";
import {Dialog} from "antd-mobile";

class FcDialog {
  alert = ({title, content, onConfirm, onCancel}) => {
    if(isPcMode()) {
      return Modal.info({
        title,
        content,
        onOk: onConfirm,
        onCancel: onCancel
      })
    }
    return Dialog.alert({
      content,
      title,
    })
  }

  confirm = ({title, content, onConfirm, onCancel, confirmText, cancelText}) => {
    if(isPcMode()) {
      return Modal.confirm({
        width: 800,
        centered: true,
        style: {
          height: '100',
          overflowY: 'auto'
        },
        className: 'chat-pc-report-modal',
        id: "#chat-pc-report-modal",
        title,
        content,
        cancelText,
        okText: confirmText,
        onOk: onConfirm,
        onCancel: onCancel,
      })
    }
    return Dialog.confirm({
      content,
      title,
      confirmText,
      cancelText,
      onConfirm: onConfirm,
      onCancel: onCancel,
    })
  }
}

export default new FcDialog();