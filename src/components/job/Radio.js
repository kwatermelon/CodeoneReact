import Form from "react-bootstrap/Form";

function BootRadio({ options, type, onChange }) {
    return (
        <Form>
            {options.map((option) => (
                <div
                    key={`inline-${option.value}`}
                    className="mb-3"
                    style={{ display: "inline-block" }}
                >
                    <Form.Check
                        inline
                        label={option.label}
                        name={type}
                        type={type}
                        id={`inline-${option.id}`}
                        value={option.value}
                        onChange={onChange}
                    />
                </div>
            ))}
        </Form>
    );
}
export default BootRadio;
