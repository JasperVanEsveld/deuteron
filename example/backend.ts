let received = 0;

// @ts-ignore
window.webview.onMessage((message) => {
  received++;
  // @ts-ignore
  window.webview.send(`Message #${received}: ${message}`);
});
