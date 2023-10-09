import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import NavigationBar from './Navbar';


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
        axios.post('http://localhost:5000/delete', values)
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
        axios.get('http://localhost:5000')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true)
                    console.log(res.data.name)
                    console.log(res.data)

                    setName(res.data.name)
                    setID(res.data.id)
                    // navigate('/login')
                } else {
                    setAuth(false)
                    setMessage(res.data.Error)
                    setAlertMessage(res.data.Error)
                }
            })
            .then(err => console.log(err))
    }, [])


    return (
        <>
            {
                auth ?
                    <div>
                        <NavigationBar userName={name} userID={id} />
                        {/* <div style={{ display: 'flex' }}>
                            <h1>Logged In as: {name} - {id}</h1>
                           

                        </div> */}


                        <div className="container mt-5">
                            <h2>Delete File From S3 Bucket</h2>
                            <Form onSubmit={handleSubmit}>

                                <Form.Group className='mt-3' controlId="description">
                                    <Form.Label>File Name / Object Key </Form.Label>
                                    <Form.Control
                                        type="text"
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
    
                        <h3>Status: {message}</h3>
                    </div>

            }


        </>
    );
};

export default DeleteFile;
