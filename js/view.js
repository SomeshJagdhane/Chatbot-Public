import { MSG_WORD_LIMIT } from "./config.js";
class View {
  _chatBot = document.getElementById(`chatbot`);
  _chatBox = document.getElementById(`chatbox`);
  _sendForm = document.getElementById(`send-form`);
  _chatBtn = document.getElementById(`chat-btn`);

  // this btn will be shown if screen width < 600px
  _mobileCloseBtn = document.getElementById(`btn-close`);

  _bodyEl = document.querySelector(`body`);

  _toggleChatbot() {
    this._bodyEl.classList.toggle(`show-chatbot`);
  }
  _generateMsgMarkup(msg) {
    // generate markup for user sent msg
    return `
            <li class="sent-msg">${msg}</li>      
        `;
  }
  _generateResponseMarkup(msg, error = false) {
    // generate markup for ai generated response
    return `
        <li class="received-msg-section">
            <i class="fa-solid fa-robot"></i>
            <span class="received-msg ${error ? "error" : ""}">${msg}</span>
        </li>
        `;
  }
  renderLoader() {
    const loaderMarkup = `
    <li class="received-msg-section">
        <i class="fa-solid fa-robot"></i>
        <span class="received-msg loader"></span>
    </li>`;
    this._chatBox.insertAdjacentHTML(`beforeend`, loaderMarkup);
  }

  renderChatBox(msg = "", type, showHistory = "no") {
   // scroll down to the bottom of the chatbox
    this._chatBox.scroll({
      left:0,
      top:this._chatBox.clientHeight,
      behavior:'smooth'
    })

    // 1. generate markup based on the msg type
    let msgMarkup;
    switch (type) {
      case "msgInput":
        msgMarkup = this._generateMsgMarkup(msg);
        this._chatBox.insertAdjacentHTML(`beforeend`, msgMarkup);
        
        return;
      case "aiResponse":
        msgMarkup = this._generateResponseMarkup(msg);
        break;
      case "error":
        msgMarkup = this._generateResponseMarkup(msg, true);
        break;
    }

    // if want to render chat history
    if (showHistory === "history") {
      this._chatBox.insertAdjacentHTML(`beforeend`, msgMarkup);
      
      return;
    }

    // if type is aiRsponse or error
    // after few sec remove loader and render response
    setTimeout(() => {
      //remove loader
      this._chatBox.lastElementChild.remove();

      // insert generated markup inside chatbox
      this._chatBox.insertAdjacentHTML(`beforeend`, msgMarkup);

     
    }, 800);
  }

  addHandlerChatBtn() {
    // chatbot open & close functionality
    [this._chatBtn, this._mobileCloseBtn].forEach((el) =>
      el.addEventListener(`click`, this._toggleChatbot.bind(this))
    );
  }
  addHandlerSendMsg(handler) {
    // get input message from user & parse it into handler to send

    this._sendForm.addEventListener(`submit`, function (e) {
      e.preventDefault();
      const inputMsgEl = this.querySelector(`textarea`);
      const inputMsg = inputMsgEl.value;
      inputMsgEl.value = ``;
      handler(inputMsg);
    });
  }
  addHandlerWordCount(){
    const wordWarning = document.getElementById(`word-warning`);
    wordWarning.textContent=`More than ${MSG_WORD_LIMIT} words can't be entered`;

    document.getElementById(`msg-to-send`).addEventListener(`input`,function (e){
      const inputText = this.value;
      const wordArr = inputText.split(` `);
      const wordCount = wordArr.length;


      if(wordCount > MSG_WORD_LIMIT){
        const end= inputText.lastIndexOf(` `);
        const newInputText = inputText.slice(0,end);
        console.log(newInputText);
        this.value = newInputText;

      }
      
    });
  }

  addHandlerClearChat(handler){
    document.getElementById(`btn-clear-chat`).addEventListener(`click`,e=>{
      // delete all chat
      this._chatBox.innerHTML=``;
      handler();
    });
  }
}

export default new View();
