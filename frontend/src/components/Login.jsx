import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const Login = () => {
    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <>
            <div className="form-container">
                <Title>Login</Title>
                <Form name="login" onFinish={onFinish}>
                    {/* Add your login form fields here */}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
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
                            <Button  style={{ marginRight: 15}} type="primary" htmlType="submit">
                                Login
                            </Button>
                            <Button type="primary" href='/register'>
                                Register
                            </Button>
                        </center>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Login;
