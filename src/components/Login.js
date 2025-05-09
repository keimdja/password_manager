import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoSaveAPass from '../assets/LogoSaveAPass.png';
import BackgroundGraphicDesign from '../assets/background-graphic-design.png';
import CryptoJS from 'crypto-js'; // Import CryptoJS for encryption
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const generateRandomSecretKey = () => {
        return CryptoJS.lib.WordArray.random(32).toString(); // Generate a 256-bit random key
    };

    const encryptSecretKey = (secretKey, password) => {
        return CryptoJS.AES.encrypt(secretKey, password).toString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Generate and encrypt the secret key
                const secretKey = generateRandomSecretKey();
                const encryptedSecretKey = encryptSecretKey(secretKey, password);

                // Add to userSecrets collection in Firestore
                await addDoc(collection(db, 'userSecrets'), {
                    userId: user.uid,
                    encryptedSecretKey: encryptedSecretKey,
                });

                navigate('/dashboard');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#A9AAA9',
                backgroundImage: `url(${BackgroundGraphicDesign})`,
                backgroundSize: 'cover',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '350px',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 4,
                }}
            >
                <img src={LogoSaveAPass} alt="Save A Pass Logo" style={{ width: '100px', marginBottom: '20px' }} />

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
                            color: '#3C4B63', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#654450', // Label color when focused
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#647283', // Normal border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#F0E8D9', // Hover border color
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#654450', // Focused border color
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
                            color: '#3C4B63', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#654450', // Label color when focused
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#647283', // Normal border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#F0E8D9', // Hover border color
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#654450', // Focused border color
                            },
                        },
                    }}
                />

                {error && <Typography color="error" variant="body2">{error}</Typography>}

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{
                        mt: 2, color: 'white', backgroundColor: '#3C4B63',
                        '&:hover': {
                            backgroundColor: '#647283',
                        },
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : isSignUp ? 'Sign Up' : 'Log In'}
                </Button>

                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            variant="text"
                            sx={{ color: '#654450' }}
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
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


