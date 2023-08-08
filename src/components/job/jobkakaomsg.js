//https://developers.kakao.com/tool/template-builder/app/901580/template/93381/component/thl/0 개별링크 변경해주기
import { useEffect } from "react";
import kakaologo from "../../assets/job/kakaologo.png";

export default function KakaoShare(props) {
    useEffect(() => {
        kakaoButton();
    }, []);

    const kakaoButton = () => {
        if (window.Kakao) {
            const kakao = window.Kakao;

            if (!kakao.isInitialized()) {
                kakao.init("49d69b6310c6c4ae6e41563c6ed01227");
            }

            kakao.Link.createCustomButton({
                container: "#kakaotalk-sharing-btn",
                templateId: 93381,
                success: function (response) {
                    console.log("Successfully shared");

                    // 배포된 웹사이트의 URL로 변경
                    const shareUrl = "https://your-website.com/";

                    kakao.Link.sendDefault({
                        objectType: "feed",
                        content: {
                            title: "공유 제목",
                            description: "공유 설명",
                            imageUrl: "https://placeimg.com/640/480/any",
                            link: {
                                mobileWebUrl:
                                    window.location.origin +
                                    "/jobdetail/" +
                                    props.seq,
                                webUrl:
                                    window.location.origin +
                                    "/jobdetail/" +
                                    props.seq,
                            },
                        },
                        buttons: [
                            {
                                title: "앱에서 보기",
                                link: {
                                    mobileWebUrl: window.location.href,
                                    mobileWebUrl:
                                        window.location.origin +
                                        "/jobdetail/" +
                                        props.seq,
                                    webUrl:
                                        window.location.origin +
                                        "/jobdetail/" +
                                        props.seq,
                                },
                            },
                        ],
                    });
                },
            });
        }
    };

    // return <button id="kakaotalk-sharing-btn">KakaoShare</button>;

    return (
        <a href="#" id="kakaotalk-sharing-btn">
            <img src={kakaologo} style={{ width: "25px", height: "25px" }} />
        </a>
    );
}
