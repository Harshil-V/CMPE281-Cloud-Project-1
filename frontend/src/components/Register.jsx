import { Form, Input, Button, Typography} from 'antd';
const { Title } = Typography;

const Register = () => {
    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (

        <>
            <div className="form-container">
                <Title>Register</Title>
                <Form name="register" onFinish={onFinish}>
                    <Form.Item
                        label="First Name"
                        name="firstname"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastname"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <center>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </center>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Register;
