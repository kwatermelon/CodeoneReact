import Form from "react-bootstrap/Form";

function CheckSwitch({ handleRecruitingSwitch }) {
    return (
        <Form>
            <Form.Check
                type="switch"
                id="custom-switch"
                label="채용중인 글만 보기"
                onChange={handleRecruitingSwitch} // 스위치 핸들러 함수 호출
            />
        </Form>
    );
}

export default CheckSwitch;
