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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userID', id);
        formData.append('currentDateTime', new Date().toLocaleDateString())
        formData.append('file', file);
        formData.append('desc', description);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
                }
            })
            .then(err => console.log(err))
    }, [])

    const handleDelete = () => {
        axios.get("https://localhost:5000/logout")
        .then(() => {
            location.reload(true);
        })
        .catch(err => console.log(err));
    }

    return (
        <>
            {
                auth ?
                    <div>
                        <div style={{ display: 'flex' }}>
                            <h1>Logged In as: {name} - {id}</h1>
                            <Button className='btn btn-danger \' onClick={handleDelete}>
                                Logout
                            </Button>

                        </div>


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
    
                        <h3>Status: {message}</h3>
                    </div>

            }


        </>
    );
};

export default FileUpload;
