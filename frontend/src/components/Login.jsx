import { Typography } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title } = Typography;
const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";

const Login = () => {

    const navigate = useNavigate();

    // const onFinish = (values) => {
    //     console.log('Received values:', values);
    // };

    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values);
        axios.post(`${baseURL}/login`, values)
            .then(res => {
                if (res.data.Status === "Success") {
                   
                    localStorage.setItem('token', res.data.Token)
                    navigate('/')
                } else {
                    console.log(res.data);
                    alert(res.data.Error);
                }
            })
            .then(err => console.log(err));
    }

    return (
        <>
            <div className="form-container">
                <Title>Login</Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={e => setValues({ ...values, username: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <center>
                        <Button style={{ marginRight: 4 }} className='mt-3' variant="primary" type="submit">
                            Login
                        </Button>
                        <Button className='mt-3' variant="secondary" type="link" href='/register'>
                            Register
                        </Button>
                    </center>
                </Form>

            </div>
        </>
    );
};

export default Login;
