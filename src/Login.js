// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container, Grid } from '@mui/material';
// import { auth } from './firebase'; // Import the Firebase auth instance
// import { signInWithEmailAndPassword } from 'firebase/auth';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       // Handle successful login (redirect to dashboard, etc.)
//       console.log('Logged in successfully!');
//     } catch (err) {
//       setError('Invalid email or password');
//       console.error(err.message);
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Grid container spacing={2} direction="column" alignItems="center">
//         <Grid item>
//           <Typography variant="h5">Login</Typography>
//         </Grid>

//         <Grid item>
//           <TextField
//             variant="outlined"
//             label="Email"
//             fullWidth
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//             type="email"
//             required
//           />
//         </Grid>

//         <Grid item>
//           <TextField
//             variant="outlined"
//             label="Password"
//             fullWidth
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             type="password"
//             required
//           />
//         </Grid>

//         {error && (
//           <Grid item>
//             <Typography color="error">{error}</Typography>
//           </Grid>
//         )}

//         <Grid item>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleLogin}
//             fullWidth
//           >
//             Login
//           </Button>
//         </Grid>

//         <Grid item>
//           <Button
//             variant="text"
//             color="secondary"
//             onClick={() => console.log('Go to sign up page')}
//             fullWidth
//           >
//             Create an Account
//           </Button>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { auth } from './firebase'; // Import the Firebase auth instance
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import SaveAPassLogo from './SaveAPassLogo.png'; // Import your logo file


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Log In and Sign Up

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('Account created successfully!');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('Logged in successfully!');
            }
        } catch (err) {
            setError('Error occurred. Please check your credentials.');
            console.error(err.message);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh', // Full screen height
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#91BBB2', // Background color
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '350px', // Fixed width for the login box
                    backgroundColor: 'white', // White background for the login box
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 4,
                }}
            >
                {/* Logo */}
                <img src={SaveAPassLogo} alt="Save A Pass Logo" style={{ width: '100px', marginBottom: '20px' }} />

                {/* Email and Password Fields */}
                <TextField
                    variant="outlined"
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    type="email"
                    required
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: '#AB7354', // Set the color of the label to earthy brown
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4E908F', // Normal border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#B8E9E2', // Hover border color
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#985B3B', // Focused border color
                            },
                            '& .MuiInputLabel-fieldset': {
                                color: '#AB7354', // Set the color of the label to earthy brown
                            },
                        },
                    }}

                />
                <TextField
                    variant="outlined"
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    type="password"
                    required
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: '#AB7354', // Set the color of the label to earthy brown
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4E908F', // Normal border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#B8E9E2', // Hover border color
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#985B3B', // Focused border color
                            },
                            '& .MuiInputLabel-fieldset': {
                                color: '#AB7354', // Set the color of the label to earthy brown
                            },
                        },
                    }}

                />

                {/* Error Message */}
                {error && <Typography color="error" variant="body2">{error}</Typography>}

                {/* Submit Button */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{ mt: 2, color: 'white', backgroundColor: '#4E908F' }} // Change the button color to #4E908F
                >
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </Button>

                {/* Toggle Text */}
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            variant="text"
                            sx={{ color: '#AB7354' }}
                            onClick={() => {
                                setIsSignUp(!isSignUp); // Toggle between Sign Up and Log In
                                setError(''); // Clear error messages
                            }}

                        >
                            {isSignUp ? 'Have an account? Log In' : "Don't have an account yet? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Login;


