import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import listPlugin from "@fullcalendar/list";
import "./css/jobcalendar.css";
import Buttons from "./Buttons";
import axios from "axios";

// https://fullcalendar.io/docs/google-calendar
export default function Jobcalendar() {
    const [calendarList, setCalendarList] = useState([]); //가져온 일정 정보를 담아두는곳

    let isSubmittingLoad = false;
    const getCalendarList = () => {
        if (isSubmittingLoad) {
            // 이미 호출이 진행 중인 경우 중복 호출 방지
            return;
        }
        isSubmittingLoad = true; // 호출 시작 시 상태 값 변경

        axios
            .get(`http://localhost/job/jobcalendar`)
            .then(function (res) {
                // 서버로부터 응답을 받았을 때 처리할 로직 구현
                console.log(res.data.list);
                setCalendarList(res.data.list.list);
                console.log("////확인 " + calendarList);
            })
            .catch(function (err) {
                alert(err);
            })
            .finally(() => {
                isSubmittingLoad = false; // 호출이 완료되면 상태 값 변경
            });
    };

    useEffect(() => {
        // 컴포넌트가 마운트되었을 때 서버에서 캘린더 데이터를 가져옴
        getCalendarList();
    }, []);

    const buttons1 = [
        { to: "/joblist", label: "채용공고" },
        { to: "/jobcalendar", label: "채용일정" },
    ];
    const buttons2 = [{ to: "/registration", label: "기업회원" }];

    return (
        <>
            <div className="buttons-container">
                <Buttons buttons={buttons1} />
                <Buttons buttons={buttons2} />
            </div>
            <div className="calendarWrap">
                <FullCalendar
                    plugins={[dayGridPlugin, listPlugin, googleCalendarPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prevYear,prev,next,nextYear today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek,listMonth",
                    }}
                    locale="ko"
                    selectable="true"
                    googleCalendarApiKey={
                        "AIzaSyA4sMpvdtBxjvJtYO6NYRMhJzMHdmOtuLc"
                    }
                    // events={{
                    //     googleCalendarId: "kwonhn1@gmail.com",
                    // }}

                    events={calendarList.map((event) => ({
                        seq: event.seq, //seq도 가져옴
                        title: event.comname,
                        start: event.startline,
                        content: event.content,

                        // end: event.deadline,
                    }))}
                    eventClick={(info) => {
                        // 이벤트 클릭 시 해당 공고 디테일페이지로 이동
                        console.log(info.event.extendedProps.seq);
                        window.location.href = `http://localhost:3000/jobdetail/${info.event.extendedProps.seq}`;
                    }}
                    eventDisplay={"block"}
                    eventTextColor={"#FFF"}
                    eventColor={"#3296D7"}
                    height={"660px"}
                    Toolbar
                />
            </div>
        </>
    );
}
