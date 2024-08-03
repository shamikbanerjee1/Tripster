import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as MUIButton, TextField, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PageNav from './PageNav';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import styles from './Login.module.css';
import { graphQLFetch } from '../Api';

export default function Login() {
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("hashedPassword2");
  const [user, setUser] = useState({})

  const { googleLogin,login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  function handleCallbackResponse(response)
  {
    console.log("Encoded JWT ID token: "+response.credential)
    var userObj = jwtDecode(response.credential)
    googleLogin(userObj)
    document.getElementById("signInDiv").hidden = true;
    //navigate("/app");
  }

  useEffect(()=>{
    /* global google */
    google.accounts.id.initialize({
      client_id : "658159785235-i2kvno4gt1e27hmrk9jfc5nknuals7sg.apps.googleusercontent.com",
      callback : handleCallbackResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme : "outlint", size : "large",type: 'standard', shape: 'rectangular'}
    );
    google.accounts.id.prompt();
  }, [navigate]);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  

  
  return (
    <main className={styles.login}>
      <PageNav />
      <div className={styles.loginCard}>
        <h2 style={{color:'black'}}>Welcome back</h2>
        <TextField
          label="Email address"
          style={{ color: '#10a37f' }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& label.Mui-focused': {
              color: '#10a37f',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#10a37f',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#10a37f',
              },
              '&:hover fieldset': {
                borderColor: '#10a37f',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#10a37f',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon style={{ color: '#10a37f' }}/>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          style={{ color: '#10a37f' }}
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& label.Mui-focused': {
              color: '#10a37f',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#10a37f',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#10a37f',
              },
              '&:hover fieldset': {
                borderColor: '#10a37f',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#10a37f',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon style={{ color: '#10a37f' }} />
              </InputAdornment>
            ),
          }}
        />
        <MUIButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          className={styles.loginButton}
          style = {{color:'#10a37f'}}
        >
          Continue
        </MUIButton>
        <p style={{color:'black'}}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <div className={styles.divider}>
          <hr className={styles.left} />
          <span style={{color:'black'}}>OR</span>
          <hr className={styles.right} />
        </div>
        <div id="signInDiv" className={styles.signInDiv}></div>
      </div>
    </main>
  );
};


