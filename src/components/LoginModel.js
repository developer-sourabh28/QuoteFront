import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LOGIN_URL = 'https://quoteback-htn6.onrender.com/user/login'

export default function LoginModel() {

    const navigate = useNavigate();

    const [login, setLogin] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const LoginUser = async () => {
        try {
            const response = await axios.post(
                LOGIN_URL,
                { email, password },
                { withCredentials: true }
            );
    
            console.log('Login successful:', response.data);
            console.log('Login Payload', { email, password });
    
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
    
            // Clear the input fields
            setLogin([...login, response.data]);
            setEmail('');
            setPassword('');

            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            
    
            // Navigate to the home page or dashboard
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Login failed');
            alert('login failed')
        }
    };
    
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
                    backgroundImage: "url('https://wallpapercave.com/wp/wp9929977.jpg')",
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
                <h1>Welcome Back!</h1>
                <h4>Enter your details</h4>
                </div>
                <div style={{position:'fixed', left:'65%', margin:'10px'}}>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', display:'grid', margin:'10px', marginLeft:'50px' }}>
                    <span><b style={{ marginRight: '20px' }}>Email : </b></span>
                    <input
                        style={{ width: '250px', height:'30px', borderRadius:'5px', border:'1px solid grey' }}
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Email'
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', display:'grid', margin:'10px', marginLeft:'50px' }}>
                    <span><b style={{ marginRight: '20px' }}>Password : </b></span>
                    <input
                        style={{ width: '250px', height:'30px', borderRadius:'5px', border:'1px solid grey' }}
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    onClick={LoginUser}>Login</button>

                <div style={{ marginTop: '40px' }}>
                    <span style={{ color: 'black', borderRadius: '5px', marginRight: '10px', marginLeft:'70px' }}>If New User :</span>
                    <button
                        style={{
                            backgroundColor: '#7FFFD4',
                            border: 'none',
                            borderRadius: '5px',
                            width: '70px',
                            height: '25px',
                            color: 'black'
                        }}
                        onClick={() => navigate('/signup')}>
                        Signup
                    </button>
                </div>
                </div>
            </div>


        </div>

    )
}

const userStyle = {
    position: 'fixed',
    width : "50%",
    height : '20%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor : '',
     border : '2px solid black',
    padding: '20px',
    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,   
    justifyContent : 'center',
    alignItem : 'center'
}
