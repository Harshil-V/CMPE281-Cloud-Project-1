// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FileUpload from './components/Home';


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<FileUpload/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/register' element={<Register/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
