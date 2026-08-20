// @ts-nocheck
import chatStatusOnlineUrl from '@/assets/chat-status-online.png';
import iconChatUrl from '@/assets/icon-chat.png';
import iconSendUrl from '@/assets/icon-send.png';
import {
  addSessionContent,
  deleteLastQuestionId,
  generateReport,
  getFamilyInfo,
  getLastQuestionId,
  getUserSessionList,
  getUserSessionStartUrl,
  queryFamilyReportPage,
  saveLastQuestionId,
  userSessionCreate,
  userSessionMessageList,
  userSessionQuestionSuggestList,
  userUpdate
} from "@/common/api.js";
import { connectAndStartSynthesis, sendRunSynthesis } from '@/common/audioPlayUtil';
import {
  applyRecordPermission,
  connectWebSocket,
  startRecording,
  stopRecording
} from "@/common/audioRecordUtil.js";
import { getFamilyId, getToken, getUid, mixLoginJump } from "@/common/axiosInstance.js";
import { FC_X_USER_SESSION_ID, ROLE_NAME_MAP, ROLE_TYPE, ROLE_TYPE_MAP } from "@/common/constants.js";
import { getCurrentDateTimeString, htmlToPdf, isPcMode, isWeixinBrowser } from "@/common/util.js";
import ChatItem from "@/components/chat-item";
import FcDialog from "@/components/fc-dialog.jsx";
import '@/routes/style-pc/chat.scss';
import { getUserInfo, getUserSessionId } from "@/service/user.js";
import { Dropdown, Menu, message } from "antd";
import { ActionSheet, Dialog, DotLoading, Popover, TextArea, Toast } from "antd-mobile";
import { CheckOutline, CloseCircleOutline, MoreOutline, } from 'antd-mobile-icons';
import to from "await-to-js";
import classNames from "classnames";
import copy from 'copy-to-clipboard';
import _ from "lodash";
import moment from "moment";
import { marked } from "marked";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import './chat.scss';
// eslint-disable-next-line no-unused-vars
import React from 'react';

const QUESTION_TYPE = {
  NORMAL: 1,
  PROBE: 2,
}

const VOICE_STATUS = {
  NONE: 1, // 初始状态
  CONNECTED: 2, // 连接状态
  RECORDING: 3, // 录音中
  RECORDED: 4 // 录音完成
};

// 工具函数：解析日期字符串（支持年份和常见日期格式）
function parseDate(str) {
  // 空值处理
  if (!str || typeof str !== 'string') return null;

  // 1. 年份处理（4位数字）
  if (/^\d{4}$/.test(str)) {
    const year = parseInt(str);
    // 有效性判断（根据你的业务需求调整范围）
    if (year < 1900 || year > new Date().getFullYear()) return null;
    return new Date(year, 0, 1); // 返回当年1月1日
  }

  // 2. 日期格式处理
  // 严格校验格式（ISO 8601 和常见格式）
  const dateRegex = /^(\d{4})[-/]?(0[1-9]|1[0-2])[-/]?(0[1-9]|[12][0-9]|3[01])$/;
  const match = str.match(dateRegex);

  if (!match) return null;

  // 构造 Date 对象（自动处理时区问题）
  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00`);

  // 二次验证（防止类似 2023-02-30 被自动转换的情况）
  const isValid = (
      date.getFullYear() === parseInt(year) &&
      (date.getMonth() + 1) === parseInt(month) &&
      date.getDate() === parseInt(day)
  );

  return isValid ? date : null;
}

const VOICE_TIMEOUT = 60000;

const FOLLOW_QUESTION_CONTENT = '能具体说说吗？';

export default function Root() {
  const navigate = useNavigate();
  const chatInfoRef = useRef(null);
  const [chatInfoList, setChatInfoList] = useState([]);
  const [currentUserSessionId, setCurrentUserSessionId] = useState(undefined);
  const [sendText, setSendText] = useState('');
  const [familyInfo, setFamilyInfo] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [showInPcMode, setShowInPcMode] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [allQuestionList, setAllQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentQuestionSuggestions, setCurrentQuestionSuggestions] = useState();
  const [currentVoiceStatus, setCurrentVoiceStatus] = useState(VOICE_STATUS.NONE);
  const [countDownTime, setCountDownTime] = useState(0);
  const [currentVoiceText, setCurrentVoiceText] = useState('');
  const [currentLoadingVoiceText, setCurrentLoadingVoiceText] = useState('');
  const [hasRecordPermission, setHasRecordPermission] = useState(false);

  const fetchFamilyInfo = async () => {
    const [err, _familyInfo] = await to(getFamilyInfo(getFamilyId()));
    if (err) {
      return FcDialog.alert({
        content: `获取家庭信息: ${err.message}`,
      })
    }
    setFamilyInfo(_familyInfo);
  }

  useEffect(() => {
    fetchFamilyInfo().then(r => r);
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUserRole(userInfo.role)
      setCurrentUserInfo(userInfo)
    }
    setShowInPcMode(isPcMode());
  }, [setCurrentUserRole, setCurrentUserInfo, setShowInPcMode]);

  useEffect(() => {
    if (!isPcMode()) {
      applyRecordPermission().then(setHasRecordPermission);
    }
  }, [familyInfo]);

  const createNewUserSession = async () => {
    // 第一次创建会话
    const [err, userSessionInfo] = await to(userSessionCreate());
    if (err || !userSessionInfo) {
      await FcDialog.alert({
        content: `用户会话创建失败: ${err.message}`
      })
      return Promise.resolve(undefined);
    }
    const {id} = userSessionInfo;
    localStorage.setItem(FC_X_USER_SESSION_ID, id);

    return Promise.resolve({
      isNew: true,
      userSessionId: id
    });
  }

  const appendQuestionAndSuggestions = (nextQuestion) => {
    setCurrentQuestion(nextQuestion);
    setCurrentQuestionSuggestions(nextQuestion.suggestionList || []);
    appendChatInfoText(ROLE_TYPE.ASSISTANT, nextQuestion.question);

    // 记录一下会话信息
    const userSessionId = getUserSessionId();
    addSessionContent(userSessionId, {
      role: ROLE_TYPE.ASSISTANT,
      content: nextQuestion.question,
    });

    // 记录一下最近的问题ID
    if(nextQuestion.questionId) {
      saveLastQuestionId({
        userId: getUserInfo().id,
        userSessionId: getUserSessionId(),
        lastQuestionId: nextQuestion.questionId,
      })
    }
  }

  const generateUserSessionId = async () => {
    const userSessionId = getUserSessionId();
    // 看是否有会话缓存
    if (userSessionId) {
      return {
        isNew: false,
        userSessionId
      }
    }
    // 查询所有的会话列表
    const [err, userSessionList] = await to(getUserSessionList());
    if (err) {
      await Dialog.alert({
        content: `用户会话列表查询失败: ${err.message}`
      })
      // 获取失败后，清除当前的会话ID，并且重新load当前页面
      localStorage.removeItem(FC_X_USER_SESSION_ID);
      return;
    }

    // 查询到了，取第一个
    if (userSessionList && userSessionList.length) {
      return {
        isNew: false,
        userSessionId: userSessionList[0].id
      }
    }

    console.log('没有查询到会话，就创建一个新会话')
    return await createNewUserSession()
  }

  const fetchChatInfoList = async () => {
    const userSessionInfo = await generateUserSessionId();
    if (!userSessionInfo) {
      return;
    }
    let {isNew: isNewUserSession, userSessionId: _userSessionId} = userSessionInfo;
    localStorage.setItem(FC_X_USER_SESSION_ID, _userSessionId);

    const [err, chatInfoList] = await to(userSessionMessageList(_userSessionId));
    if (err || !chatInfoList || !chatInfoList.length) {
      return Dialog.alert({
        content: `用户会话消息列表查询失败: ${err.message}`
      })
    }

    // 移除掉system的信息
    const avaChatInfoList = chatInfoList.filter(chatInfo => chatInfo.role !== ROLE_TYPE.SYSTEM);
    setCurrentUserSessionId(_userSessionId)
    setChatInfoList(avaChatInfoList)

    // 如果是第一次新建会话，则发起预置问题
    if (isNewUserSession) {
      const [, questionSuggestList] = await to(userSessionQuestionSuggestList());
      if (questionSuggestList && questionSuggestList.length) {
        await setAllQuestionList(questionSuggestList);
        appendQuestionAndSuggestions(questionSuggestList[0]);
      }
      return;
    }

    // 看一看有没有预置问题回答到一半的情况
    const [, lastQuestionId] = await to(getLastQuestionId(getUserInfo().id, _userSessionId));
    if (lastQuestionId) {
      const [, questionSuggestList] = await to(userSessionQuestionSuggestList());
      if (questionSuggestList && questionSuggestList.length) {
        await setAllQuestionList(questionSuggestList);
        const _currQuestion = questionSuggestList.find(question => question.questionId === lastQuestionId);
        if (_currQuestion) {

          // 如果还处于追问问题状态，则不提供问题选项
          const lastChatInfo = chatInfoList[chatInfoList.length - 1];
          if(lastChatInfo.content === FOLLOW_QUESTION_CONTENT && lastChatInfo.role === ROLE_TYPE.ASSISTANT) {
            console.info('还处于追问问题状态，不提供问题选项')
            setCurrentQuestion({
              // 巧妙处理：追问的问题，还隶属于当前问题，这样依赖，后续的流程中，会自动跳转到下一个问题
              questionId: _currQuestion.questionId,
              question: FOLLOW_QUESTION_CONTENT,
              followQuestion: undefined
            });
          } else {
            setCurrentQuestion(_currQuestion);
            setCurrentQuestionSuggestions(_currQuestion.suggestionList || []);
          }

        }
      }
    }
  };

  useEffect(() => {
    fetchChatInfoList().then(r => {
      console.log('success', r)
    })
  }, [setCurrentUserSessionId, setChatInfoList])

  // 请求获取用户信息
  useLayoutEffect(() => {
    // 页面加载完成后滚动到底部
    if (showInPcMode) {
      requestAnimationFrame(() => {
        chatInfoRef.current.scrollTop = chatInfoRef.current.scrollHeight;
      });
    } else {
      chatInfoRef.current.scrollIntoView({behavior: 'instant', block: 'end'});
    }
  }, [chatInfoList, showInPcMode, currentQuestionSuggestions]);

  function updateChatInfoListWithDynamicText(value, receivedMessages) {
    receivedMessages.push(value);

    const rawMessage = receivedMessages.join("");
    let displayMessage = rawMessage.replaceAll("\n\ndata:", '');
    displayMessage = displayMessage.replaceAll("data:", '');
    displayMessage.slice(0, -2)
    console.log("displayMessage", displayMessage)

    const newChatInfoList = _.cloneDeep(chatInfoList);
    newChatInfoList.splice(-1, 1, {
      role: ROLE_TYPE.ASSISTANT,
      content: displayMessage,
    })
    setChatInfoList(newChatInfoList)
  }

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      // PC上支持回车
      if (event.shiftKey) {
        // 阻止默认行为（例如换行）
        event.preventDefault();
        // 插入换行符
        setSendText(prevText => prevText + '\n');
      } else {
        // 阻止默认行为
        event.preventDefault();
        // 调用发送消息的函数
        await handleSendText()
      }
    }
  }

  const appendChatInfoText = (role, specificText) => {
    chatInfoList.push({role, content: specificText,})
    setChatInfoList(_.cloneDeep(chatInfoList))
  }

  const sendNextNormalQuestion = () => {
    let nextQuestion = findNextNormalQuestion();
    if (!nextQuestion) {
      console.error(`数据异常，下一个NORMAL问题不存在, currentQuestion`, currentQuestion);
      return handleSendText("异常：下一个问题不存在");
    }

    appendQuestionAndSuggestions(nextQuestion);
  }

  const findNextNormalQuestion = () => {
    const currentIndex = currentQuestion ?
        allQuestionList.findIndex(item => item.questionId === currentQuestion.questionId) : allQuestionList[0];

    // 向后找到一个 QUESTION_TYPE.NORMAL的问题
    let nextQuestion;
    for (let i = currentIndex + 1; i < allQuestionList.length; i++) {
      if (allQuestionList[i].questionType === QUESTION_TYPE.NORMAL) {
        nextQuestion = allQuestionList[i];
        break;
      }
    }
    return nextQuestion;
  }

  const handleSuggestItemClick = async (suggestInfo) => {
    const suggestText = suggestInfo.suggest;

    // 如果当前问题是最后一个问题，则交给常规逻辑
    const currentQuestionIndex = allQuestionList.findIndex(item => item.questionId === currentQuestion.questionId);
    if (currentQuestionIndex === allQuestionList.length - 1) {
      return handleSendText(suggestText);
    }

    // 如果要跳过问题
    if (suggestInfo.skipQuestion) {
      return handleSendText(suggestText, true);
    }

    appendChatInfoText(currentUserRole, suggestText);

    // 记录一下会话信息
    await addSessionContent(getUserSessionId(), {
      role: 'user',
      content: suggestText,
    });

    // 插入追问
    if (suggestInfo.followQuestion) {
      // 有追问问题，跳转到追问问题，下下个才是指定的问题
      appendQuestionAndSuggestions({
        // 巧妙处理：追问的问题，还隶属于当前问题，这样依赖，后续的流程中，会自动跳转到下一个问题
        questionId: suggestInfo.userSessionQuestionId,
        question: suggestInfo.followQuestion,
        followQuestion: undefined
      });
      return;
    }

    // 下一问题
    let nextQuestion = null;
    if(suggestInfo.nextQuestionId) {
      nextQuestion = allQuestionList.filter(item => item.questionId === suggestInfo.nextQuestionId)[0];
    } else {
      nextQuestion = findNextNormalQuestion();
    }
    appendQuestionAndSuggestions(nextQuestion);
  }

  const handleSendText = async (paramSendText, skipQuestion) => {
    const inSendText = paramSendText || sendText;
    if (!inSendText || !inSendText.trim()) {
      return
    }
    const _sendText = inSendText.trim();
    setSendText('');
    chatInfoList.push({
      role: getUserInfo().role || 'user',
      content: _sendText,
    })

    if (currentQuestion) {
      // 获取到出生年份，并保存到服务端
      if (currentQuestion.question.indexOf('出生') !== -1) {
        console.log('获取到出生年份，并保存到服务端', _sendText);
        // 如果 _sendText 是有效的年份，则保存到服务端
        const birthDate = parseDate(_sendText);
        if (birthDate) {
          userUpdate({
            id: getUserInfo().id,
            birthday: birthDate,
          });
        }
      }

      const isLastQuestion = allQuestionList
          .findIndex(item => item.questionId === currentQuestion.questionId) === allQuestionList.length - 1
      // 如果当前是对预置问题的回复，则无需跟AI顾问交互
      // 不是最后一个，继续下一个问题
      if (!skipQuestion && !isLastQuestion) {
        // 记录一下会话信息
        const userSessionId = getUserSessionId();
        await addSessionContent(userSessionId, {
          role: 'user',
          content: _sendText,
        });

        // 获取到下一个问题
        return sendNextNormalQuestion();
      }

      // 清空问题（最后一个问题 或 需要主动中断问题）
      await deleteLastQuestionId({
        userId: getUserInfo().id,
        userSessionId: getUserSessionId(),
      });
      setCurrentQuestion(null);
      setCurrentQuestionSuggestions([]);
      setAllQuestionList([]);
    }

    // loading 效果
    appendChatInfoText(ROLE_TYPE.ASSISTANT, '<strong class="loading-spinner" />');

    // 接收GPT消息
    const response = await fetch(getUserSessionStartUrl(currentUserSessionId), {
      method: 'POST',
      headers: {
        'x-token': getToken(),
        'x-user-id': getUid(),
        'x-family-id': getFamilyId(),
        'Content-Type': 'text/event-stream',
      },
      body: _sendText
    })
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
    const receivedMessages = [];
    while (true) {
      const {value, done} = await reader.read();
      if (done) {
        // err msg: {"timestamp":"2024-11-23T11:21:22.789+0000","status":500,"error":"Internal Server Error","message":"userId is null redirect to login page","path":"/AIFamilyConsultant/session/start/2"}
        // console.log('last value', value)
        if (value) {
          updateChatInfoListWithDynamicText(value, receivedMessages);
        }
        break;
      }
      // console.log('Received', value);
      if (value) {
        updateChatInfoListWithDynamicText(value, receivedMessages);
      }
    }
  }

  const exportChatRecords = () => {
    const chatRecords = chatInfoList.map(({role, content}) => ({
      '发送者': role === 'assistant' ? "AI家庭顾问：" : currentUserInfo.name + "：",
      '内容': content
    }));
    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    // 将 JSON 数组转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(chatRecords, {
      header: ['发送者', '内容'],
    });
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chat Records');
    // 生成 Excel 文件并下载
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${familyInfo.name}(${familyInfo.code})${currentUserInfo.name}的聊天记录-${new Date().toLocaleString()}.xlsx`;
    link.click();

    // 清理
    URL.revokeObjectURL(url);
  }

  const getRoleInfo = (role) => {
    return ROLE_TYPE_MAP[role] || ROLE_NAME_MAP[role] || ROLE_TYPE_MAP[3];
  }
  const handleGenerateReport = async () => {
    if (reportGenerating) {
      return;
    }

    // 使用 lodash 计算 startTime 和 endTime
    const now = moment().endOf('day');
    const endTime = now.format('YYYY-MM-DD HH:mm:ss');
    const startTime = now.subtract(6, 'months').format('YYYY-MM-DD HH:mm:ss');;

    const familyId = getFamilyId();
    setReportGenerating(true);
    const [err1] = await to(generateReport({ startTime, endTime, familyId }));
    setReportGenerating(false);
    if (err1) {
      if (err1.message) {
        return FcDialog.alert({
          content: err1.message
        });
      }
      return FcDialog.alert({
        content: '生成报告异常，请联系管理员'
      });
    }
    return FcDialog.alert({
      content: '报告生成任务已提交，请稍候查看'
    });
  }

  const chatItemRefs = useRef([]);
  const exportReport = async (index) => {
    if(chatItemRefs[index]) {
      chatItemRefs[index].hide();
    }

    const familyId = getFamilyId();
    const [err2, pageInfo] = await to(queryFamilyReportPage(familyId, 1, 1));
    if (err2 || !pageInfo.records || !pageInfo.records.length) {
      return FcDialog.alert({
        content: '获取报告异常，请联系管理员'
      })
    }
    const latestRecord = pageInfo.records[0];
    const {createTime, familyVO, report, sessionStartTime, sessionEndTime} = latestRecord;
    const htmlContent = marked(report, null);
    const currentDay = createTime.substring(0, 10).replaceAll('-', '/');
    const reportHtml = (
        <div id="latest-report-content">
          <h2>{familyVO.name}({familyVO.code}) {currentDay} 家庭沟通分析报告</h2>
          <div>
            {sessionStartTime ? <div>报告分析会话时间范围：{sessionStartTime} ~ {sessionEndTime}</div> : null}
            <div dangerouslySetInnerHTML={{__html: htmlContent}}></div>
          </div>
        </div>
    );
    return FcDialog.confirm({
      title: null,
      content: reportHtml,
      confirmText: '下载分析报告',
      cancelText: '关闭',
      onConfirm: () => {
        if (isWeixinBrowser()) {
          return Toast.show({content: '可在浏览器打开此网页来下载文件'});
        }

        const filename = `${familyInfo.name}(${familyInfo.code})${currentUserInfo.name}的家庭沟通分析报告-${getCurrentDateTimeString()}`;
        htmlToPdf(document.querySelector("#latest-report-content"), filename);
      }
    })
  }

  const [actionVisible, setActionVisible] = useState(false);
  const actions = [{
    text: '查看分析报告 / View Report',
    key: 'report-view',
    onClick: () => {
      setActionVisible(false)
      exportReport().then(r => r)
    }
  }, {
    text: <>{reportGenerating ? <DotLoading/> : null}生成分析报告 / Generate Report</>,
    key: 'report-generate',
    onClick: () => {
      setActionVisible(false)
      Toast.show({
        content: <>{reportGenerating ? <DotLoading/> : null}正在生成分析报告</>
      })
      handleGenerateReport().then(r => r)
    }
  }, {
    text: '导出聊天记录 / Export Chat',
    key: 'export-records',
    onClick: () => {
      setActionVisible(false);
      exportChatRecords()
    }
  }, {
    text: '用户反馈 / Feedback',
    key: 'user-feedback',
    onClick: () => {
      navigate("/user-feedback")
    }
  }, {
    text: '退出登录 / Sign Out',
    key: 'logout',
    danger: true,
    onClick: mixLoginJump
  },];

  const finishAll = async () => {
    setHasRecordPermission(false);
    setCurrentVoiceText('');
    setCurrentLoadingVoiceText('');
    setCurrentVoiceStatus(VOICE_STATUS.NONE);
    stopRecording();
    clearInterval(window.countdownInterval);
  }

  const handleAudioPrepare = async () => {
    if (isPcMode()) {
      return false;
    }

    // 如果不是初始状态，则恢复到初始状态
    if (currentVoiceStatus !== VOICE_STATUS.NONE) {
      finishAll();
      return;
    }

    if (currentVoiceStatus === VOICE_STATUS.RECORDING) {
      return false;
    }

    // 如果没有录音权限，重新申请
    if (!hasRecordPermission) {
      const result = await applyRecordPermission();
      if (!result) {
        return false;
      }
      await setHasRecordPermission(true);
    }

    const result = await connectWebSocket((data) => {
      console.log('已连接成功，可以录音了', data)
      setCurrentVoiceStatus(VOICE_STATUS.CONNECTED);
    }, (message) => {
      const {header, payload} = message;
      const {name, status} = header;
      console.log(`这是实时转化的录音文本: ${status}-${name}-${message?.payload?.result}`, message);
      // console.log(`这是上一次拼接的的录音文本: ${currentVoiceText}-${currentLoadingVoiceText}`);

      // 状态异常
      if (status !== 20000000) {
        setCurrentVoiceText(prevState => prevState);
        setCurrentLoadingVoiceText("");
        setCurrentVoiceStatus(VOICE_STATUS.NONE);
        stopRecording();
        return;
      }

      const {result, time} = payload;

      // 超过VOICE_TIMEOUT秒，结束掉
      // if (time > VOICE_TIMEOUT) {
      //   setSendText(currentVoiceText + currentLoadingVoiceText + result);
      //   finishAll();
      //   return;
      // }

      if (name === "TranscriptionResultChanged" || name === "SentenceBegin") {
        setCurrentLoadingVoiceText(result);
      } else if (name === "SentenceEnd") {
        setCurrentVoiceText(prevState => prevState + result);
        setCurrentLoadingVoiceText("");
      }

    }, () => {
      console.error('连接异常了');
      // setCurrentVoiceStatus(VOICE_STATUS.NONE);
    }, () => {
      console.error('连接关闭了');
      // setCurrentVoiceStatus(VOICE_STATUS.NONE);
    });

    if (result) {
      setCurrentVoiceStatus(VOICE_STATUS.CONNECTED);
    }
    return true;
  }

  const voiceTextRef = useRef('');
  const loadingVoiceTextRef = useRef('');

  // 每次状态更新时同步更新 ref
  useEffect(() => {
    voiceTextRef.current = currentVoiceText;
  }, [currentVoiceText]);

  useEffect(() => {
    loadingVoiceTextRef.current = currentLoadingVoiceText;
  }, [currentLoadingVoiceText]);

  const updateCountDown = _.throttle(() => {
    setCountDownTime(prevTime => {
      if (prevTime <= 0) {
        // 时间到
        clearInterval(window.countdownInterval);
        handleAudioTextConfirm();
        return 0;
      }
      return prevTime - 1000;
    });
  }, 1000);

  const handleAudioStart = async () => {
    setCurrentVoiceStatus(VOICE_STATUS.RECORDING);
    startRecording((e) => {
      clearInterval(window.countdownInterval);
      console.error('录音失败', e);
    });

    // 创建节流函数，每秒执行一次
    setCountDownTime(VOICE_TIMEOUT);
    // 启动倒计时
    window.countdownInterval = setInterval(updateCountDown, 1000);
  }

  const handleAudioCancel = async () => {
    console.log('handleAudioCancel');
    finishAll();
  }

  const handleAudioTextConfirm = async () => {
    console.log('handleAudioTextConfirm');
    // handleSendText(currentVoiceText + currentLoadingVoiceText)
    setSendText(voiceTextRef.current + loadingVoiceTextRef.current);
    finishAll();
  }

  const handleTextCopy = (text) => {
    copy(text);
    message.info("复制成功");
  };

  const handleTextPlay = async (text) => {
    console.log('handleTextPlay', text);
    const [err, res] = await to(connectAndStartSynthesis());
    if (err || res !== 0) {
      console.error('连接异常', err, res);
      message.error('连接异常');
      return;
    }
    sendRunSynthesis(text);
  };

  return (
    <>
      <div className="chat-wrap">
        <ActionSheet
            onClose={() => setActionVisible(false)}
            actions={actions}
            visible={actionVisible}
        />

        <div className="chat-header">
          <h1>AI家庭顾问</h1>
          <p className="tip">
            <img src={chatStatusOnlineUrl} alt="在线"/>
            <span>【{familyInfo.name}】家庭</span>（{familyInfo.code}）
          </p>
          <p className="tip-pc">
            <span className="s1">【{familyInfo.name}】家庭</span>
            <span className="s2">{familyInfo.code}</span>
          </p>
          <div className="opt-wrap">
            {/*<img src={iconAlertUrl} alt="" onClick={() => navigate("/user-feedback")}/>*/}
            {/*<img src={iconShareUrl} alt="" onClick={() => navigate("/family-info")}/>*/}
            <MoreOutline className="opt-wrap-setting" onClick={() => {
              setActionVisible(true)
            }}/>
          </div>

          <div>
            <div
                className="opt-export-wrap opt-export-wrap-1"
                onClick={mixLoginJump}
            >
              退出登录 / Sign Out
            </div>
            <div
                className="opt-export-wrap opt-export-wrap-2"
                onClick={exportChatRecords}
            >
              导出聊天记录 / Export Chat
            </div>
            <div
                className="opt-export-wrap opt-export-wrap-3"
                onClick={handleGenerateReport}
            >
              {reportGenerating ? <DotLoading/> : null}生成分析报告 / Generate Report
            </div>
            <div
                className="opt-export-wrap opt-export-wrap-4"
                onClick={exportReport}
            >
              查看分析报告 / View Report
            </div>
          </div>
        </div>
        <div className="chat-info" ref={chatInfoRef}>
          {chatInfoList.map(({role, content}, index) => {
            const roleInfo = getRoleInfo(role === 'assistant' ? role : currentUserRole);

            if (showInPcMode) {
              const menu = (
                  <Menu onClick={item => {
                    console.log(item);
                    if(item.key === 'copy') {
                      handleTextCopy(content)
                    }
                    if(item.key === 'play') {
                      handleTextPlay(content)
                    }
                  }}>
                    {/*<Menu.Item key="edit">编辑内容</Menu.Item>*/}
                    <Menu.Item key="copy">复制 / Copy</Menu.Item>
                    <Menu.Item key="play">播放 / Play</Menu.Item>
                  </Menu>
              );
              return (
                  <div key={index} className={`chat-info-item chat-info-item-${roleInfo.roleType}`}>
                    <img src={roleInfo.imgUrl} alt="头像"/>
                    <Dropdown overlay={menu} trigger="click">
                      <ChatItem
                          onClick={() => {}}
                          content={content}
                          onReportClick={exportReport}
                      />
                    </Dropdown>
                  </div>
              );
            }

            return (
                <div key={index} className={`chat-info-item chat-info-item-${roleInfo.roleType}`}>
                  <img
                      src={roleInfo.imgUrl}
                      alt="头像"
                  />
                  <Popover.Menu
                      ref={ref => chatItemRefs[index] = ref}
                      actions={[
                        {
                          key: 'copy',
                          text: '复制 / Copy',
                          onClick: () => handleTextCopy(content)
                        },
                        {
                          key: 'play',
                          text: '播放 / Play',
                          onClick: () => {
                            handleTextPlay(content)
                          }
                        }
                      ]}
                      trigger="click"
                  >
                    <ChatItem
                      content={content}
                      onReportClick={() => exportReport(index)}
                    />
                  </Popover.Menu>

                </div>
            );
          })}

          {(currentQuestionSuggestions && currentQuestionSuggestions.length) ? (
              <div className="chat-info-question-suggest">
                {currentQuestionSuggestions.map((suggestInfo, index) => {
                  return (
                      <div
                          className="suggest-item"
                          key={index}
                          onClick={() => {
                            handleSuggestItemClick(suggestInfo);
                          }}
                      >
                        {suggestInfo.suggest}
                      </div>
                  );
                })}
              </div>
          ) : null}
        </div>

        <div className="chat-info-bg"></div>
        <div className={classNames({
          'chat-footer-audio': true,
          'chat-footer-audio-open': currentVoiceStatus === VOICE_STATUS.RECORDING || currentVoiceStatus === VOICE_STATUS.RECORDED,
        })}>
          <CloseCircleOutline
              className="audio-btn audio-btn-close"
              onClick={handleAudioCancel}
          />
          <div className="audio-timer">
            {currentVoiceStatus === VOICE_STATUS.RECORDING && (
              <span>{countDownTime / 1000} 秒</span>
            )}
          </div>
          <CheckOutline
              className="audio-btn audio-btn-send"
              onClick={handleAudioTextConfirm}
          />
          <div className="audio-message">
            {(currentVoiceText || currentLoadingVoiceText) ?
                <span>{currentVoiceText}{currentLoadingVoiceText}</span> : <DotLoading/>}
          </div>
          {/*<div className="audio-loadng"></div>*/}
          {/*<div className="audio-record">*/}
          {/*  <img src={iconRecordUrl} alt="录音"/>*/}
          {/*</div>*/}
        </div>

        <div className="chat-footer">
          <img
              style={{display: !showInPcMode && currentVoiceStatus !== VOICE_STATUS.RECORDING && !sendText  ? 'inline-block' : 'none'}}
              className="icon-chat"
              src={iconChatUrl} alt=""
              onClick={() => {
                handleAudioPrepare();
              }}
          />
          {!showInPcMode && (
              <input
                  readOnly={(currentQuestionSuggestions && currentQuestionSuggestions.length) || currentVoiceStatus !== VOICE_STATUS.NONE}
                  className="footer-text-area"
                  type="text"
                  value={sendText}
                  onChange={e => setSendText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((currentQuestionSuggestions && currentQuestionSuggestions.length) || currentVoiceStatus !== VOICE_STATUS.NONE) {
                      return;
                    }
                    handleKeyDown(e);
                  }}
                  onTouchStart={() => {
                    console.log('onTouchStart', currentVoiceStatus);
                    if (currentVoiceStatus === VOICE_STATUS.CONNECTED) {
                      handleAudioStart();
                    }
                  }}
                  // onClick={() => {
                  //   console.log('onClick', currentVoiceStatus);
                  //   if (currentVoiceStatus === VOICE_STATUS.CONNECTED) {
                  //     handleAudioStart();
                  //   }
                  // }}
                  // onTouchEnd={() => {
                  //   if(currentVoiceStatus === VOICE_STATUS.RECORDING) {
                  //     handleAudioEnd();
                  //   }
                  // }}
                  // onTouchCancel={() => {
                  //   if(currentVoiceStatus === VOICE_STATUS.RECORDING) {
                  //     handleAudioEnd();
                  //   }
                  // }}
                  placeholder={currentVoiceStatus !== VOICE_STATUS.NONE ? '按住说话 / Hold to Talk' : '请输入你想说的话 / Type a message'}
                  // placeholder="请输入你想说的话"
              />
          )}
          {showInPcMode && (
              <TextArea
                  disabled={currentQuestionSuggestions && currentQuestionSuggestions.length}
                  className="footer-text-area"
                  value={sendText}
                  placeholder="Shift+Enter 换行，Enter 发送 / Shift+Enter for newline, Enter to send"
                  onChange={value => setSendText(value)}
                  onKeyDown={handleKeyDown}
              />
          )}
          <img
              className="icon-send"
              src={iconSendUrl}
              alt=""
              onClick={() => handleSendText()}
          />
        </div>
      </div>
    </>
  );

}
