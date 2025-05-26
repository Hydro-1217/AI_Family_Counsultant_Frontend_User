import {marked} from "marked";
import _ from "lodash";

export default function ChatItem(props) {
  // eslint-disable-next-line react/prop-types
  let {content, onReportClick, onClick} = props;
  if(!content) {
    return <span>...</span>;
  }
  const isReportContent = content && content.indexOf('查看报告信息') > 0;
  if (isReportContent) {
    content = (<>分析报告已生成，请<a onClick={onReportClick}>点击查看报告信息</a></>);
  }

  return (
      <>
        {
          isReportContent ?
              <span className="chat-info-message" onClick={onClick}>{content}</span> :
              <span className="chat-info-message" onClick={onClick}
                    dangerouslySetInnerHTML={{__html: marked(_.trim(content))}}></span>
        }
      </>
  );
}