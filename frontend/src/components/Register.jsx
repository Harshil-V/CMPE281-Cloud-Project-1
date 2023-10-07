import { Typography } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title } = Typography;

function Register() {
    // const onFinish = (values) => {
    //     console.log('Received values:', values);
    // };

    const [values, setValues] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(values);
        axios.post('http://localhost:5000/register', values)
            .then(res => {
                if (res.data.Status === "Status") {
                    <Navigate to="/" />
                } else {
                    alert("Error");
                }
            })
            .then(err => console.log(err));
    }

    return (

        <>
            <div className="form-container">
                <Title>Register</Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={e => setValues({...values, username: e.target.value})}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={values.firstName}
                            onChange={e => setValues({...values, firstName: e.target.value})}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={values.lastName}
                            onChange={e => setValues({...values, lastName: e.target.value})}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={e => setValues({...values, password: e.target.value})}
                            required
                        />
                    </Form.Group>
                    <center>
                    <Button className='mt-3' variant="primary" type="submit">
                        Register
                    </Button>
                    </center>
                </Form>
                {/* <Form name="register" onFinish={handleSubmit}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input onChange={e => setValues({...values, username: e.target.value})}/>
                    </Form.Item>
                    <Form.Item
                        label="First Name"
                        name="firstname"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Input onChange={e => setValues({...values, firstName: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastname"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Input onChange={e => setValues({...values, lastName: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password onChange={e => setValues({...values, password: e.target.value})}/>
                    </Form.Item>
                    <Form.Item>
                        <center>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </center>
                    </Form.Item>
                </Form> */}
            </div>
        </>
    );
}

export default Register;
