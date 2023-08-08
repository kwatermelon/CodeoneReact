import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Modal from 'react-modal';
import axios from 'axios';
import AppLayout from '../AppLayout';
import './css/calendar.css';
import moment from 'moment';
import SweetAlert from "sweetalert2";

function Calendar(){
  let history = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenDetail, setmodalIsOpenDetail] = useState(false);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const [seq, setSeq] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [calendarList, setCalendarList] = useState([]);
  const [getevents, setGetEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);


  // 아이디불러오기
  const userId = localStorage.getItem('userId');
  console.log(userId);
  const userSeq = localStorage.getItem('userSeq');
  console.log(userSeq);

  if (userId === null) {
    SweetAlert.fire({
      title:"먼저 로그인을 해주십시오.",
      confirmButtonText:'확인'
    }).then(result=>{
      if(result.isConfirmed){
        window.location.href = "http://localhost:3000/login";
      }
    });
    
  }
  

  // 일자를 선택했을 때
  const handleDateSelect = (info) => {
    setStartDate(info.startStr);
    // 선택한 종료일자를 하루 전으로 계산하여 설정
    const endDate = new Date(info.endStr);
    endDate.setDate(endDate.getDate() - 1);
    setEndDate(endDate.toISOString().split('T')[0]);
    setModalIsOpen(true);
  };

  // 일정을 선택했을 때
  const handleEventClick = (info) => {
    const event = info.event;
    console.log("이벤트 확인중"+JSON.stringify(event));
    if(event.extendedProps.comdel === 0){
      window.location.href = `http://localhost:3000/jobdetail/${info.event.extendedProps.detailseq}`;
    }else if(event.extendedProps.studydetailseq != null){
      window.location.href = `http://localhost:3000/studygroup`;
    }else if(event.extendedProps.seq !== null){
      setSelectedEvent(event); // 선택된 이벤트 정보 저장
      setSeq(event.extendedProps.seq);
      setStartDate(event.startStr.substring(0, 10));
      setEndDate(event.endStr.substring(0, 10));
      setTitle(event.title);
      setContent(event.extendedProps.content);
      setStartTime(event.start.toLocaleTimeString());
      setEndTime(event.end.toLocaleTimeString());
    
      const fcPopover = document.querySelector('.fc-popover');
      if(fcPopover){
        fcPopover.style.opacity = 0;  
      }
    
      //일정조회 모달 열기
      setmodalIsOpenDetail(true);
    }
    
  };

  // 모달 닫기
  const closeModal = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setTitle('');
    setContent('');
    setAllDay(false);
    setModalIsOpen(false);
    setmodalIsOpenDetail(false);
  };

  // 일정 달력에 불러오기
  
  let isSubmittingLoad = false;
  const getEvents = () => {
    if (isSubmittingLoad) {
      // 이미 호출이 진행 중인 경우 중복 호출 방지
      return;
    }
    isSubmittingLoad = true; // 호출 시작 시 상태 값 변경
  
    Promise.all([
      axios.get(`http://localhost/getCalendarList?id=${userId}`),
      axios.get(`http://localhost/job/getCalendarjobList?id=${userId}`),
      axios.get(`http://localhost/studygroup/getLikedInfo?seq=${userSeq}`)
    ])
      .then(function (res) {
        console.log(res[0].data, res[1].data, res[2].data);
        const getevents = [
          ...res[0].data.list,
          ...res[1].data.list.map((event, index) => ({
            ...event,
            start: event.deadline,
            deadline: undefined,
            title: event.comname,
            detailseq: event.seq,
            seq: undefined
          })),
          ...res[2].data.list.map((study, index) => ({
            ...study,
            start: study.deadlineForRecruitment,
            deadlineForRecruitment: undefined,
            title: study.title,
            studydetailseq: study.seq,
            seq: undefined
          })),
        ];
        setGetEvents(getevents);
        //setEvents([...res[0].data.list, ...res[1].data.list]);
      })
      .catch(function (err) {
        console.log(err);
      })
      .finally(() => {
        isSubmittingLoad = false;
      });
  };
  
  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 서버에서 캘린더 데이터를 가져옴
    getEvents();
  }, []);


  // 카카오톡 알림

  function kakaoMessage() {
    

    const accessToken = 'rnKfo8PHO2x1F0yevPm1uDPjYTv5-pZNur57BqBTCj1ylwAAAYgtBIrf';
    const url = "https://kapi.kakao.com/v2/api/talk/memo/send";
    
    // 사용자 토큰
    const headers = {
    "Authorization": 'Bearer ' + accessToken,
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    
    const events = getevents.filter(event => {
      const eventDate = new Date(event.start); // 이벤트의 시작일
      const today = new Date(); // 오늘 날짜
      // 이벤트의 시작 시간과 현재 시간 차이 계산 
      const timeDiff = Math.abs(eventDate.getTime() - today.getTime());
      const diffInMinutes = Math.ceil(timeDiff / (1000 * 60));     
      // 오늘의 이벤트 중 시작 시간이 현재 시간보다 15분 이내인 이벤트 필터링
      return eventDate.toDateString() === today.toDateString() && diffInMinutes == 15;
     });
  
  if(events.length > 0){ // 일정이 있을경우 메세지 전송
    let text = "";
    let calendarTitle = "";
    for (const event of events) { // 반복문을 통해 해당일의 모든 일정 반환
      const start = new Date(event.start);
      const end = new Date(event.end);
      const startDate = start.toLocaleDateString();
      const endDate = end.toLocaleDateString();
      const startTime = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const endTime = end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const title = event.title;
      const content = event.content;
      text += `내용: ${content}\n시간: ${startTime}~${endTime}`;
      calendarTitle += `${title}`;
    }


    // 메시지에 담을 데이터
    const data = {
        "template_id": 93321,
        "template_args": JSON.stringify({
          "title": calendarTitle,
          "content": text
        })
    };
  
    axios.post(url, data, {headers, withCredentials: false})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    } else {
        console.log("오늘 일정이 없습니다.");
      }      
    }

    setInterval(kakaoMessage, 60 * 1000);
    useEffect(() => {
      kakaoMessage();
    }, []);

  
  // 일정 작성
  let isSubmitting = false; // 중복 호출 방지를 위한 상태 값
  const writeCalendar = (e) => {

    const startDateTime = startDate + 'T' + startTime + ':00'; // startDate와 startTime 값을 합쳐서 올바른 형식의 날짜 및 시간 값 생성
    const endDateTime = endDate + 'T' + endTime + ':00'; // endDate와 endTime 값을 합쳐서 올바른 형식의 날짜 및 시간 값 생성
    const params = {
      id: userId,
      title: title,
      content: content,
      start: startDateTime,
      end: endDateTime,
      allDay: allDay ? 1 : 0,
      backgroundColor: backgroundColor,
      textColor: "white"
    };
    //e.preventDefault(); //이벤트의 기본 동작을 취소하는 함수
    if (isSubmitting) {
      // 이미 호출이 진행 중인 경우 중복 호출 방지
      return;
    }
    isSubmitting = true; // 호출 시작 시 상태 값 변경

    if(title === undefined || title.trim() === ''){
        alert('제목을 입력해 주십시오');
        return;
    }
    if(content === undefined || content.trim() === ''){
        alert('내용을 입력해 주십시오');
        return;
    }
    if(startDate === undefined || startDate.trim() === ''){
        alert('시작일을 입력해 주십시오');
        return;
    }
    if(endDate === undefined || endDate.trim() === ''){
        alert('종료일을 입력해 주십시오');
        return;
    }
    if(startTime === undefined || startTime.trim() === ''){
        alert('시작시간을 입력해 주십시오');
        return;
    }
    if(endTime === undefined || endTime.trim() === ''){
        alert('종료시간을 입력해 주십시오');
        return;
    }
    if (startDate === endDate && startTime >= endTime) {
        alert("종료시간은 시작시간 이후로 설정해야합니다");
        return;
    }
    if (startDate > endDate) {
        alert("종료일은 시작일 이후로 설정해야합니다");
        return;
    }
    if(backgroundColor === undefined || backgroundColor.trim() === ''){
      alert('색상을 선택해주십시오');
      return;
    }
  

    axios.post('http://localhost/writeCalendar', null, {params}) // 데이터를 직접 전달
      .then(res => {
          // 서버로부터 응답을 받았을 때 처리할 로직 구현
          console.log(res.data);
        
          SweetAlert.fire("성공적으로 등록되었습니다");
           
          // 상태 초기화
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');
          setTitle('');
          setContent('');
          setAllDay(false);
          setBackgroundColor('');  
          
          getEvents(); // 캘린더 다시 불러오기
          setModalIsOpen(false); //작성 모달창 닫기

        
      })
      .catch(function(err){
        alert("등록되지 않았습니다");
          // 상태 초기화
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');
          setTitle('');
          setContent('');
          setAllDay(false);
          setBackgroundColor('');  

          setModalIsOpen(false);
      }) 
      .finally(() => {
        isSubmitting = false; // 호출이 완료되면 상태 값 변경
      }); 
  };

  // 일정 수정
  let isSubmittingUpdate = false; // 중복 호출 방지를 위한 상태 값
  const updateCalendar = (e) => {

    const startDateTime = startDate + 'T' + startTime + ':00'; // startDate와 startTime 값을 합쳐서 올바른 형식의 날짜 및 시간 값 생성
    const endDateTime = endDate + 'T' + endTime + ':00'; // endDate와 endTime 값을 합쳐서 올바른 형식의 날짜 및 시간 값 생성
    const params = {
      "seq": seq,
      "id": userId,
      "title": title,
      "content": content,
      "start": startDateTime,
      "end": endDateTime,
      "allDay": allDay ? 1 : 0,
      "backgroundColor": backgroundColor,
      "textColor": "white"
    };
    //e.preventDefault(); //이벤트의 기본 동작을 취소하는 함수
    if (isSubmittingUpdate) {
      // 이미 호출이 진행 중인 경우 중복 호출 방지
      return;
    }
    isSubmittingUpdate = true; // 호출 시작 시 상태 값 변경

    if(title === undefined || title.trim() === ''){
        alert('제목을 입력해 주십시오');
        return;
    }
    if(content === undefined || content.trim() === ''){
        alert('내용을 입력해 주십시오');
        return;
    }
    if(startDate === undefined || startDate.trim() === ''){
        alert('시작일을 입력해 주십시오');
        return;
    }
    if(endDate === undefined || endDate.trim() === ''){
        alert('종료일을 입력해 주십시오');
        return;
    }
    if(startTime === undefined || startTime.trim() === ''){
        alert('시작시간을 입력해 주십시오');
        return;
    }
    if(endTime === undefined || endTime.trim() === ''){
        alert('종료시간을 입력해 주십시오');
        return;
    }
    if (startDate > endDate) {
        alert("종료일은 시작일 이후로 설정해야합니다");
        return;
    }
    if (startDate === endDate && startTime >= endTime) {
        alert("종료시간은 시작시간 이후로 설정해야합니다");
        return;
    }
    if(backgroundColor === undefined || backgroundColor.trim() === ''){
      alert('색상을 선택해주십시오');
      return;
    }
  

    axios.post('http://localhost/updateCalendar', null, {params}) // 데이터를 직접 전달
      .then(res => {
        // 서버로부터 응답을 받았을 때 처리할 로직 구현
        console.log(res.data);
        
        SweetAlert.fire("성공적으로 수정되었습니다");

          // 상태 초기화
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');
          setTitle('');
          setContent('');
          setAllDay(false);
          setBackgroundColor('');
          
          getEvents();  
          setmodalIsOpenDetail(false); //일정조회모달 닫기
          setModalIsOpenEdit(false);  //일정수정모달 닫기   

        
      })
      .catch(function(err){
        alert("수정되지 않았습니다");
          // 상태 초기화
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');
          setTitle('');
          setContent('');
          setAllDay(false);
          setmodalIsOpenDetail(false); //일정조회모달 닫기
          setModalIsOpenEdit(false);  //일정수정모달 닫기 
      }) 
      .finally(() => {
        isSubmittingUpdate = false; // 호출이 완료되면 상태 값 변경
      }); 
  };

  // 드래그로 일정 수정
  function updateDrag(event){
    console.log("이벤트 확인" + JSON.stringify(event.event))

    const startDateTime = moment(event.event.start).format('YYYY-MM-DD HH:mm:ss');
    const endDateTime = moment(event.event.end).format('YYYY-MM-DD HH:mm:ss');
  
    const params = {
      "seq": event.event.extendedProps.seq,
      "title": event.event.title,
      "content": event.event.extendedProps.content,
      "start": startDateTime,
      "end": endDateTime,
      "allDay": allDay ? 1 : 0,
      "backgroundColor": event.event.backgroundColor,
      "textColor": "white"
    };
    
    console.log("params" + JSON.stringify(params))
  
    
      axios.post('http://localhost/updateCalendar', null, {params}) // 데이터를 직접 전달
      .then(res => {
        // 서버로부터 응답을 받았을 때 처리할 로직 구현
        console.log(res.data);    
        SweetAlert.fire("성공적으로 수정되었습니다");
          getEvents();
      })
      .catch(function(err){
        alert("수정되지 않았습니다");
        console.log(err);
      })
  }
  
  // 일정 삭제
  function handleDelete() {
    SweetAlert.fire({
      title: '게시글을 삭제하시겠습니까?',
      text: "삭제하시면 다시 복구시킬 수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.value){
        axios.delete('http://localhost/deleteCalendar', {params:{"seq":seq}})
    
        .then(response => {
          if (response.status === 200) {
            SweetAlert.fire('일정이 삭제되었습니다.');
            
            // 상태 초기화
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
            setTitle('');
            setContent('');
            setAllDay(false);
            setBackgroundColor('');
  
            getEvents();  
            setmodalIsOpenDetail(false); 
          } 
        })
        .catch(error => {
          console.error(error);
          alert('일정 삭제에 실패했습니다.');
        });
      }
    })
    
  }
  
  return (
    <div className="App">
      <div className="calendarWrap">
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,listMonth',
          }}
          locale= "ko"
          selectable="true"
          events={getevents.map(event => ({
            seq: event.seq,
            title: event.title,
            start: event.start,
            content: event.content,
            end: event.end,
            color: event.backgroundColor,
            textColor: event.textColor,
            comdel:event.comdel,
            detailseq:event.detailseq,
            studydetailseq: event.studydetailseq
          }))}
          eventColor= "black"
          select={handleDateSelect} 
          eventClick={handleEventClick}
          dayMaxEventRows={4} // 일정 최대 4개만 보여주고 나머지 +로 보여짐
          editable="true"
          eventDrop={updateDrag}
        />
      </div>

      {/* 일정 작성 모달 */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Add Event Modal" style={{height: '600px'}}>
          <div className='writeModal'>
            <h2>일정추가</h2>
            <form>
              <div className='date'>
                <label> 시작일: </label>
                <input className='startDate' type="date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>~</span>
                <label> 종료일: </label>
                <input className='endDate' type="date" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className='time'>
                <label> 시작시간: </label>
                {!allDay && <input className='startTime' type="time" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />}
                {allDay && <input className='startTime' type="time" name="startTime" value="00:00" readOnly />}
                <span>~</span>
                <label> 종료시간: </label>
                {!allDay && <input className='endTime' type="time" name="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />}
                {allDay && <input className='endTime' type="time" name="endTime" value="23:59" readOnly />}
                <label>&nbsp; 종일: </label>
                <input className='allDay' type="checkbox" name="allDay" checked={allDay} onChange={(e) => {setAllDay(e.target.checked);
                  if(e.target.checked) {
                    // 종일이 선택될 경우 시작시간은 00:00, 종료시간은 23:59로 설정
                    setStartTime("00:00");
                    setEndTime("23:59");
                  }
                }} /> 
              </div>
              <div className='titleWrap'>
                <label> 제목: </label>
                <input className='title' type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className='contentWrap'>
                <label> 내용: </label>
                <textarea className='content' name="content" value={content} onChange={(e) => setContent(e.target.value)}/>
              </div>
              <div className='colorWrap'>
                <label className="control-label" for="inputPatient">Color:</label>
                <div className="color">
                      <input className='color1' type="radio" name="backgroundColor" value="#FF5C55" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color2' type="radio" name="backgroundColor" value="#71abf8" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color3' type="radio" name="backgroundColor" value="#05c545" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color4' type="radio" name="backgroundColor" value="#f5dd03" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color5' type="radio" name="backgroundColor" value="#caa3ef" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color6' type="radio" name="backgroundColor" value="#feb9c8" onChange={(e)=>setBackgroundColor(e.target.value)} />              

              </div>
              </div>
            </form>
            <div className='btnWrap'>
              <button className='write' type="button" onClick={writeCalendar}>완료</button>
              <button className='cancel' onClick={closeModal}>취소</button>
            </div>
          </div>
      </Modal>

      {/* 일정 보기 모달 */}
      <Modal isOpen={modalIsOpenDetail} onRequestClose={closeModal} contentLabel="Event Detail Modal">
          <div className='viewModal'>
            <h2 className='title'>{title}</h2>
              <br/>
              <form>
              <label className='date'>
                기간:&nbsp; <span>{startDate}</span>
                {startDate !== endDate && <>&nbsp;~&nbsp; <span>{endDate}</span></>}
              </label>

              <br />
              <label className='time'>
                시간: &nbsp; <span>{startTime.slice(0, -3)}</span>&nbsp;~&nbsp;<span>{endTime.slice(0, -3)}</span>
              </label>
              <br />
              <label className='content'>
                내용: &nbsp; <span>{content}</span>
              </label>
              <br /><br />
              </form>
              <div className='btnWrap'>
                <button className='update' onClick={() => setModalIsOpenEdit(true)}>수정</button>&nbsp;&nbsp;
                <button className='delete' onClick={handleDelete}>삭제</button>&nbsp;&nbsp;
                <button className='cancel' onClick={closeModal}>취소</button>
              </div>

          </div>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal isOpen={modalIsOpenEdit} onRequestClose={()=>setModalIsOpenEdit(false)} contentLabel="Edit Event Modal">
      <div className='writeModal'>
            <h2>일정수정</h2>
            <form>
              <div className='date'>
                <label> 시작일: </label>
                <input className='startDate' type="date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>~</span>
                <label> 종료일: </label>
                <input className='endDate' type="date" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className='time'>
                <label> 시작시간: </label>
                {!allDay && <input className='startTime' type="time" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />}
                {allDay && <input className='startTime' type="time" name="startTime" value="00:00" readOnly />}
                <span>~</span>
                <label> 종료시간: </label>
                {!allDay && <input className='endTime' type="time" name="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />}
                {allDay && <input className='endTime' type="time" name="endTime" value="23:59" readOnly />}
                <label>&nbsp; 종일: </label>
                <input className='allDay' type="checkbox" name="allDay" checked={allDay} onChange={(e) => {setAllDay(e.target.checked);
                  if(e.target.checked) {
                    // 종일이 선택될 경우 시작시간은 00:00, 종료시간은 23:59로 설정
                    setStartTime("00:00");
                    setEndTime("23:59");
                  }
                }} /> 
              </div>
              <div className='titleWrap'>
                <label> 제목: </label>
                <input className='title' type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className='contentWrap'>
                <label> 내용: </label>
                <textarea className='content' name="content" value={content} onChange={(e) => setContent(e.target.value)}/>
              </div>
              <div className='colorWrap'>
                <label className="control-label" for="inputPatient">Color:</label>
                <div className="color">
                      <input className='color1' type="radio" name="backgroundColor" value="#FF5C55" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color2' type="radio" name="backgroundColor" value="#71abf8" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color3' type="radio" name="backgroundColor" value="#05c545" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color4' type="radio" name="backgroundColor" value="#f5dd03" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color5' type="radio" name="backgroundColor" value="#caa3ef" onChange={(e)=>setBackgroundColor(e.target.value)} />              
                      <input className='color6' type="radio" name="backgroundColor" value="#feb9c8" onChange={(e)=>setBackgroundColor(e.target.value)} />              

              </div>
              </div>
            </form>
            <div className='btnWrap'>
              <button className='write' type="button" onClick={updateCalendar}>수정</button>
              <button className='cancel' onClick={()=>setModalIsOpenEdit(false)}>취소</button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default Calendar;