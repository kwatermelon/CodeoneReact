import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import './css/star.css'

function CheckStar(props){

    const { rating } = props;

    return(
        <div>
            {/* <h2>별점 표시하기</h2> */}
            <div className="review">
                <div className="rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <FontAwesomeIcon 
                                key={index}
                                icon={faStar} 
                                className={ratingValue <= rating ? "selected" : ""}       // rating이 참이면 seclected css 아니면 ""
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CheckStar;
