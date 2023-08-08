import React, { useEffect } from "react";

function Jobkakaomap(props) {
    const { kakao } = window;

    useEffect(() => {
        // 접속하면서 한번만 읽어들이게
        const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
        const options = {
            //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
            level: 5, //지도의 레벨(확대, 축소 정도)
        };

        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // props로 받은 주소로 좌표를 검색합니다
        geocoder.addressSearch(props.address, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                var infowindow = new kakao.maps.InfoWindow({
                    content: createInfoWindowContent(props.comname),
                });

                function createInfoWindowContent(comname) {
                    return (
                        '<div style="font-size:13px;width:150px;text-align:center;padding:6px 0;">' +
                        "✔" +
                        comname +
                        "</div>"
                    );
                }

                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });
    }, [props.address]);

    return (
        <div
            id="map"
            style={{
                width: "650px",
                height: "350px",
            }}
        ></div>
    );
}

export default Jobkakaomap;
