import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    IconButton,
    Button,
    Box,
    DialogContentText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import CryptoJS from 'crypto-js';
import { doc, updateDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';

const EditPasswordDialog = ({ open, onClose, selectedPassword }) => {
    const [service, setService] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openDecryptDialog, setOpenDecryptDialog] = useState(false);
    const [decryptPasswordInput, setDecryptPasswordInput] = useState('');
    const [decryptError, setDecryptError] = useState('');
    

    useEffect(() => {
        if (selectedPassword) {
            setService(selectedPassword.serviceName);
            setUsername(selectedPassword.usernameOrEmail);
            setPassword(''); // clear the password to avoid displaying the unencrypted password.
        }
    }, [selectedPassword]);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const generateSecurePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8);
        setPassword(newPassword);
    };

    const handleSavePassword = () => {
        setOpenDecryptDialog(true);
    };

    const handleDecryptAndSave = async () => {
        setDecryptError('');
        const userId = auth.currentUser?.uid;

        try {
            const secretKeyDoc = await getDocs(query(collection(db, 'userSecrets'), where('userId', '==', userId)));
            if (secretKeyDoc.empty) {
                setDecryptError('Secret key not found.');
                return;
            }

            const secretKeyData = secretKeyDoc.docs[0].data();
            const encryptedSecretKey = secretKeyData.encryptedSecretKey;

            const decryptedSecretKey = CryptoJS.AES.decrypt(encryptedSecretKey, decryptPasswordInput).toString(CryptoJS.enc.Utf8);

            if (!decryptedSecretKey) {
                setDecryptError('Incorrect password.');
                return;
            }

            const encryptedPassword = CryptoJS.AES.encrypt(password, decryptedSecretKey).toString();

            const passwordRef = doc(db, 'passwordVault', selectedPassword.id);
            await updateDoc(passwordRef, {
                serviceName: service,
                usernameOrEmail: username,
                encryptedPassword,
            });

            alert('Password updated successfully!');
            onClose();
            setOpenDecryptDialog(false);
        } catch (error) {
            console.error('Error updating password:', error);
            setDecryptError('Failed to update the password. Please try again.');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>Edit Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                        <TextField label="Service" fullWidth value={service} onChange={(e) => setService(e.target.value)} InputProps={{ endAdornment: service && (<IconButton onClick={() => setService('')}><ClearIcon /></IconButton>) }} />
                        <TextField label="Username/Email" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} InputProps={{ endAdornment: username && (<IconButton onClick={() => setUsername('')}><ClearIcon /></IconButton>) }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField label="Password" type={showPassword ? 'text' : 'password'} fullWidth value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ endAdornment: (<>{password && (<IconButton onClick={() => setPassword('')}><ClearIcon /></IconButton>)}<IconButton onClick={handlePasswordVisibility}>{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></>) }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2, width: '100%' }}>
                            <Button variant="outlined" sx={{ backgroundColor: '#F0E8D9', color: '#000', borderRadius: '20px', border: '1px solid #BA8477', textTransform: 'none', px: 3, ':hover': { backgroundColor: '#BA8477', color: '#FFF' } }} onClick={generateSecurePassword}>Generate Secure Password</Button>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="outlined" sx={{ backgroundColor: '#F0E8D9', color: '#000', borderRadius: '20px', border: '1px solid #BA8477', textTransform: 'none', px: 3, ':hover': { backgroundColor: '#BA8477', color: '#FFF' } }} onClick={onClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#BA8477',
                                        color: '#FFF',
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        px: 3,
                                        ':hover': {
                                            backgroundColor: '#966868'
                                        }
                                    }}
                                    onClick={handleSavePassword}
                                    disabled={!service || !username || !password}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={openDecryptDialog} onClose={() => setOpenDecryptDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>Enter Your Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                        <DialogContentText sx={{ textAlign: 'center' }}>
                            Please enter your password to save the updated password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={decryptPasswordInput}
                            onChange={(e) => setDecryptPasswordInput(e.target.value)}
                            error={!!decryptError}
                            helperText={decryptError}
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
                                onClick={() => setOpenDecryptDialog(false)}
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
                                onClick={handleDecryptAndSave}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default EditPasswordDialog;