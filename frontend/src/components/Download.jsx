import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import NavigationBar from './Navbar';
import jwt_decode from 'jwt-decode';

const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";
// const baseURL = "http://localhost:5000";
const DownloadFile = () => {


    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");
    const [id, setID] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [fileURL, setFileURL] = useState("");

    const [values, setValues] = useState({
        keyFile: ''
    });

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values);
        axios.get(`${baseURL}/download/${values.keyFile}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setFileURL(res.data.url)
                    console.log(res.data.url)

                    // window.open(`https://${fileURL}`);

                    alert("Successfully Got File")
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
                            <h2>Download File</h2>
                            <Form onSubmit={handleSubmit}>

                                <Form.Group className='mt-3' controlId="description">
                                    <Form.Label>File Name / Object Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Please Enter the File Name / Key'
                                        name="keyFile"
                                        value={values.keyFile}
                                        onChange={(e) => setValues({ ...values, keyFile: e.target.value })}
                                        required
                                    />
                                </Form.Group>



                                {
                                    fileURL ?
                                        <>
                                            <Button className='mt-3' variant="primary" type="submit">
                                                Request File
                                            </Button>
                                            <Button style={{ marginLeft: 4 }} className='mt-3' variant="secondary" href={`https://${fileURL}`} download>
                                                Donwload File
                                            </Button>

                                        </>
                                        :
                                        <Button className='mt-3' variant="primary" type="submit">
                                            Request File
                                        </Button>
                                }


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

export default DownloadFile;
