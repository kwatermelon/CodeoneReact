import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
// import './css/star.css'
import { useState } from 'react';

function Star({onStarSelect}) {
  const [selectedNum, setSelectedNum] = useState(0);

//   const handleStarClick = (num) => {
//     setSelectedNum(num);
//   };

  const handleStarClick = (star) => {           // star === 내가 선택한 별점번호
    onStarSelect(star);     // 상위에 보내줌
    setSelectedNum(star);   // 별점색 표시

  };


  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {               // 별 5개표시 0~4까지 반복
      const isSelected = (i < selectedNum);     // 0~4까지기때문에 
      const starColor = isSelected ? '#FFC107' : '#ebebeb';
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          onClick={() => handleStarClick(i + 1)}    // 0-4기때문에 i+1한숫자 넘겨줌 === star
          style={{ color: starColor }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="star-rating">
      {/* <h2>별점 주기</h2> */}
      <div className="rating">{renderStars()}</div>
        <p>선택한 별점: {selectedNum}</p>
    </div>
  );
}

export default Star;
