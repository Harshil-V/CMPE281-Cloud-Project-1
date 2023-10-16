import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import NavigationBar from './Navbar';
import jwt_decode from 'jwt-decode';

const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";

const DeleteFile = () => {


    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");
    const [id, setID] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [values, setValues] = useState({
        keyFile: ''
    });

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values);
        axios.post(`${baseURL}/delete`, values)
            .then(res => {
                if (res.data.Status === "Success") {
                    alert("Successfully Deleted")
                } else {
                    console.log(res.data);
                    alert(alertMessage);
                }
            })
            .then(err => console.log(err));
    }

    useEffect(() => {
        const token = window.localStorage.token;

        if (token) {
            setAuth(true);
            setName(jwt_decode(token).name)
            setID(jwt_decode(token).id);

        } else {
            setAuth(false)
            setMessage("You are not Authenticated");
            setAlertMessage("You are not Authenticated")
        }
    }, [])

    return (
        <>
            {
                auth ?
                    <div>
                        <NavigationBar userName={name} userID={id} />

                        <div className="container mt-5">
                            <h2>Delete File From S3 Bucket</h2>
                            <Form onSubmit={handleSubmit}>

                                <Form.Group className='mt-3' controlId="description">
                                    <Form.Label>File Name / Object Key </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Please Enter File Name / Key'
                                        name="keyFile"
                                        value={values.keyFile}
                                        onChange={(e) => setValues({ ...values, keyFile: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button className='mt-3' variant="primary" type="submit">
                                    Delete File/Object
                                </Button>
                            </Form>
                        </div>
                    </div> :

                    <div>

                        <center className='container mt-5'>
                            <h3>Status: {message}</h3>
                            <div>
                                <Button style={{ marginRight: 6 }} href='/login'>Login</Button>
                                <Button variant='secondary' href='/register'>Register</Button>
                            </div>
                        </center>
                    </div>

            }


        </>
    );
};

export default DeleteFile;
