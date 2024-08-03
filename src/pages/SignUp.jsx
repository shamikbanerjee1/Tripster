import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as MUIButton, TextField,  InputAdornment } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../contexts/AuthContext';
import styles from './SignUp.module.css';
import PageNav from './PageNav';
import { graphQLFetch } from '../Api';


const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
    passwordHash: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); 
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (!/^[a-zA-Z\s'-]+$/g.test(value)) return 'Name contains invalid characters';
        return '';
      case 'phone':
        if (!value) return 'Phone is required';
        if (!/^\d+$/g.test(value)) return 'Phone must be numeric';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'passwordHash':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    for (const [name, value] of Object.entries(userDetails)) {
      const error = validateField(name, value);
      if (error) {
        formIsValid = false;
        newErrors[name] = error;
      }
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('User details:', userDetails);
        const userDetailsWithCreatedAt = {
          ...userDetails,
          createdAt: new Date().toISOString(), // Set the current date in ISO format
        };
        const data = await graphQLFetch(`mutation($user: InputUser!) {
          addUser(user: $user) {
            user {
              _id
              name
              createdAt
            }
            errorMessage
          }
        }`, { user: userDetailsWithCreatedAt });
        console.log('Mutation response:', data);
        if (data.addUser.errorMessage) {
          console.error('Failed to add user:', data.addUser.errorMessage);
          setErrors({ email: data.addUser.errorMessage });
        } else {
          console.log('User added:', data.addUser.user);
          setUserDetails({
            name: '',
            phone: '',
            email: '',
            passwordHash: '',
          });
          setSuccessMessage('Account created successfully! Login with your credentials.');
          setTimeout(() => setSuccessMessage(''), 4000);
        }
      } catch (error) {
        console.error("Error in the addUser mutation:", error);
      }
      // signup(userDetails.email, userDetails.password, userDetails.name, userDetails.phone);
      // navigate('/app');
    }
  };

  return (
    <main className={styles.signup}>
    <PageNav />
    <div className={styles.signupCard}>
      
        <h2 style={{color:'black'}}>Create Account</h2>
        
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={userDetails.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
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
                  <AccountCircle style={{ color: '#10a37f' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={userDetails.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
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
                  <PhoneIcon style={{ color: '#10a37f' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={userDetails.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
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
            name="passwordHash"
            label="Password"
            type="passwordHash"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={userDetails.passwordHash}
            onChange={handleChange}
            error={!!errors.passwordHash}
            helperText={errors.passwordHash}
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
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.signUpButton}
            style={{
              backgroundColor: '#000', // Black background
              color: '#10a37f', // Green text
            }}
          >
            Sign Up
          </MUIButton>
        </form>
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
      </main>
  );
};

export default SignUp;
