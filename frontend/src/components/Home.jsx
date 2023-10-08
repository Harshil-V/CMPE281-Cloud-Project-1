import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle file upload and description submission logic here
        console.log('File:', file);
        console.log('Description:', description);
    };

    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:5000')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true)
                    console.log(res.data.name)
                    setName(res.data.name)
                    // navigate('/login')
                } else {
                    setAuth(false)
                    setMessage(res.data.Error)
                }
            })
            .then(err => console.log(err))
    }, [])

    return (
        <>
            {
                auth ?
                    <div>
                        <h3>Logged In as : {name}</h3>
                        <div className="container mt-5">



                            <h2>File Upload</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="file">
                                    <Form.Label>Choose a file (max 10 MB)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className='mt-3' controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
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
                        <h3>Mess: {message}</h3>
                    </div>

            }


        </>
    );
};

export default FileUpload;
