import axios from "axios";
import React, { useState, useRef } from "react";

import "./Chatbox.css";

function Chatbox() {
    const [umessage, setUmessage] = useState("");
    const scrollRef = useRef();

    function sendBtnClick() {
        // 입력한 문자열을 chatbox 에 추가
        let elementUser = document.createElement("div");
        elementUser.setAttribute("align", "right");

        let element = document.createElement("div");
        element.innerHTML = umessage;
        element.setAttribute("class", "usermsg"); // <div align="right"><div className="usermsg">{umessage}</div></div>

        const chatbox = document.getElementById("chatbox");
        elementUser.appendChild(element);
        chatbox.appendChild(elementUser);
        chatbox.appendChild(document.createElement("br"));

        setUmessage("");

        // 데이터 받기(back-end)
        axios
            .post("http://localhost:/chatBot", null, {
                params: { msg: umessage },
            })
            .then(function (resp) {
                //alert(JSON.stringify(resp.data));
                //alert(resp.data.bubbles[0].type);
                //alert(resp.data.bubbles[0].data.description);

                ChatbotAnswer(resp.data);

                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            })
            .catch(function (err) {
                alert(err);
            });
    }

    function ChatbotAnswer(respData) {
        let type = respData.bubbles[0].type;
        if (type === "text") {
            let element = document.createElement("div");
            element.innerHTML = respData.bubbles[0].data.description;
            element.setAttribute("class", "botmsg");

            const chatbox = document.getElementById("chatbox");
            chatbox.appendChild(element);
            chatbox.appendChild(document.createElement("br"));
        } else if (type === "template") {
            const coverType = respData.bubbles[0].data.cover.type;
            if (coverType === "image") {
                let element = document.createElement("img");

                element.setAttribute(
                    "src",
                    respData.bubbles[0].data.cover.data.imageUrl
                );
                element.setAttribute("width", "200px");
                element.setAttribute("height", "140px");
                element.classList.add("bot-image"); // 이미지에 클래스 추가

                const chatbox = document.getElementById("chatbox");
                chatbox.appendChild(element);
                chatbox.appendChild(document.createElement("br"));

                // title 추가
                let titleElement = document.createElement("div");
                titleElement.innerHTML = respData.bubbles[0].data.cover.title;
                titleElement.setAttribute("class", "bot-title");

                chatbox.appendChild(titleElement);
                chatbox.appendChild(document.createElement("br"));

                // description 추가
                let descriptionElement = document.createElement("div");
                descriptionElement.innerHTML =
                    respData.bubbles[0].data.cover.data.description;
                descriptionElement.setAttribute("class", "botmsg");

                chatbox.appendChild(descriptionElement);
                chatbox.appendChild(document.createElement("br"));
            } else if (coverType === "text") {
                let description =
                    respData.bubbles[0].data.cover.data.description;

                let elementDescription = document.createElement("div");
                elementDescription.innerHTML = description;
                elementDescription.setAttribute("class", "botmsg");

                const chatbox = document.getElementById("chatbox");
                chatbox.appendChild(elementDescription);
                chatbox.appendChild(document.createElement("br"));

                const contentTable = respData.bubbles[0].data.contentTable;
                for (let i = 0; i < contentTable.length; i++) {
                    let row = document.createElement("div");
                    row.setAttribute("class", "row");

                    const rowData = contentTable[i];
                    for (let j = 0; j < rowData.length; j++) {
                        let cell = document.createElement("div");
                        cell.setAttribute("class", "cell");

                        let cellData = rowData[j].data;
                        if (cellData.type === "button") {
                            let button = document.createElement("button");
                            button.innerHTML = cellData.title;
                            button.setAttribute("class", "chatbot-button");
                            button.setAttribute(
                                "data-url",
                                cellData.data.action.data.url
                            );

                            button.addEventListener("click", function () {
                                window.location.href =
                                    button.getAttribute("data-url");
                            });

                            cell.appendChild(button);
                        } else if (cellData.type === "text") {
                            let text = document.createElement("div");
                            text.innerHTML = cellData.text;
                            text.setAttribute("class", "text");

                            cell.appendChild(text);
                        }

                        row.appendChild(cell);
                    }

                    chatbox.appendChild(row);
                }
            }
        }
    }

    return (
        <div className="chatbox-container">
            <div className="chat-wrapper">
                <div className="chat-up">
                    <h3 className="welcome">Code:One</h3>
                </div>

                <div className="chatbox" id="chatbox" ref={scrollRef}></div>

                <div className="myform">
                    <input
                        type="text"
                        className="usermsgwrite"
                        value={umessage}
                        onChange={(e) => setUmessage(e.target.value)}
                        placeholder="무엇이 필요하신가요?"
                    />

                    <input
                        type="button"
                        className="submitmsg"
                        onClick={sendBtnClick}
                        value="send"
                    />
                </div>
            </div>
        </div>
    );
}

export default Chatbox;
