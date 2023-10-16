import { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './Navbar';
import { Button, Table } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

const baseURL = "http://cloud1-loadbalancer-1926241129.us-east-2.elb.amazonaws.com";
// const baseURL = "http://localhost:5000";
const AdminPage = () => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("")
    const [name, setName] = useState("");
    const [id, setID] = useState("");
    const [userData, setUserData] = useState([

    ]);
    useEffect(() => {
        // Fetch user data from your API endpoint
        axios.get(`${baseURL}/getlogs`)
            .then((response) => {
                if (response.data.Error != undefined){
                    // console.log(response.data.Error)
                    
                    alert(response.data.Error)
                }
                
                console.log(response.data.data)
                setUserData(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                alert('Error fetching user data:', error);
            });
    }, []);



    const handleDeleteFile = (keyFile) => {

        axios.post(`${baseURL}/delete`, { "keyFile": keyFile })
            .then(() => {
                location.reload();
                setUserData((prevData) => prevData.filter((user) => user.filename !== keyFile));
            })
            .catch((error) => {
                console.error('Error deleting file:', error);
            });
    };

    axios.defaults.withCredentials = true;

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
                                    {userData?.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.id}</td>
                                            <td>{user.user_name}</td>
                                            <td>{new Date(user.created_at).toUTCString()}</td>
                                            <td>{new Date(user.updated_at).toUTCString()}</td>
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

export default AdminPage;
