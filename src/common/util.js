import moment from "moment";
import {exportWord} from "mhtml-to-word"
import html2pdf from 'html2pdf.js';

export const isWeixinBrowser = () => {
  // 使用正则表达式匹配常见的微信浏览器User-Agent字符串特征
  return /MicroMessenger/i.test(navigator.userAgent);
}

export const isPcMode = () => {
  const html = document.documentElement;
  let clientWidth = html.clientWidth;
  return clientWidth > 959;
};

export const navToMainPage = () => {
  if(isPcMode()) {
    window.location.href = '/#/chat';
  } else {
    window.location.href = '/#/enter-welcome';
  }
}

export const htmlToDocx = (htmlContent, fileName) => {
  const page = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`;
  exportWord({
    mhtml: page,  //将转化好的内容放到mhtml这个参数中
    data: {title: "exportword"},
    filename: fileName,
  })
};
export const htmlToPdf = (htmlContent, pdfName) => {
  const opt = {
    margin:       10,
    filename:     pdfName + '.pdf',
    image:        {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas:  {
      scale: 2,
      letterRendering: true,
      logging: true,
      dpi: 192,
    },
    jsPDF:        {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all'] }
  };
  html2pdf().set(opt).from(htmlContent).save();
};

export function getCurrentDateTimeString() {
  return moment().format('YYYYMMDDHHmmss');
}

