import { useEffect } from "react";

function Kakaomap(props){

// component 대문자 다시 공부하기

// index.html head에 설정
//<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=45651d3c9830790e737b2ceeef5f07d0"></script>
// 스크립트로 kakao maps api를 심어서 가져오면 window전역 객체에 들어가게 됨
//  함수형 컴포넌트에서는 이를 바로 인식하지 못한다고 합니다.
const { kakao } = window;

console.log(props.address);
// 지도생성
// function  kmap(){
//     const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
//     const options = { //지도를 생성할 때 필요한 기본 옵션
//         center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
//         level: 3 //지도의 레벨(확대, 축소 정도)
//     };

//     const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

//        // 주소-좌표 변환 객체를 생성합니다
//        var geocoder = new kakao.maps.services.Geocoder();

//        // 주소로 좌표를 검색합니다
//        geocoder.addressSearch(props.address, function(result, status) {
   
//        // 정상적으로 검색이 완료됐으면 
//         if (status === kakao.maps.services.Status.OK) {
   
//            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
   
//            // 결과값으로 받은 위치를 마커로 표시합니다
//            var marker = new kakao.maps.Marker({
//                map: map,
//                position: coords
//            });
   
//            // 인포윈도우로 장소에 대한 설명을 표시합니다
//            var infowindow = new kakao.maps.InfoWindow({
//                content: '<div style="width:150px;text-align:center;padding:6px 0;">거래위치</div>'
//            });
//            infowindow.open(map, marker);
   
//            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
//            map.setCenter(coords);
//        } 
//    });    

// }

useEffect(()=>{             // 접속하면서 한번만 읽어들이게 
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

       // 주소-좌표 변환 객체를 생성합니다
       var geocoder = new kakao.maps.services.Geocoder();

       // props로 받은 주소로 좌표를 검색합니다
       geocoder.addressSearch(props.address, function(result, status) {
   
       // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {
   
           var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
   
           // 결과값으로 받은 위치를 마커로 표시합니다
           var marker = new kakao.maps.Marker({
               map: map,
               position: coords
           });
   
           // 인포윈도우로 장소에 대한 설명을 표시합니다
           var infowindow = new kakao.maps.InfoWindow({
            //    content: '<div style="width:150px;text-align:center;padding:6px 0;font-size:18px">'+props.address+'</div>'
               content: '<div style="width:150px !important;text-align:center;padding:6px 0;">거래지역</div>'
           });
           infowindow.open(map, marker);
   
           // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
           map.setCenter(coords);
       } 
   });    
}, [props.address]);

return(
    // 지도를 그릴 공간 만들기
    <div id="map" style={{width:'100%', height:'300px'}}>
        {/* <kmap />        /이미 함수로 불러오고 있어서 return에 넣어줄 필요없음 */}
    </div>
)
}
export default Kakaomap;