import {getVoiceConfig} from "@/common/api.js";
import to from "await-to-js";
import {message} from "antd";

class AudioRecordUtil {
    constructor() {
        this.websocket = null;
        this.audioContext = null;
        this.scriptProcessor = null;
        this.audioInput = null;
        this.audioStream = null;

        // 绑定方法到实例
        this.updateStatus = this.updateStatus.bind(this);
        this.generateUUID = this.generateUUID.bind(this);
        this.logMessage = this.logMessage.bind(this);
        this.connectWebSocket = this.connectWebSocket.bind(this);
        this.disconnectWebSocket = this.disconnectWebSocket.bind(this);
        this.applyRecordPermission = this.applyRecordPermission.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    // 更新连接状态
    updateStatus(status) {
        console.log(status === '已连接' ? 'green-已连接' : 'red-已断开');
    }

    // 生成 UUID
    generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        ).replace(/-/g, '');
    }

    // 日志消息
    logMessage(message, error) {
        console.log(message, error);
    }

    // 打开WebSocket连接
    async connectWebSocket(onOpenCallback, onMessageCallback, connErrorCallback, onCloseCallback) {
        // 如果已经存在连接且是打开状态，直接返回
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            console.warn('websocket已经连接，无需重复连接');
            return true;
        }

        const [err, res] = await to(getVoiceConfig());
        if(err) {
            message.error('获取语音识别token失败');
            return false;
        }
        const {appKey, token} = res;
        const socketUrl = `wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1?token=${token}`;
        
        // 创建新的 WebSocket 连接
        this.websocket = new WebSocket(socketUrl);
        
        this.websocket.onopen = () => {
            this.updateStatus('已连接');
            this.logMessage('连接到 WebSocket 服务器');
            const startTranscriptionMessage = {
                header: {
                    appkey: appKey,
                    namespace: "SpeechTranscriber",
                    name: "StartTranscription",
                    task_id: this.generateUUID(),
                    message_id: this.generateUUID()
                },
                payload: {
                    "format": "pcm",
                    "sample_rate": 16000,
                    "enable_intermediate_result": true,
                    "enable_punctuation_prediction": true,
                    "enable_inverse_text_normalization": true
                }
            };
            this.websocket.send(JSON.stringify(startTranscriptionMessage));
        };

        this.websocket.onmessage = (event) => {
            this.logMessage('服务端: ', event);

            const message = JSON.parse(event.data);
            if (message.header.name === "TranscriptionStarted") {
                if(onOpenCallback) {
                    onOpenCallback(event.data);
                }
            } else {
                if(onMessageCallback) {
                    onMessageCallback(message);
                }
            }
        };

        this.websocket.onerror = (event) => {
            this.updateStatus('错误');
            this.logMessage('WebSocket 错误: ' + event);
            if(connErrorCallback) {
                connErrorCallback(event);
            }
        };

        this.websocket.onclose = () => {
            this.updateStatus('断开连接');
            this.logMessage('与 WebSocket 服务器断开');
            if(onCloseCallback) {
                onCloseCallback();
            }
        };

        return true;
    }

    // 断开WebSocket连接
    disconnectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.updateStatus('未连接');
    }

    // 申请录音权限
    async applyRecordPermission() {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (e) {
            this.logMessage('申请录音权限失败:', e)
            return false;
        }
    }

    // 开始录音
    async startRecording(onRecordFail) {
        try {
            if(!this.audioStream) {
                return message.error('请先申请录音权限');
            }
            
            // 重新创建 AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000
            });
            this.audioInput = this.audioContext.createMediaStreamSource(this.audioStream);

            // 设置缓冲区大小为2048的脚本处理器
            this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1);

            this.scriptProcessor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const inputData16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; ++i) {
                    inputData16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF; // PCM 16-bit
                }
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                    this.websocket.send(inputData16.buffer);
                    this.logMessage('发送音频数据块', inputData.length);
                }
            };

            this.audioInput.connect(this.scriptProcessor);
            this.scriptProcessor.connect(this.audioContext.destination);
        } catch (e) {
            this.logMessage('录音失败: ', e);
            if(onRecordFail) {
                onRecordFail(e);
            }
        }
    }

    // 停止录音
    stopRecording() {
        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect();
            this.scriptProcessor = null;
        }
        if (this.audioInput) {
            this.audioInput.disconnect();
            this.audioInput = null;
        }
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        // 断开 WebSocket 连接
        this.disconnectWebSocket();
    }
}

// 创建单例实例
const audioRecordUtil = new AudioRecordUtil();

// 导出实例方法
export const {
    connectWebSocket,
    applyRecordPermission,
    startRecording,
    stopRecording
} = audioRecordUtil;