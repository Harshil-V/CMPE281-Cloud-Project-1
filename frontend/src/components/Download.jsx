import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import NavigationBar from './Navbar';


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
        axios.get(`http://localhost:5000/download/${values.keyFile}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setFileURL(res.data.url)
                   
                    window.open("https://"+fileURL, '_blank');
                    
                    alert("Successfully Got File")
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

    // const handleDelete = () => {
    //     axios.get("https://localhost:5000/logout")
    //         .then(() => {
    //             location.reload(true);
    //         })
    //         .catch(err => console.log(err));
    // }

    // const downloadFile = () => {
    //     const externalFileUrl = fileURL; // Replace with your external file URL
    //     const link = document.createElement('a');
    //     link.href = externalFileUrl;
    //     link.download = 'downloaded-file-name'; // Provide a desired name for the downloaded file
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };


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
                                        name="keyFile"
                                        value={values.keyFile}
                                        onChange={(e) => setValues({ ...values, keyFile: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button className='mt-3' variant="primary" type="submit">
                                    Request File
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

export default DownloadFile;
