import React, { useEffect, useState } from "react";
import axios from "axios";

import './css/lecturelist.css'; 

import { useNavigate } from "react-router-dom";

// 무한스크롤
import { useInView } from 'react-intersection-observer';

// 좋아요하트
import heart from '../../assets/store/heart.png';
import emptyheart from '../../assets/store/emptyheart.png';


// 알람
import SweetAlert from "sweetalert2";


function LectureList(){

    // 로그인정보 가져오기
    let id = window.localStorage.getItem("userId");
    console.log(id);

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 
    
    // 가입한사람이 관리자인지 확인
    // const auth = login.auth;
    // console.log(auth);

    let history = useNavigate();

    // 무한스크롤
    // const [ref, inView] = useInView();    
    const [isLoading, setIsLoading] = useState(false);

    // option 안쓰면 그냥 0기 default값
    const [ref, inView] = useInView({
        /* Optional options */
    threshold: 0,
    });    

    const [category, setCategory] = useState('');
    const [inputCategory, setInputCategory] = useState('');

    const [lectureList, setLectureList] = useState([]);
    console.log(category);

    const [search, setSearch] = useState('');

    const [page, setPage] = useState(0);
    const [like, setLike] = useState(false);       // 좋아요 상태저장
    const [likeSeqlist, setLikeSeqlist] = useState([]);
    const [lectureLikeCount, setLectureLikeCount] = useState([]);

    console.log(likeSeqlist);
    console.log(lectureLikeCount);
    console.log(search);

    const [likecount, setLikeCount] = useState([]);

    // 정렬
    const [orderBy, setOrderBy] = useState('');
    const [orderByLatest, setOrderByLatest] = useState(false);  // 정렬 false로 설정. 바꼇을때 true
    const [orderBylike, setOrderByLike] = useState(false);

    function lectureListData(category, page, search){
        if (isLoading) return; // 요청 중에는 중복 호출 방지
        setIsLoading(true);
        axios.get("http://localhost/lecture",{params:{"category":category, "pageNumber":page, "search":search, "id":id}})
        .then(function(resp){
            console.log(resp.data.list);
           // setLectureList(resp.data);
            if(page === 0){             // page 0 이면 데이터만 가져오기. 검색할때
                setLectureList(resp.data.list);    
                        
            }
            else if(page > 0 ){         // page가 스크롤되었으면 뒤로 데이터 붙여주기
                // 리스트 뒤로 붙여주기
                setLectureList([...lectureList, ...(resp.data.list)])  
                // setLikeSeqlist([...likeSeqlist, ...(resp.data.likelist)]);                 
            }
            setLikeSeqlist(resp.data.likelist); 
            setLikeCount(resp.data.list.likecount);
            
            // likecount 추후 생각
            // setLectureLikeCount(resp.data.list.map((lecture) => lecture.likecount));

            // 요청 성공 시에 페이지에 1 카운트 해주기
            // setPage((page) => page + 1)
            setIsLoading(false);
        })
        .catch(function(err){
            console.log(err);
            setIsLoading(false);
        })
    }

    useEffect(()=>{         // initialize 용도
        lectureListData(category, 0, search);       // page -> 0으로 고쳐줌 테스트 확인하기
                

    }, [category, page, search]);   


    console.log(page)
    // 페이지가 0이아니면 안됨
    // useEffect((page)=>{        
    //     // setPage((page) => page + 1);     
    //     lectureListData(category, 0, search);        
        
    // }, [like])

    // console.log(page);

    useEffect((page)=>{
        
        // if(isLoading){
        //     return;
        // }

        lectureListData(category, 0, search);    
        //불러와서 다시 list 랜더링        

    },[like])

  

    // 무한 스크롤
    // useEffect(() => {
    // //setPage(0);     // 검색을 두번눌러야 되서 추가해봄. 추가하면 검색은 한번에 되는데 스크롤이안됨..
    // // inView가 true 일때만 실행한다.
    // if (inView) {
    //     console.log(inView, "무한 스크롤 요청 🎃");
    //     setPage((page) => page + 1);
    //     lectureListData(category ,page, search);        
    // }
    
    // }, [inView]);


// 무한 스크롤
useEffect(() => {
    if (inView) {
        if(isLoading){
            return;
        }
        console.log(inView, "무한 스크롤 요청 🎃");
        setPage((page) => page + 1);        
        lectureListData(category, page, search);

        // 처음에 데이터렌더링되기전에 끝이먼저 보여서 page가 1로 맞춰져서 고침
        // lectureListData(category, page-1, search);
        
        
        //정렬 수정하기
        // if (orderBy === "orderByLatest") {
        //     lectureListData(category, page, search);
            
        // } else if (orderBy === "orderByLike") {
            
        //     orderByList(page, id);
            
        // } 
        // else {
        //     // orderByLatest와 orderBylike가 아닌 경우에는 최신순으로 정렬
        //     lectureListData(category, page, search);
        // }
    }
    
}, [inView, orderBy]);


    // 좋아요
     // 좋아요
     function likeLecture(seq){
       // SweetAlert.fire("좋아요버튼");
        if(id === null){
            SweetAlert.fire("로그인해주십시오");
            return;
        }

        // 로그인에서 id 가져오기
        // item.seq 값 가져오기
        axios.post("http://localhost/lecture/like", {"id":id, "seq":seq})
        .then(function(resp){
            console.log(resp.data);
            if(resp.data === "LIKE_OK"){
                SweetAlert.fire("관심강의로 등록되었습니다");
                // 하트 색넣어주기
                setLike(!like);
                setLikeSeqlist((prevLikeSeqlist) => [...prevLikeSeqlist, seq]);   
                
                //window.location.reload(); // 페이지 리로드
                
            }
            else if(resp.data === "CANCLE_LIKE"){
                SweetAlert.fire("관심강의에서 삭제되었습니다");
                // 하트 색 빼주기
                setLike(!like);                
                // 해당 아이템의 좋아요 상태를 변경
                setLikeSeqlist((prevLikeSeqlist) => prevLikeSeqlist.filter((item) => item !== seq));
                //window.location.reload(); // 페이지 리로드        
                      
                
            }
        })
        .catch(function(err){
            SweetAlert.fire(err);
        })

    }

    
    
    const getLectureList = lectureList.length ? lectureList.map(function(lecture, i){
        
        // const count = lecture.likecount;       

        return(
            <div key={i} className='lecture-item'>  
            
            <div className="lecture-card">
                <div className="card rounded-3 border-0" >   
                
                
                <a href={`/lecturedetail/${lecture.seq}`}>  
                    <div className="lecture-card-1">   
                        {lecture.newfilename &&
                            <img src={`http://localhost/lecture/image/${lecture.newfilename}`} className="lecture-item-img" />
                        } 
                    </div>

                <div class="card-body border-0 p-0 pt-3">
                    <h5 class="card-title">{lecture.title}</h5>
                    {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                </div>
                </a>        {/* a링크 카드 전체에 적용 -> 좋아요때문에 제목과 사진으로만 바꿈*/}
                 


                    <ul class="list-group list-group-flush  ">
                        <li class="list-group-item border-0 px-0 py-0">

                            {/* 
                            <div>
                                <i class="bi bi-chat-square"></i> 수강평갯수
                             </div> */}
                            
                           <img 
                            src={likeSeqlist.includes(lecture.seq) ? heart : emptyheart}
                            alt='emptyheart.png' 
                            width='20px' 
                            height='20px' 
                            onClick={() => likeLecture(lecture.seq)}                    
                            />
                            <span>{lecture.likecount}</span>
                            {/* {like[lecture.seq] ? lecture.likecount + 1: lecture.likecount} */}
                            
                             {/* {like[lecture.seq] ? lecture.likecount + 1 : lecture.likecount}  */}

                             
                             {/* 결제한사람수 */}
                             
                             <div>
                                #{lecture.category}
                            </div>
                        </li>

                        <li class="list-group-item px-0">
                            <p>{lecture.price.toLocaleString()}원</p>
                        </li>                        
                    </ul>                    
                    </div>
                </div>
            
                
            </div>   
        );
    }): 
    <p>찾는 주제의 강의가 없어요<br/>
    다른 강의를 검색해보세요!</p>

    // 카테고리에 값 넣어주기
    const handleCategoryClick = (category) => {
       // document.getElementById("inputCategory")
       // setCategory('');
        setPage(0);
        setSearch('');
        setCategory(category);  
        const isSelected = !!category;
        const searchBtnColor = isSelected ? '#F05522' : '#ebebeb';
        
        lectureListData(category, 0);       // setPage가 바로 적용이 안되어서 아예 page부분을 0으로 전달. (해결됨)
    // 선택한 카테고리에 따른 검색 기능 구현 로직
    }

    // 검색창 (카테고리로 검색)
    function searchChange(){
        setPage(0);        
        //SweetAlert.fire('검색');
        // 검색어         
        if (
            category
              .toString()
              .trim()
              .match(/^(java|JAVA|자바)$/)) {
            setCategory("java");
            return;
          } else if (
            category
              .toString()
              .trim()
              .match(/^(spring|SPRING|스프링)$/)) {
            setCategory("spring");
            return;
          } else if (
            category
              .toString()
              .trim()
              .match(/^(springboot|SPRINGBOOT|스프링부트)$/)) {
            setCategory("springboot");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(javascript|JAVASCRIPT|자바스크립트)$/)) {
            setCategory("javascript");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(react|REACT|리액트)$/)) {
            setCategory("react");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(mysql|sql|SQL)$/)) {
            setCategory("mysql");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(html|HTML)$/)) {
            setCategory("html");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(css|CSS)$/)) {
            setCategory("css");
            return;
          }
          else if (
            category
              .toString()
              .trim()
              .match(/^(python|파이썬|PYTHON)$/)) {
            setCategory("python");
            return;
          }
         // lectureListData(category, 0);   

    }
    console.log(category);  


    // function inputCategoryHandle(e){
    //     setInputCategory(e.target.value);
    //     setCategory(inputCategory);
    // }
    
    function titleSearchBtn(){
        SweetAlert.fire("제목검색");
        setPage(0);
        // setCategory('');
        // lectureListData(category,0, search);     // catecory, search 동시적용된 검색
        lectureListData('',0, search);       
    }

    // 좋아요순 정렬 스크롤부분 체크
    function orderByList(e){
        setOrderBy(e.target.value);
        setPage(0);

        // 만약에 최신순이면 원래데이터 호출        
        if(e.target.value === "orderByLatest"){
            //setOrderByLatest(true);
            lectureListData('',0,'');
        }

        //setOrderByLike(true);
        // 좋아요순이면 새로 연결
        axios.get("http://localhost/lecture/orderByLike", {params:{"pageNumber":page, "id":id}})
        .then(function(resp){
            console.log(resp.data);
            // setLectureList(resp.data);

            if(page === 0){             // page 0 이면 데이터만 가져오기. 검색할때
                setLectureList(resp.data.list);    
                        
            }
            else if(page > 0 ){         // page가 스크롤되었으면 뒤로 데이터 붙여주기
                // 리스트 뒤로 붙여주기
                setLectureList([...lectureList, ...(resp.data.list)])  
                // setLikeSeqlist([...likeSeqlist, ...(resp.data.likelist)]);                 
            }
        })
        .catch(function(err){
            SweetAlert.fire(err);
        })
        
    }
    console.log(orderBy);

    function goPageTop(){
        // alert("page탑");
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

    }

    

    
    return(
        <div className="lecture">
            <h2>전체강의</h2>
            
                <div style={{textAlign:"right"}}>
                    {/* 관리자만 보이게 */}                
                    {login && login.auth === 0 && (
                        <a href="/lecturewrite">                    
                            <button className="write-btn"><i class="bi bi-pencil"></i>강의추가</button>
                        </a>
                    )}
                </div>

                {/* 추후 관리자아이디 만들고 지우기 */}

                {/* <a href="/lecturewrite">                    
                    <button className="write-btn"><i class="bi bi-pencil"></i>강의추가</button>
                </a>
                 */}
            
            
            
            

            <div className="search-lecture">

                {/* 강의 제목으로 검색 */}
                <div className="lecture-title-search">

                <input type='text' value={search} 
                className="form-control search-input"
                onChange={(e)=>setSearch(e.target.value)} 
                placeholder="전체 강의 검색" 
                onKeyUp={()=> setCategory('')}      // onkeyup시 카테고리input창 비워주기
                onKeyPress={(e)=> {
                    if(e.key === 'Enter'){
                        titleSearchBtn();
                    }
                }} 
                />   

                {/* <input type='button' value="검색" onClick={titleSearchBtn} className="search-button-all"/> */}
                {/* <button value="검색" onClick={titleSearchBtn} className="search-button-all">검색</button> */}
                </div>


                <input type='text' 
                // value={category}
                onChange={(e)=>setCategory(e.target.value)} 
                placeholder="기술검색"
                className="form-control search-input"
                onKeyUp={()=> setSearch('')}      // onkeyup시 카테고리input창 비워주기
                onKeyPress={(e)=> {
                    if(e.key === 'Enter'){
                        searchChange();
                    }
                }}
                
                />

                {/* style={{color: 'transparent'}}  글씨 숨길때 쓸거*/}
                {/* <input type='text' value={inputCategory} onChange={inputCategoryHandle} placeholder="기술검색"/> */}
                <button onClick={searchChange}>검색</button>    
            </div>
            <br/>
            <div className="search-button">                        
                <button onClick={() => handleCategoryClick('')} className="search-button-total">전체</button>
                <button onClick={() => handleCategoryClick('java')}>Java</button>
                <button onClick={() => handleCategoryClick('spring')}>Spring</button>
                <button onClick={() => handleCategoryClick('springboot')}>SpringBoot</button>
                <button onClick={() => handleCategoryClick('python')}>Python</button>
                <button onClick={() => handleCategoryClick('javascript')}>JavaScript</button>
                <button onClick={() => handleCategoryClick('react')}>React</button>
                <button onClick={() => handleCategoryClick('mysql')}>Mysql</button>
                <button onClick={() => handleCategoryClick('html')}>HTML</button>
                <button onClick={() => handleCategoryClick('css')}>CSS</button>
            </div>

            {/* 정렬 무한스크롤오류 */} 
            <div className="orderby">
                <select className="form-select" value={orderBy} onChange={orderByList}>
                    <option value="orderByLatest">최신순</option>
                    <option value="orderBylike">좋아요순</option>
                </select>
            </div>

            <br/><br/><br/>
            <div className="lecture-list">
                {getLectureList}
            </div>     

            <div style={{textAlign:"right"}}>
                <i class="bi bi-arrow-up-circle" onClick={goPageTop}></i>
            </div>

            {/* 이 부분이 보이면 스크롤됨 */}       
            <div ref={ref}>
                ...             
            </div>
        </div>
    )

}

export default LectureList;