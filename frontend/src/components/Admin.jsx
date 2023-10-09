import { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './Navbar';
import { Button, Table } from 'react-bootstrap';

const AdminPage = () => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");
    const [id, setID] = useState("");
    const [userData, setUserData] = useState([

    ]);

    useEffect(() => {
        // Fetch user data from your API endpoint
        axios.get('http://localhost:5000/getlogs')
            .then((response) => {
                console.log(response.data.data)
                setUserData(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleDeleteFile = (keyFile) => {

        axios.get('http://localhost:5000/delete', keyFile)
            .then(() => {
                setUserData((prevData) => prevData.filter((user) => user.filename !== keyFile));
            })
            .catch((error) => {
                console.error('Error deleting  file:', error);
            });
    };

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

    return (
        <>
            {
                auth ?
                    <div>
                        <NavigationBar userName={name} userID={id} />
                        <div className="container mt-4">
                            <h1>Admin Page</h1>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>User Name</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th>File Name / KEY</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.user_name}</td>
                                            <td>{user.created_at}</td>
                                            <td>{user.updated_at}</td>
                                            <td>{user.key_file}</td>
                                            <td>{user.description}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteFile(user.key_file)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    :
                    <div>

                        <h3>Status: {message}</h3>
                    </div>
            }


        </>
    );
};

export default AdminPage;
