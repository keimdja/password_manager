import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CryptoJS from 'crypto-js';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import ClearIcon from '@mui/icons-material/Clear';

const AddPassword = ({ setActiveComponent }) => {
    const [service, setService] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogPassword, setDialogPassword] = useState('');
    const [dialogError, setDialogError] = useState('');

    const generateSecurePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8);
        setPassword(newPassword);
    };
    

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleSavePassword = () => {
        setOpenDialog(true);
    };

    const handleDialogSave = async () => {
        setDialogError('');
        const userId = auth.currentUser?.uid;

        // Inside handleDialogSave:
        console.log('userId:', userId);


        try {

            // Inside handleDialogSave:
            console.log('userId:', userId);

            const secretKeyDoc = await getDocs(query(collection(db, 'userSecrets'), where('userId', '==', userId)));
            if (secretKeyDoc.empty) {
                setDialogError('Secret key not found.');
                return;
            }

            const secretKeyData = secretKeyDoc.docs[0].data();
            const encryptedSecretKey = secretKeyData.encryptedSecretKey;

            const decryptedSecretKey = CryptoJS.AES.decrypt(encryptedSecretKey, dialogPassword).toString(CryptoJS.enc.Utf8);

            if (!decryptedSecretKey) {
                setDialogError('Incorrect password.');
                return;
            }

            const encryptedPassword = CryptoJS.AES.encrypt(password, decryptedSecretKey).toString();

            await addDoc(collection(db, 'passwordVault'), {
                userId,
                serviceName: service,
                usernameOrEmail: username,
                encryptedPassword,
                createdAt: serverTimestamp(),
            });

            alert('Password saved successfully!');
            setOpenDialog(false);
            setService('');
            setUsername('');
            setPassword('');
            setActiveComponent('Password Vault');

            // Inside handleDialogSave:
            console.log('userId:', userId);
            console.log('request.resource.data:', { userId, serviceName: service, usernameOrEmail: username, encryptedPassword });
            console.log('request.auth.uid:', auth.currentUser?.uid);
        } catch (error) {
            // Inside handleDialogSave:
            console.log('userId:', userId);

            console.log('request.auth.uid:', auth.currentUser?.uid);
            console.error('Error saving password:', error);
            setDialogError('An error occurred.');
        }
    };

    const handleCancel = () => {
        setActiveComponent('Password Vault');
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '800px',
                backgroundColor: '#FFF',
                borderRadius: 2,
                p: 3,
                boxShadow: 3,
                minHeight: '300px',
                display: 'flex', // Enable flexbox
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'center', // Center vertically
                alignItems: 'center', // Center horizontally
            }}
        >
            <Typography variant="h5" sx={{ color: '#654450', textAlign: 'center' }} gutterBottom>
                Add New Password
            </Typography>

            {/* Service Field */}
            <TextField
                label="Service"
                fullWidth
                value={service}
                onChange={(e) => setService(e.target.value)}
                InputProps={{
                    endAdornment: service && (
                        <IconButton onClick={() => setService('')}>
                            <ClearIcon />
                        </IconButton>
                    ),
                }}
                sx={{
                    width: '60%',
                    mb: 2,
                    '& .MuiInputLabel-root': {
                        color: '#3C4B63',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#654450',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#647283',
                        },
                        '&:hover fieldset': {
                            borderColor: '#F0E8D9',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#654450',
                        },
                    },
                }}
            />

            {/* Username Field */}
            <TextField
                label="Username/Email"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                    endAdornment: username && (
                        <IconButton onClick={() => setUsername('')}>
                            <ClearIcon />
                        </IconButton>
                    ),
                }}
                sx={{
                    width: '60%',
                    mb: 2,
                    '& .MuiInputLabel-root': {
                        color: '#3C4B63',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#654450',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#647283',
                        },
                        '&:hover fieldset': {
                            borderColor: '#F0E8D9',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#654450',
                        },
                    },
                }}
            />

            {/* Password Field */}
            {/* Password Field and Generate Button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2, // Space between the text field and the button
                    width: '60%', // Matches the width of the text fields
                    mb: 2,
                }}
            >
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <>
                                {password && (
                                    <IconButton onClick={() => setPassword('')}>
                                        <ClearIcon />
                                    </IconButton>
                                )}
                                <IconButton onClick={handlePasswordVisibility}>
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </>
                        ),
                    }}
                    sx={{
                        width: '50%',
                        '& .MuiInputLabel-root': {
                            color: '#3C4B63',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#654450',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#647283',
                            },
                            '&:hover fieldset': {
                                borderColor: '#F0E8D9',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#654450',
                            },
                        },
                    }}
                />

                <Button
                    variant="outlined"
                    sx={{
                        whiteSpace: 'nowrap', // Prevent wrapping
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: '#F0E8D9',
                        color: '#000',
                        borderRadius: '20px',
                        border: '1px solid #BA8477',
                        textTransform: 'none',
                        px: 3,
                        ':hover': {
                            backgroundColor: '#BA8477',
                            color: '#FFF',
                        },
                    }}
                    onClick={generateSecurePassword}
                >
                    Generate Secure Password
                </Button>



            </Box>

            {/* Buttons section remains unchanged */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                }}
            >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            backgroundColor: '#F0E8D9',
                            color: '#000',
                            border: '1px solid #BA8477',
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 3,
                            ':hover': {
                                backgroundColor: '#BA8477',
                                color: '#FFF',
                            },
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#BA8477',
                            color: '#FFF',
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 3,
                            ':hover': {
                                backgroundColor: '#966868',
                            },
                        }}
                        onClick={handleSavePassword}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>
        Enter Your Password
    </DialogTitle>
    <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
            <DialogContentText sx={{ textAlign: 'center' }}>
                Please enter your password to save the new password.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                value={dialogPassword}
                onChange={(e) => setDialogPassword(e.target.value)}
                error={!!dialogError}
                helperText={dialogError}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: '#F0E8D9',
                        color: '#000',
                        borderRadius: '20px',
                        border: '1px solid #BA8477',
                        textTransform: 'none',
                        px: 3,
                        ':hover': {
                            backgroundColor: '#BA8477',
                            color: '#FFF',
                        },
                    }}
                    onClick={() => setOpenDialog(false)}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#BA8477',
                        color: '#FFF',
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        ':hover': {
                            backgroundColor: '#966868',
                        },
                    }}
                    onClick={handleDialogSave}
                >
                    Save
                </Button>
            </Box>
        </Box>
    </DialogContent>
</Dialog>

        </Box>


    );
};

export default AddPassword;
