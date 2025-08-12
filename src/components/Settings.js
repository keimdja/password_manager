import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import CryptoJS from 'crypto-js';

const Settings = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [oldPasswordDialogOpen, setOldPasswordDialogOpen] = useState(false);
    const [oldPasswordInput, setOldPasswordInput] = useState('');



    // useEffect(() => {
    //     if (!user) {
    //         setError('No user is logged in.');
    //     }
    // }, [user]);

    // const handlePasswordChange = () => {
    //     if (!password || !confirmPassword) {
    //         setError('Both fields are required.');
    //         return;
    //     }
    //     if (password !== confirmPassword) {
    //         setError('Passwords do not match.');
    //         return;
    //     }
    //     setOldPasswordDialogOpen(true); // Open dialog instead of prompt
    // };


    // const handleConfirmPasswordChange = async () => {
    //     setOldPasswordDialogOpen(false);

    //     try {
    //         const userSecretsQuery = query(collection(db, 'userSecrets'), where('userId', '==', user.uid));
    //         const querySnapshot = await getDocs(userSecretsQuery);

    //         if (querySnapshot.empty) throw new Error('No secret key found for this user.');

    //         const secretDoc = querySnapshot.docs[0];
    //         const encryptedSecretKey = secretDoc.data().encryptedSecretKey;

    //         const bytes = CryptoJS.AES.decrypt(encryptedSecretKey, oldPasswordInput);
    //         const decryptedSecretKey = bytes.toString(CryptoJS.enc.Utf8);

    //         if (!decryptedSecretKey) throw new Error('Incorrect current password.');

    //         await updatePassword(user, password);

    //         const reEncryptedSecretKey = CryptoJS.AES.encrypt(decryptedSecretKey, password).toString();

    //         await updateDoc(doc(db, 'userSecrets', secretDoc.id), {
    //             encryptedSecretKey: reEncryptedSecretKey,
    //         });

    //         setSuccessMessage('Password and secret key updated successfully.');
    //         setError('');
    //         setPassword('');
    //         setConfirmPassword('');
    //         setOldPasswordInput('');
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };


    // const handleDeleteAccount = async () => {
    //     if (!deletePassword) {
    //         setDeleteError('Password is required to delete your account.');
    //         return;
    //     }

    //     try {
    //         const credential = EmailAuthProvider.credential(user.email, deletePassword);
    //         await reauthenticateWithCredential(user, credential); // Re-authenticate user
    //         await deleteUser(user); // Delete account
    //         setSuccessMessage('Account deleted successfully.');
    //         setError('');
    //         setDeleteDialogOpen(false);
    //     } catch (error) {
    //         setDeleteError(error.message);
    //     }
    // };

    // Check if a user is logged in when the component mounts or when the user state changes
    useEffect(() => {
        if (!user) {
            setError('No user is logged in.');
        }
    }, [user]);

    // Handle form submission when the user initiates a password change
    const handlePasswordChange = () => {
        // Ensure both password fields are filled
        if (!password || !confirmPassword) {
            setError('Both fields are required.');
            return;
        }

        // Ensure new password and confirmation match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Open dialog to request the user's current password
        setOldPasswordDialogOpen(true);
    };

    // Handle the actual password change after the user provides their current password
    const handleConfirmPasswordChange = async () => {
        setOldPasswordDialogOpen(false); // Close the old password input dialog

        try {
            // Query the 'userSecrets' collection to get the user's encrypted secret key
            const userSecretsQuery = query(collection(db, 'userSecrets'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(userSecretsQuery);

            // Handle the case where no secret key is found
            if (querySnapshot.empty) throw new Error('No secret key found for this user.');

            const secretDoc = querySnapshot.docs[0]; // Get the document
            const encryptedSecretKey = secretDoc.data().encryptedSecretKey;

            // Decrypt the secret key using the current password provided by the user
            const bytes = CryptoJS.AES.decrypt(encryptedSecretKey, oldPasswordInput);
            const decryptedSecretKey = bytes.toString(CryptoJS.enc.Utf8);

            // If decryption fails, the current password is incorrect
            if (!decryptedSecretKey) throw new Error('Incorrect current password.');

            // Update the Firebase account password with the new password
            await updatePassword(user, password);

            // Re-encrypt the secret key with the new password
            const reEncryptedSecretKey = CryptoJS.AES.encrypt(decryptedSecretKey, password).toString();

            // Save the newly encrypted key back to Firestore
            await updateDoc(doc(db, 'userSecrets', secretDoc.id), {
                encryptedSecretKey: reEncryptedSecretKey,
            });

            // Reset form state and show success message
            setSuccessMessage('Password and secret key updated successfully.');
            setError('');
            setPassword('');
            setConfirmPassword('');
            setOldPasswordInput('');
        } catch (error) {
            // Catch and display any errors that occur during the process
            setError(error.message);
        }
    };

    // Handle the process of deleting a user's account
    const handleDeleteAccount = async () => {
        // Ensure the user provided their password for reauthentication
        if (!deletePassword) {
            setDeleteError('Password is required to delete your account.');
            return;
        }

        try {
            // Re-authenticate the user using their email and entered password
            const credential = EmailAuthProvider.credential(user.email, deletePassword);
            await reauthenticateWithCredential(user, credential);

            // If re-authentication succeeds, delete the user account
            await deleteUser(user);

            // Notify user of successful deletion and close the dialog
            setSuccessMessage('Account deleted successfully.');
            setError('');
            setDeleteDialogOpen(false);
        } catch (error) {
            // Handle authentication or deletion errors
            setDeleteError(error.message);
        }
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="h5" sx={{ color: '#654450', textAlign: 'center' }} gutterBottom>
                Account Settings
            </Typography>

            {error && (
                <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>
            )}
            {successMessage && (
                <Typography sx={{ color: 'green', mb: 2 }}>{successMessage}</Typography>
            )}

            <Typography variant="body1" sx={{ mb: 2 }}>
                Logged in as: <strong>{user?.email}</strong>
            </Typography>

            {/* Password Fields */}
            <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                    width: '60%',
                    mb: 2,
                }}
                InputProps={{
                    endAdornment: password && (
                        <IconButton onClick={() => setPassword('')}>
                            <ClearIcon />
                        </IconButton>
                    ),
                }}
            />

            <TextField
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                    width: '60%',
                    mb: 2,
                }}
                InputProps={{
                    endAdornment: confirmPassword && (
                        <IconButton onClick={() => setConfirmPassword('')}>
                            <ClearIcon />
                        </IconButton>
                    ),
                }}
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#BA8477',
                        color: '#FFF',
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        ':hover': { backgroundColor: '#966868' },
                    }}
                    onClick={handlePasswordChange}
                >
                    Change Password
                </Button>

                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: '#F0E8D9',
                        color: '#000',
                        border: '1px solid #BA8477',
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        ':hover': { backgroundColor: '#BA8477', color: '#FFF' },
                    }}
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    Delete Account
                </Button>

                <Dialog open={oldPasswordDialogOpen} onClose={() => setOldPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>
                        Confirm Password Change
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                            <DialogContentText sx={{ textAlign: 'center' }}>
                                Please enter your current password to change to a new password.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                label="Current Password"
                                type="password"
                                fullWidth
                                value={oldPasswordInput}
                                onChange={(e) => setOldPasswordInput(e.target.value)}
                                error={!!error && error.toLowerCase().includes('decrypt')}
                                helperText={error && error.toLowerCase().includes('decrypt') ? error : ''}
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
                                    onClick={() => {
                                        setOldPasswordDialogOpen(false);
                                        setOldPasswordInput('');
                                        setError('');
                                    }}
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
                                    onClick={handleConfirmPasswordChange}
                                >
                                    Confirm
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>



                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>
                        Confirm Account Deletion
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                            <DialogContentText sx={{ textAlign: 'center' }}>
                                Please enter your password to permanently delete your account. This action cannot be undone.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                label="Password"
                                type="password"
                                fullWidth
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                error={!!deleteError}
                                helperText={deleteError}
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
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                        setDeletePassword('');
                                        setDeleteError('');
                                    }}
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
                                    onClick={handleDeleteAccount}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>


            </Box>
        </Box>
    );
};

export default Settings;
