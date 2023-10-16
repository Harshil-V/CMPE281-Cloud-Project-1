import { Typography } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title } = Typography;

const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";

function Register() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values);
        axios.post(`${baseURL}/register`, values)
            .then(res => {
                if (res.data.Status === "Success") {

                    navigate('/')
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
                            onChange={e => setValues({ ...values, username: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={values.firstName}
                            onChange={e => setValues({ ...values, firstName: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={values.lastName}
                            onChange={e => setValues({ ...values, lastName: e.target.value })}
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
                        <Button className='mt-3' variant="primary" type="submit">
                            Register
                        </Button>
                    </center>
                </Form>
            </div>
        </>
    );
}

export default Register;
