import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import NavigationBar from './Navbar'
import jwt_decode from 'jwt-decode';

const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";
// const baseURL =  "http://localhost:5000"
const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 10485760) {
            setFile(selectedFile);
        } else {
            alert('File size exceeds the limit (10 MB).');
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userID', id);
        formData.append('currentDateTime', new Date().toLocaleDateString())
        formData.append('file', file);
        formData.append('desc', description);

        try {
            const response = await axios.post(`${baseURL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(`Upload successful`)
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Upload error:', error);
        }

        console.log('File:', file);
        console.log('Description:', description);
    };

    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");
    const [id, setID] = useState("");

    axios.defaults.withCredentials = true;
    // function getCookie(cname) {
    //     let name = cname + "=";
    //     let decodedCookie = decodeURIComponent(document.cookie);
    //     let ca = decodedCookie.split(';');
    //     for (let i = 0; i < ca.length; i++) {
    //         let c = ca[i];
    //         while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // }

    useEffect(() => {
        
        const token = window.localStorage.token;
        
        if (token) {
            setAuth(true);
            setName(jwt_decode(token).name)
            setID(jwt_decode(token).id);

        } else {
            setAuth(false)
            setMessage("You are not Authenticated")
        }
       
    }, [])

    return (
        <>
            {
                auth ?
                    <div>
                        <NavigationBar userName={name} userID={id} />

                        <div className="container mt-5">
                            <h2>File Upload</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="file">
                                    <Form.Label>Choose a file (max 10 MB)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className='mt-3' controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        maxLength={45}
                                        as="textarea"
                                        rows={1}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button className='mt-3' variant="primary" type="submit">
                                    Upload
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

export default FileUpload;
