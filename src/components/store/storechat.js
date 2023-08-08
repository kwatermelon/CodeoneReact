import { useState, useEffect } from 'react';

function Chat() {

  // 로그인정보 가져오기
  let id = window.localStorage.getItem("userId");
  console.log(id);

  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const roomid = "room1";
  const CurrentUser = id;

  console.log(CurrentUser);

  useEffect(() => {
    console.log(`Opening WebSocket for room ${roomid}`);
    //const ws = new WebSocket(`ws://localhost/ws/chat/${roomid}`);
    const ws = new WebSocket('ws://localhost/ws/chat');
    setWebSocket(ws);
    
    // WebSocket이 열릴 때 onOpen 함수가 호출됩니다.
    ws.onopen = () => {
        const message = CurrentUser + ": 님이 입장하셨습니다.";
        ws.send(message);
    };

    // 메세지 받아오기
    // ws.onmessage = (event) => {
    //     const message = event.data;
    //     setMessages(prevMessages => [...prevMessages, message]);
    // };

    // 메세지 받아오기
    ws.onmessage = (event) => {
        const message = event.data;
        let sessionId = null;
        let msg = null;
        const arr = message.split(/:/);
        sessionId = arr[0].trim();     // 메세지 보낸사람 id
        if (arr[1] === undefined) {
          msg = '';                 // 없으면 빈칸
        } else {
          msg = arr[1].trim();      // 메세지내용
        }
        setMessages((prevMessages) => [
            ...prevMessages,
            { sessionId: sessionId, message: msg },
          ]);

        if(sessionId === CurrentUser){
            setMessages((prevMessages) => [
              ...prevMessages,
              { sessionId: sessionId, message: msg, align: 'right' },
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sessionId: sessionId, message: msg, align: 'left' },
            ]);
          }
      };

//     console.log('sessionID: ' + sessionId);
//     console.log('cur_session: ' + curSession);

//      // 로그인 한 클라이언트
//      if (sessionId === curSession) {
//         let str = "<div class='col-12'>";
//         str += "<div class='alert alert-primary style='word-break:break-all;''>";
//         if (msg === '') {
//         str += '<b>' + sessionId;
//         } else {
//         str += '<b>' + sessionId + ': ' + msg + '</b>';
//         }
//         str += '</div></div>';
//     //   document.querySelector('#msgArea').innerHTML += str;
//     }

//     // 타 클라이언트
//     else {
//         let str = "<div class='col-12'>";
//         str += "<div class='alert alert-warning' style='word-break:break-all;'>";
//         if (msg === '') {
//           str += '<b>' + sessionId;
//         } else {
//           str += '<b>' + sessionId + ': ' + msg + '</b>';
//         }
//         str += '</div></div>';
//       //   document.querySelector('#msgArea').innerHTML += str;
//       }
// };
    

    return () => {
      ws.close();      
    };
  }, []);

 

  // 닫을때
  const onClose = () => {
    if (webSocket) { // webSocket 상태가 null이 아닌 경우에만 실행
        const message = CurrentUser + ": 님이 방을 나가셨습니다.";
        webSocket.send(message);

        // 연결 끊기
        // webSocket.close();  
      }
      
  };

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:3000/ws/chat");

//     ws.onmessage = (event) => {
//       const message = event.data;
//       setMessages(prevMessages => [...prevMessages, message]);
//     };

//     // 채팅방 켰을때
//     ws.onopen = () => {
//       const message = CurrentUser + ": 님이 입장하셨습니다.";
//       ws.send(message);
//     };
    
//     // ws.onclose = () => {
//     //   const message = username + ": 님이 방을 나가셨습니다.";
//     //   ws.send(message);
//     // };

//     setWebSocket(ws);

//     return () => {
//       if (webSocket) {
//         const message = CurrentUser + ": 님이 방을 나가셨습니다.";
//         webSocket.send(message);
//         webSocket.close();
//       }
//     };
//   }, []);

  // input 내용 메세지로 보내고 input창 비워주기
  const handleSubmit = (event) => {
    event.preventDefault();
    const message = CurrentUser + ":" + input;
    webSocket.send(message);
    setInput('');
  };

  // input창 바뀌는대로 값 바꿔주기
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  function exitBtn(){    
    if (webSocket) { // webSocket 상태가 null이 아닌 경우에만 실행
        const message = CurrentUser + ": 님이 방을 나가셨습니다.";
        webSocket.send(message);
        webSocket.close();
      }
  }

  return (
    <div>
        <h2>채팅</h2>
      {/* <div>        
        {messages.map((message, index) => (
          <div key={index}>
            {message}            
          </div>
        ))}
      </div> */}


        {/* 메세지 랜더링 */}
        {messages.map((message, index) => (
        <div
            key={index}
            className={message.sessionId === CurrentUser ? 'right' : 'left'}
        >
            <div className="message">{message.sessionId+":"+message.message}</div>
        </div>
        ))}

      <input type='text' value={input} onChange={handleInputChange} />
      <button onClick={handleSubmit}>전송</button>
      <button onClick={onClose}>나가기</button>
    </div>
  )
        }
        
export default Chat;
