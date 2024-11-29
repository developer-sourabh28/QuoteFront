import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const USER_URL = 'https://quoteback-htn6.onrender.com/user/signup'

export default function UserModel() {

    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const createUser = async () => {
        try {
            console.log('Attempting to create user...')
            const response = await axios.post(USER_URL,
                {
                    name: newName,
                    email: newEmail,
                    password: newPassword
                },
                { withCredentials: true }
            );
            console.log('User created successfully:', response.data);
            setUser([...user, response.data]);
            setNewName('');
            setNewEmail('');
            setNewPassword('');
            alert(`Welcome ${newName}`);
            console.log('Navigating to /login');
            navigate('/login');
        } catch (error) {
            console.log('Error creating user', error)
            setError('Failed to Create user')
        }
    }

    const getUser = async () => {
        try {
            const response = await axios.post(USER_URL, { withCredentials: true });
            setUser(response.data);
        } catch (error) {
            setError('Failed to get user')
        }
    }

    return (

        <div
            style={{
                 marginLeft: '10%',
                marginRight: '10%',
                marginBottom:'5%',
                width:'80%',
                height:"75%",
                border: '5px solid white',
                borderRadius:'10px',
                 marginTop: '6%',
                justifyContent:'center',
                alignItems:'center',
                position:'fixed',
                display:'flex',
                backgroundColor:'white',
            }}>
            <div
                style={{
                    backgroundImage: "url('https://wallpapercave.com/wp/wp9930008.jpg')",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                    border: '5px solid white',
                    objectFit: "cover",
                    justifyContent: "center",  // Center content horizontally
                    alignItems: "center",
                    height: "90%",
                    width: "45vw",
                    // margin: "120px",
                    // marginTop: '150px',
                    // marginLeft:"130px",
                    padding: "0",  // Remove any default padding
                    display: 'flex',  // Ensure flex container for centering
                    justifyContent: 'center', // Center content horizontally
                    alignItems: 'center', // Center content vertically
                }}
            >
                <div>
                <p style={{fontSize:'30px', fontStyle:'italic', marginBottom:'100%', marginRight:'40%', width:'100%', fontWeight:'bold'}}>Enjoy your Journey with <span style={{color:'#041E42', textDecoration:'underline '}}>GlobeGallery</span></p>
                </div>
            </div>

            <div
                style={{
                    //  position: 'fixed',
                    width: "35%",
                    height: '50%',
                    borderRadius:'10px',
                    backgroundColor: '',
                    // border: '2px solid white',
                    // padding: '20px',
                    // boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                    // zIndex: 1000,
                    // justifyContent: 'center',
                    // alignItem: 'center'
                }}
            >
                
                <div style={{marginTop:'-100px', marginLeft:'200px', marginBottom:'50px'}}>
                <h1>Welcome!</h1>
                <h4>Enter your details</h4>
                </div>
                <div style={{position:'fixed', left:'65%', margin:'10px'}}>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', display:'grid', margin:'10px', marginLeft:'50px' }}>
                    <span><b style={{ marginRight: '20px' }}>Name : </b></span>
                    <input
                        style={{ width: '250px', height:'30px', borderRadius:'5px', border:'1px solid grey' }}
                        type='text'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder='Enter Name'
                    />

                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', display:'grid', margin:'10px', marginLeft:'50px' }}>
                    <span><b style={{ marginRight: '20px' }}>Email : </b></span>
                    <input
                        style={{ width: '250px', height:'30px', borderRadius:'5px', border:'1px solid grey' }}
                        type='email'
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder='Enter Email'
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', display:'grid', margin:'10px', marginLeft:'50px' }}>
                    <span><b style={{ marginRight: '20px' }}>Password : </b></span>
                    <input
                        style={{ width: '250px', height:'30px', borderRadius:'5px', border:'1px solid grey' }}
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='Enter Password'
                    />
                </div>

                <button
                    style={{
                        backgroundColor: '#007FFF',
                        border: 'none',
                        borderRadius: '5px',
                        width: '255px',
                        height: '35px',
                        color: 'white',
                        marginLeft:'50px',
                        marginTop:'15px'
                    }}
                    onClick={createUser}>Signup</button>

                <div style={{ marginTop: '40px' }}>
                    <span style={{ color: 'black', borderRadius: '5px', marginRight: '10px', marginLeft:'70px' }}>If Already User :</span>
                    <button
                        style={{
                            backgroundColor: '#7FFFD4',
                            border: 'none',
                            borderRadius: '5px',
                            width: '70px',
                            height: '25px',
                            color: 'black'
                        }}
                        onClick={() => navigate('/login')}>
                        Login
                    </button>
                </div>
                </div>
            </div>


        </div>

    )
}

const userStyle = {

};