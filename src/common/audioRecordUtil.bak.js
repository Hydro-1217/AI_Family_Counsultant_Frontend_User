import {getVoiceConfig} from "@/common/api.js";
import to from "await-to-js";
import {message} from "antd";

let websocket;
let audioContext;
let scriptProcessor;
let audioInput;
let audioStream;

// 更新连接状态
function updateStatus(status) {
    // document.getElementById('status').textContent = status;
    // document.getElementById('status').style.color = status === '已连接' ? 'green' : 'red';
    console.log(status === '已连接' ? 'green-已连接' : 'red-已断开');
}

// 生成 UUID
function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    ).replace(/-/g, '');
}

// 打开WebSocket连接
export async function connectWebSocket(onOpenCallback, onMessageCallback, connErrorCallback, onCloseCallback) {
    if(websocket && websocket.readyState === WebSocket.OPEN) {
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
    websocket = new WebSocket(socketUrl);
    websocket.onopen = function() {
        updateStatus('已连接');
        logMessage('连接到 WebSocket 服务器');
        var startTranscriptionMessage = {
            header: {
                appkey: appKey,
                namespace: "SpeechTranscriber",
                name: "StartTranscription",
                task_id: generateUUID(),
                message_id: generateUUID()
            },
            payload: {
                "format": "pcm",
                "sample_rate": 16000,
                "enable_intermediate_result": true,
                "enable_punctuation_prediction": true,
                "enable_inverse_text_normalization": true
            }
        };
        websocket.send(JSON.stringify(startTranscriptionMessage));
    };

    websocket.onmessage = function(event) {
        logMessage('服务端: ', event);

        const message = JSON.parse(event.data);
        if (message.header.name === "TranscriptionStarted") {
            // 启用开始录音按钮
            // document.getElementById('startButton').disabled = false;
            // document.getElementById('stopButton').disabled = false;
            if(onOpenCallback) {
                onOpenCallback(event.data);
            }
        } else {
            if(onMessageCallback) {
                onMessageCallback(message);
            }
        }
    };

    websocket.onerror = function(event) {
        updateStatus('错误');
        logMessage('WebSocket 错误: ' + event);
        if(connErrorCallback) {
            connErrorCallback(event);
        }
    };

    websocket.onclose = function() {
        updateStatus('断开连接');
        logMessage('与 WebSocket 服务器断开');
        if(onCloseCallback) {
            onCloseCallback();
        }
    };

    return true;
}

// 断开WebSocket连接
export function disconnectWebSocket() {
    if (websocket) {
        websocket.close();
    }
    // document.getElementById('disconnectButton').disabled = true;
    updateStatus('未连接');
}

// 日志消息
function logMessage(message, error) {
    // const messagesDiv = document.getElementById('messages');
    // const messageElement = document.createElement('div');
    // messageElement.textContent = message;
    // messagesDiv.appendChild(messageElement);
    // messagesDiv.scrollTop = messagesDiv.scrollHeight;
    console.log(message, error);
}

export async function applyRecordPermission() {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
    } catch (e) {
        logMessage('申请录音权限失败:', e)
        return false;
    }
}

// 开始录音
export async function startRecording(onRecordFail) {
    try {
        if(!audioStream) {
            return message.error('请先申请录音权限');
        }
        // 获取音频输入设备
        // audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000
        });
        audioInput = audioContext.createMediaStreamSource(audioStream);

        // 设置缓冲区大小为2048的脚本处理器
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        scriptProcessor.onaudioprocess = function(event) {
            const inputData = event.inputBuffer.getChannelData(0);
            const inputData16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; ++i) {
                inputData16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF; // PCM 16-bit
            }
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(inputData16.buffer);
                logMessage('发送音频数据块', inputData.length);
            }
        };

        audioInput.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
    } catch (e) {
        logMessage('录音失败: ', e);
        if(onRecordFail) {
            onRecordFail(e);
        }
    }
}

// 停止录音
export function stopRecording() {
    if (scriptProcessor) {
        scriptProcessor.disconnect();
    }
    if (audioInput) {
        audioInput.disconnect();
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
    // document.getElementById('startButton').disabled = true;
    // document.getElementById('stopButton').disabled = true;
} 