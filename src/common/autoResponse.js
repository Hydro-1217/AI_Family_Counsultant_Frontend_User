const setRemUnit = () => {
  const baseHtmlFontSize = 14; // html font size 基准
  const baseDesignWidth = 375; // 设计稿宽度
  const maxDesignWidth = 750;
  const html = document.documentElement;
  let clientWidth = html.clientWidth;
  if (!clientWidth) return;
  if (clientWidth > maxDesignWidth) {
    clientWidth = maxDesignWidth;
  }
  html.style.fontSize = `${(clientWidth / baseDesignWidth) * baseHtmlFontSize}px`;
}

// 动态设置 html 标签的 fontSize
export function h5PageAutoResponse() {
  setRemUnit();
  window.addEventListener('resize', setRemUnit);
}