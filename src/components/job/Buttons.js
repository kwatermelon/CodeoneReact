import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function Buttons(props) {
    const { buttons, onClick } = props;
    const buttonSize = "sm"; // 작은 버튼으로 크기 조정
    const buttonStyle = {
        borderRadius: "20px", // 원하는 radius 값으로 설정
    };

    return (
        <div className="buttons-wrapper">
            {buttons.map((button, index) => (
                <Link to={button.to} key={index}>
                    <Button
                        variant="primary"
                        onClick={onClick}
                        // size={buttonSize}
                        style={buttonStyle}
                        className={`custom-button ${button.customClass}`}
                    >
                        {button.label}
                    </Button>
                </Link>
            ))}
        </div>
    );
}

export default Buttons;
