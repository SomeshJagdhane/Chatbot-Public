import view from "./view.js";
import * as model from "./model.js";

function loadHistory(history) {
  if (history.length === 0) return;
  history.forEach((chat) => {
    view.renderChatBox(chat.msg, chat.type, "history");
  });
}
async function controlMsg(inputMsg) {
  if (!inputMsg) return;

  model.saveChat(inputMsg, "msgInput");

  // 1. render inputMsg on chatbox
  view.renderChatBox(inputMsg, "msgInput");

  view.renderLoader();
  // 2. get response from ai
  try {
    const response = await model.getResponse(inputMsg);
    model.saveChat(response, "aiResponse");
    view.renderChatBox(response, "aiResponse");
     
  } catch (error) {
    console.log(error);
    view.renderChatBox(error.message, "error");
  }
  
}

function init() {
  loadHistory(model.state.history);

  view.addHandlerChatBtn();
  view.addHandlerSendMsg(controlMsg);
  view.addHandlerWordCount();
  view.addHandlerClearChat(model.clearChat);
}
init();
