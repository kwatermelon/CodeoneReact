import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import heart from '../../assets/store/heart.png';
import emptyheart from '../../assets/store/emptyheart.png';
import location from '../../assets/store/location.png';
import './css/storelist.css'; // 파일 경로 수정
import moment from 'moment';    // day.js로 바꿈 추후 삭제
import { Link, useNavigate } from "react-router-dom";

// 부트스트랩 아이콘
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 무한스크롤
import { useInView } from 'react-intersection-observer';

// 알람
import SweetAlert from "sweetalert2";

// day.js
import dayjs from 'dayjs'; // day.js
//import isLeapYear from 'dayjs/plugin/isLeapYear'; // 윤년 판단 플러그인
import 'dayjs/locale/ko'; // 한국어 가져오기
import StoreNav from "./storenav";

// #4f6df4
// 로고 색상코드 css 참고

function StoreList(){
    
    // day.js 설정
    // dayjs.extend(isLeapYear); // 플러그인 등록
    dayjs.locale('ko'); // 한국어
    var relativeTime = require('dayjs/plugin/relativeTime') // 현재시간으로 부터 가져올때 해줘야함
    dayjs.extend(relativeTime);

    // 무한스크롤
    const [ref, inView] = useInView();    
    const [isLoading, setIsLoading] = useState(false);
    
    // 로그인정보 가져오기
    let id = window.localStorage.getItem("userId");
    console.log(id);

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 
    
    // let auth = login.auth;
    // console.log(auth);

    const [choice, setChoice] = useState("title");
    const [search, setSearch] = useState("");
    const [totalCnt, setTotalCnt] = useState(0);
    
    const [storeList, setStoreList] = useState([]);

    const [likeList, setLikeList] = useState([]);       // 좋아요 상태저장
    const [isLiked, setIsLiked] = useState({});

    const [like, setLike] = useState(false);       // 좋아요 상태저장

  
    const [page, setPage] = useState(0);       // pageNumber 0

    const [likeSeqlist, setLikeSeqlist] = useState([]);
    const [seq, setSeq] = useState([]);
    console.log(search);
    console.log(choice);

    const prevStoreList = useRef([]);

    let history = useNavigate();       // 링크를 사용할 수 있게 

    // 중고거래 목록 list 받아오기
    const storeListData = async (choice, search, page) =>{
        // 무한스크롤 적용
        if (isLoading) return; // 요청 중에는 중복 호출 방지
        setIsLoading(true);

        await axios.get('http://localhost/getStoreList', { params:{ "choice":choice, "search":search, "pageNumber":page, "id":id}})
            .then(function(resp){
                console.log(resp.data); 
                //setStoreList(resp.data.list); 
                // setTotalCnt(resp.data.cnt);
                // console.log(resp.data.cnt);    
                // setStoreList(resp.data.list); 
                // setTotalCnt(resp.data.cnt);
                // console.log(resp.data.list);
                // setLikeSeqlist(resp.data.likelist); 

                // 무한스크롤 적용 코드
                if(page === 0){             // page 0 이면 데이터만 가져오기. 검색할때
                    setStoreList(resp.data.list);                      
                }
                else if(page > 0 ){         // page가 스크롤되었으면 뒤로 데이터 붙여주기
                    // 리스트 뒤로 붙여주기
                    setStoreList([...storeList, ...(resp.data.list)]);  //둘중에 어떤거 쓸 지 다시확인
                    // setStoreList(prevStoreList => [...prevStoreList, ...resp.data.list]);                              
                }
                setLikeSeqlist(resp.data.likelist);   
                setTotalCnt(resp.data.cnt);              
                
                setIsLoading(false);
                // 끝

                // resp.data.list.map(store => {
                //     if(resp.data.likelist.includes(store.seq)){
                //         setIsLiked(true);
                //     }
                // })
                
                // const updatedStoreList = resp.data.list.map(store => {
                //     if (resp.data.likelist.includes(store.seq)) {
                //       return {...store, isLiked: true};
                //     } else {
                //       return {...store, isLiked: false};
                //     }
                //   });
                // setStoreList(updatedStoreList);

                // setStoreList(prevStoreList => {
                //     if (page === 0) {
                //       return resp.data.list; // 첫 번째 페이지일 경우 기존 데이터를 덮어씀
                //     } else {
                //       return [...prevStoreList, ...resp.data.list]; // 다음 페이지일 경우 기존 데이터에 추가
                //     }
                //   });
                // if (page === 0) {
                //     //setStoreList(resp.data.list); // 첫 번째 페이지일 경우 기존 데이터를 덮어씀
                //     return resp.data.list; // 첫 번째 페이지일 경우 기존 데이터를 덮어씀
                // } else {
                //     //setStoreList(prevStoreList => [...prevStoreList, ...resp.data.list]); // 다음 페이지일 경우 기존 데이터에 추가
                //     return [...prevStoreList, ...resp.data.list]; // 다음 페이지일 경우 기존 데이터에 추가
                // }
                                

                     
            })
            .catch(function(err){                
                console.log(err);
                // 무한스크롤 적용
                setIsLoading(false);  
            })
    }
      

              
        // 무한 스크롤
        useEffect(() => {
       // setPage(0);     // 검색두번눌러야 되는경우가 있어서 추가해봄 . 스크롤이 안됨
        // inView가 true 일때만 실행한다.
        if (inView) {
            console.log(inView, "무한 스크롤 요청 🎃");
            setPage((page) => page + 1);
            storeListData(choice,search,page);        
        }
        }, [inView]);

        
    
        //스크롤
        // useEffect(() => {
        //     window.addEventListener('scroll', handleScroll);
        //     return () => {
        //       window.removeEventListener('scroll', handleScroll); //clean up
        //     };
        //   }, [page]);
        
        //   // 스크롤내릴때 choice search 유지안됨
        //   const handleScroll = async() => {
        //     console.log('스크롤 이벤트');
        //     if (window.scrollY > 500) {
        //       console.log('page-1');
        //       const prevpage = page-1
        //       await storeListData(choice,search,prevpage);
        //     //   setPage(page-1);
        //     //   storeListData(page);
        //       return;
        //     }
        //     console.log('page+1');
        //     const nextpage = page+1
        //     setPage(nextpage);
        //     await storeListData(choice,search,nextpage);
        //     console.log(page);
        //     return;
        //   };

    function searchBtn(){        
        setPage(0); 
        console.log(page);      // page 넘버가 안바뀌고 두번눌러야 바뀌어져있음
       // SweetAlert.fire("검색");             

        if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
            history('/storelist/' + choice + "/" + search);
        }
        else{
            history('/storelist');
        }
        // 데이터 다시불러오기
        storeListData(choice, search, 0);      // storelist에 검색값 넣기        
    }

    // 좋아요 상태 초기화
    // useEffect(() => {
    //     const initLikeList = storeList.map(() => false); // storeList와 같은 길이의 배열을 생성하고 false로 초기화
    //     setLikeList(initLikeList);
    // }, [storeList]);



    

    // 좋아요 구현
    function likeStore(seq){        
        
        // 서버에 연결. 좋아요 구현        
        
        // 로그인에서 id 가져오기
        if(login === null){
            SweetAlert.fire('로그인이 필요한 기능입니다');
            return;
        }

        // item.seq 값 가져오기
        axios.get("http://localhost/likeItem", {params:{"id":id, "seq":seq}})
        .then(function(resp){
            console.log(resp.data);
            if(resp.data === "LIKE_OK"){
                SweetAlert.fire("관심상품으로 등록되었습니다");
                // 하트 색넣어주기
                // setLike(!like);
                // 해당 아이템의 좋아요 상태를 변경       
                // setLikeList((prevLikeList) => {
                //     const newLikeList = [...prevLikeList];              //...prevLikeList는 prevLikeList 배열을 전개하여 해당 배열의 요소들을 새로운 배열로 복사한 것
                //     newLikeList[seq] = !newLikeList[seq];
                //     return newLikeList;
                    
                // });

                // setIsLiked(true);
                // // 해당 아이템의 좋아요 수를 업데이트
                // setStoreList((prevStoreList) => {
                //     const newStoreList = [...prevStoreList]; // 기존 리스트 복사
                //     const itemIndex = newStoreList.findIndex((item) => item.seq === seq); // 해당 아이템 인덱스 찾기
                //     if (itemIndex !== -1) { // 해당 아이템이 존재할 경우
                //         newStoreList[itemIndex] = {...newStoreList[itemIndex], likecount: resp.data.likecount}; // 좋아요 수 업데이트
                //     }
                //     return newStoreList;
                // });
                // setLikeSeqlist((prevLikeSeqlist) => [...prevLikeSeqlist, seq]); 

                setLikeSeqlist((prevLikeSeqlist) => [...prevLikeSeqlist, seq]);                
                // setIsLiked(true);

                setIsLiked((prevIsLiked) => ({ ...prevIsLiked, [seq]: true }));
            }
            else if(resp.data === "CANCLE_LIKE"){
                SweetAlert.fire("관심상품이 삭제되었습니다");
                // 하트 색 빼주기
                // setLike(!like);
                // 해당 아이템의 좋아요 상태를 변경
                //  setLikeList((prevLikeList) => {
                //     const newLikeList = [...prevLikeList];
                //     newLikeList[seq] = !newLikeList[seq];
                //     return newLikeList;
                // });
                // 해당 아이템의 좋아요 상태를 변경
                setLikeSeqlist((prevLikeSeqlist) => prevLikeSeqlist.filter((item) => item !== seq));
                //setIsLiked(false);
                setIsLiked((prevIsLiked) => ({ ...prevIsLiked, [seq]: false }));

                
            }
        })
        .catch(function(err){
            SweetAlert.fire(err);
        })
    }

    function goWritePage(e){        

        if(login === null){
            SweetAlert.fire("로그인이 필요한 기능입니다");
            e.preventDefault();
            return;
        }
        
    }

    // 글 랜더링
    const storeitemlist = storeList.length ? storeList.map(function(item, i){
        return(            
            <div key={i} className='store-item'>                                                               
                <div className="status-labal">
                    {item.status === "sale" ?
                        <button type="button" class="store-sell-btn"  >판매중</button>
                        : <button type="button" class="store-sold-btn" >판매완료</button>
                    }
                </div>
                <div class="card border-0" >                    
                <a href={`/storedetail/${item.seq}`} onClick={goWritePage}>
                    {item.newfilename &&
                        <img src={`http://localhost/image/${item.newfilename}`} className='store-item-img' />
                    }
                
                    {/* <img src={`http://localhost:${80}/image/${item.newfilename}`} width="100%" /></a> */}
                
                    <div class="card-body  ">
                        <h5 class="card-title">
                            {item.title} {/* a링크 주기 */}
                        </h5>
                    </div>
                </a>
                <div>

                {/* <img 
                    src={likeList.map(seq => seq === item.seq).includes(true) ? heart : emptyheart}
                    alt='emptyheart.png' 
                    width='20px' 
                    height='20px' 
                    onClick={() => likeStore(item.seq)}
                /> */}
                <ul class="list-group list-group-flush  ">
                    <li class="list-group-item border-0">

                    {/* 조회수가 100이상이면 99+ */}
                    <div className="store-text"> 
                        <i class="bi bi-eye"></i>&nbsp;
                        {item.readcount >= 100 ? '99+' : item.readcount}
                    </div>
                    {/*하트 */}
                    <div className="right-position ">
                        <img 
                            src={likeSeqlist.includes(item.seq) ? heart : emptyheart}
                            alt='emptyheart.png' 
                            width='18px' 
                            height='18px' 
                            onClick={() => likeStore(item.seq)}
                        />
                    </div>

                                        
                    {/* {likeSeqlist.includes(item.seq)  && item.likecount > 0 && isLiked[item.seq] && (      // 상태관리 고치기 좋아요 수
                    <div className="store-text">                        
                        {item.likecount}
                    </div>
                    )}  */}

                    {/* 내아디로 좋아요한 리스트가 일치할때 likecount표시..? */}
                    {/* {likeSeqlist.includes(item.seq) && (
                        <div className="store-text">
                            {item.likecount}
                        </div>
                    )} */}
                    {/* {!likeSeqlist.includes(item.seq) && (
                        <div className="store-text">
                            {isLiked[item.seq] ? item.likecount + 1 : item.likecount }
                        </div>
                    )} */}


                {/* <img src={likeList[item.seq] ? heart : emptyheart}  alt='emptyheart.png' width='20px' height='20px' onClick={() => likeStore(item.seq)}/> */}
                    {/* 좋아요 수가 0보다 클때만 보이게하기 */}                    
                    {/* {item.likecount > 0 && (        
                    <span>                        
                        {item.likecount}
                    </span>
                    )}   */}    
{/* 
                    {item.likecount > 0 && (
                    // 내용
                    <span>{item.likecount}</span>                    
                    )}     */}

                    </li>

                    <li class="list-group-item border-0">
                    <div className="store-text">
                        <div className="store-price-text">
                            {item.price.toLocaleString()}원
                        </div>
                        {/* 작성일 몇분전으로 구현 */}
                        {/* {moment(item.wdate).endOf('minutes').fromNow()}  */}
                        {/* moment.js -> day.js로 바꿈 */}
                        <div className="store-date-text">
                            {dayjs(item.wdate).fromNow()}
                        </div>                    
                     </div>  
                    </li>
                    
                    <li class="list-group-item">
                    <div className="store-text">
                        <img src={location} alt="location.png" width='20px' height='20px' />{item.location}
                    </div>
                    </li>

                    


                    {/* 
                    <li class="list-group-item">
                    <div className="store-text"> 조회수가 100이상이면 99+ 
                        <i class="bi bi-eye"></i>
                        {item.readcount >= 100 ? '99+' : item.readcount}
                    </div>
                    </li>                  
                     */}

                    </ul>
                    </div>
                </div>

                {/* 카드로 변경 */}
                {/* <div style={{fontSize: '18px'}}>
                    <img src={location} alt="location.png" width='20px' height='20px' />{item.location}
                </div> */}
                {/*                 
                <div>
                    작성일 몇분전으로 구현 
                    {moment(item.wdate).endOf('minutes').fromNow()} 
                    moment.js -> day.js로 바꿈 
                    {dayjs(item.wdate).fromNow()}                    
                </div>     
                */}
                {/* 
                <div>조회수&nbsp;  조회수가 100이상이면 99+
                    {item.readcount >= 100 ? '99+' : item.readcount}
                </div> */}
              
            </div>              
        );
    }): <p className="lecture-review-form-text" style={{textAlign:"center"}}>
            작성된 글이 없습니다. <br/>
            판매글을 남겨주세요!
        </p>;
    
    // 판매하기 로그인여부 확인
    function storeWriteBtn(e){   
        
        
        if(id === null){
            SweetAlert.fire("로그인이 필요한 기능입니다");
            e.preventDefault();     
            return;
        }
    }

    // 스크롤 top으로
    function goPageTop(){
        // alert("page탑");
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

    }

    function handleChangeCategory(e){
        setChoice(e.target.value);
    }

    console.log(choice);

    return(
        <div className="store">
            <StoreNav />
            <h1 className="store-list-title">이곳에서 IT제품을 거래해보세요!</h1>
            
            <br/> 
            
            

            <div className="search-store">
{/*                 
                <select value={choice} onChange={(e)=>setChoice(e.target.value)} 
                className="form-select" style={{width:"150px"}}>
                    <option value="">검색</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="writer">작성자</option>
                </select> */}

                <diV className="radiobox">
                    <input type='radio' name='category'  value='title' onChange={handleChangeCategory} 
                        className="form-check-input"  checked={choice === "title"}/><label>제목</label>
                    <input type='radio' name='category'  value='content' onChange={handleChangeCategory} 
                        className="form-check-input" checked={choice === "content"} /><label>내용</label>
                    <input type='radio' name='category'  value='writer' onChange={handleChangeCategory} 
                        className="form-check-input" checked={choice === "writer"}/><label>작성자</label>
                </diV>
                

                <div className="lecture-title-search ">
                    <input type="text" value={search} 
                    className="form-control search-input store-search-1"
                    onChange={(e)=>setSearch(e.target.value)} 
                    placeholder="어떤제품을 찾으시나요?"
                    onKeyPress={(e)=> {
                        if(e.key === 'Enter'){
                            searchBtn();
                        }
                    }}
                    />
                </div>
                
                

                {/* <button type="button" onClick={searchBtn} className="btn btn-primary">검색</button> */}
            

            {/* 부트스트랩 적용 검색창 */}
                {/* <div class="input-group mb-3">
                    <input type="text" 
                    value={search} 
                    onChange={(e)=>setSearch(e.target.value)} 
                        placeholder="검색어를 입력하세요"
                        onKeyPress={(e)=> {
                            if(e.key === 'Enter'){
                                searchBtn();
                            }
                    }}
                    className="form-control search-input"   
                    style={{width:"300px"}}          
                    // aria-label="search" 
                    // aria-describedby="button-addon2"
                    />
                    <button class="btn btn-outline-secondary search-btn" type="button" id="button-addon2" onClick={searchBtn}>검색</button>
                </div> */}
            </div>

            {/* 총갯수 */}
            <div className="cnt-count">
                총 {totalCnt}개의 제품
            </div>

            {/* Search form */}
            {/* <form className="form-inline active-purple-4">
            <input value={search} onChange={(e)=>setSearch(e.target.value)} 
            className="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search"
                aria-label="Search"/>
            <i className="fas fa-search" aria-hidden="true"></i>
            <i className="bi bi-search"></i>
           
            </form> */}
                
            
            &nbsp;&nbsp;&nbsp;&nbsp;
            {/* 로그인했을때만 이동할 수있게 바꾸기 */}
            {/*StoreNav 컴포넌트로바꿈 */}
            {/* <div className="store-write">
                <span><a href="/storewrite" onClick={storeWriteBtn} >                       
                        <button className="write-btn"><i class="bi bi-pencil"></i>판매하기</button>
                    </a>
                </span>
            </div> */}
            <br/>            
            <br/>
{/*             
            카테고리
            <select>
                <option>디지털/가전</option>
                <option>기타</option>
            </select>

            <div className="search-category">
                카테고리 
                
                <table class="table">
                    <tbody>
                        <tr>
                            <td>전체보기</td>
                            <td>모바일</td>
                            <td>오디오/영상/관련기기</td>
                            <td>PC/노트북</td>
                            <td>PC부품/저장장치</td>
                        </tr>
                        <tr>
                            <td>가전제품</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div> */}

            <div>
                <div className="store-list-change">                                        
                    {storeitemlist}                    
                </div>
            </div>

            {/* 스크롤탑 */}
            <div style={{textAlign:"right"}}>
                <i class="bi bi-arrow-up-circle" onClick={goPageTop}></i>
            </div>

             {/* 이 부분이 보이면 스크롤됨 */}       
            <div ref={ref}>
                <i class="bi bi-three-dots"></i> 
            </div>
            
        </div>
    )

}

export default StoreList;