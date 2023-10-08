// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FileUpload from './components/Home';
import DeleteFile from './components/Delete';
import DownloadFile from './components/Download';


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<FileUpload/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/register' element={<Register/>}></Route>
                    <Route path='/delete' element={<DeleteFile/>}></Route>
                    <Route path='/download' element={<DownloadFile/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
