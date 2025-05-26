import { v4 as uuidv4 } from "uuid";
import isNumber from "lodash/isNumber";

const SESSION_KEY = "__session_upload__";

// interface FileInfo {
//   name: string;
//   size: number;
// }

// interface Options {
//   eventEid?: string;
//   uploadSessionKey?: string;
//   file: FileInfo;
//   networkSpeedInterval: number;
//   lowNetworkSpeed?: number;
//   uploadedFileSize: number;
//   onLowNetworkSpeed(): void
// }
const fileUploadDomStatus = {
  start: 'start',
  end: 'end',
  cancel: 'cancel',
  lowNetwork: 'lowNetwork',
  resume: 'resume',
  err: 'error',
}
export default class UploadDelegate {
  constructor(options) {
    if (!options.file) throw new Error("file cannot be empty");
    this.options = {
      eventEid: "46f1b3af32ba45b3817fd896e488314e",
      uploadedFileSize: 0,
      networkSpeedInterval: 10000,
      sessionId: uuidv4(),
      ...options,
    };
    this.uploadedFileSize = this.options.uploadedFileSize;
    this.maxIntervalTime = 10;//最大检测次数
    this.init();
  }

  init() {
    // const { uploadSessionKey } = this.options;
    // const uuid = uuidv4();
    // window.sessionStorage.setItem(uploadSessionKey, uuid);
    this.startPollingNetwork();
  }
  startPollingNetwork() {
    const {
      lowNetworkSpeed,
      onLowNetworkSpeed,
      networkSpeedInterval,
    } = this.options;
    if (lowNetworkSpeed && isNumber(lowNetworkSpeed)) {
      this.timer = setInterval(() => {
        try {
          const speed =
            (this.uploadedFileSize * 1000) / (Date.now() - this.startTime);
          if (speed < lowNetworkSpeed) {
            if (onLowNetworkSpeed) {
              onLowNetworkSpeed(speed);
            }
            this.sendLowNetworkSpeedEvent(speed);
            this.maxIntervalTime = this.maxIntervalTime - 1;
            if (this.maxIntervalTime < 1) {
              this.destroy();
            }
          }
        } catch (err) {
          this.sendSentryEvent(err);
        }
      }, networkSpeedInterval);
    }
  }

  getUploadSession() {
    let sessionConfig = { 'sessionId': this.options.sessionId, 'uploadConfig': null }
    const TracerSessionId = sessionStorage.getItem("upload_config");
    if (TracerSessionId) {
      try {
        sessionConfig = {
          'sessionId': this.options.sessionId,
          'uploadConfig': JSON.parse(TracerSessionId)
        }
      } catch (e) {
        console.log('埋点异常', e)
      }
    }
    return sessionConfig;
  }

  getUploadStartTime() {
    return this.startTime;
  }

  getUploadEndTime() {
    return this.endTime;
  }

  getText1(status) {
    return { value: status, desc: "上传类型" }
  }

  getText6(start, end) {
    return { value: { start, end }, desc: "上传时间" };
  }

  getText7(name, size) {
    return { value: { name, size }, desc: "文件信息" };
  }

  startUpload() {
    const { file } = this.options;
    this.startTime = Date.now();
    const trackData = {
      text1: this.getText1(fileUploadDomStatus.start),
      text6: this.getText6(this.startTime, null),
      text7: this.getText7(file.name, file.size),
    };
    this.sendTrackEvent(trackData);
  }

  updateUploadedFileSize(size) {
    this.uploadedFileSize = size;
  }

  cancelUpload() {
    const { file } = this.options;
    const trackData = {
      text1: this.getText1(fileUploadDomStatus.cancel),
      text6: this.getText6(this.startTime, Date.now()),
      text7: this.getText7(file.name, file.size),
    };
    this.sendTrackEvent(trackData);
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resumeUpload() {
    const { file } = this.options;
    this.startTime = Date.now();
    this.endTime = null;
    const trackData = {
      text1: this.getText1(fileUploadDomStatus.resume),
      text6: this.getText6(this.startTime, this.endTime),
      text7: this.getText7(file.name, file.size),
    };
    this.sendTrackEvent(trackData);
    this.startPollingNetwork();
  }

  endUpload() {
    const { file } = this.options;
    this.endTime = Date.now();
    const trackData = {
      text1: this.getText1(fileUploadDomStatus.end),
      text6: this.getText6(this.startTime, this.endTime),
      text7: this.getText7(file.name, file.size),
    };
    this.sendTrackEvent(trackData);
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  sendLowNetworkSpeedEvent(speed = 0) {
    const { file } = this.options;
    const trackData = {
      text1: this.getText1(fileUploadDomStatus.lowNetwork),
      text5: { value: speed / 1024, desc: "文件上传速度(kb)" },
      text6: this.getText6(this.startTime, Date.now()),
      text7: this.getText7(file.name, file.size),
    };
    this.sendTrackEvent(trackData);
    // this.sendSentryEvent(null, `文件上传速度缓慢${speed / 1024}kb`);
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  sendTrackEvent(data = null) {
    if (typeof window !== "undefined" && window.TezignTracer) {
      if (data) {
        const s = this.getUploadSession();
        const { eventEid } = this.options;
        window.TezignTracer.track({
          eid: eventEid,
          extra: {
            ...data,
            text10: { value: s, desc: "upload session" },
            text9: { value: window.location.href, desc: "current url" },
            text8: { value: window.navigator.userAgent, desc: "userAgent" },
          },
        });
      }
    }
  }

  sendSentryEvent(err = null, message = "") {
    // destroy when error
    this.destroy();
    if (typeof window !== "undefined" && window.Sentry) {
      if (err) {
        window.Sentry.captureException(err);
      }
      if (message) {
        window.Sentry.captureMessage(message);
      }
    }
  }
}
