import { API_KEY, API_URL, TIMEOUT_SEC } from "./config.js";

// history: [
//   { msg: "user 1", type: "msgInput" },
//   { msg: "ai 1", type: "aiResponse" },
//   { msg: "user 2", type: "msgInput" },
//   { msg: "ai 2", type: "error" },
//   { msg: "user 3", type: "msgInput" },
//   { msg: "user 1", type: "msgInput" },
//   { msg: "ai 1", type: "aiResponse" },
//   { msg: "user 2", type: "msgInput" },
//   { msg: "ai 2", type: "error" },
//   { msg: "user 3", type: "msgInput" },
// ]
export const state = {
  history: JSON.parse(localStorage.getItem(`history`)) || [],
};
function persistHistory() {
  localStorage.setItem(`history`, JSON.stringify(state.history));
}
export function saveChat(msg, type) {
  state.history.push({ msg, type });
  persistHistory();
}

export function clearChat() {
    // delete all chat elements from histroy array & local storage
  state.history = [];
  persistHistory();
}

function timeout(sec){
  return new Promise ((_,reject)=>{
    setTimeout(()=>{
      reject(new Error(`Oops! response taking too much time, timeout after ${sec} seconds`));
    },sec*1000);
  });
}
export async function getResponse(msg) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
    }),
  };

  // request to get response
  try {
    const responsePromise = await fetch(API_URL, requestOptions);
    const result = await Promise.race([responsePromise,timeout(TIMEOUT_SEC)]);
    const data = await result.json();

    const response = data.choices[0].message.content;
    return response;
  } catch (error) {
    throw error;
  }
}
