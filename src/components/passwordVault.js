import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, onSnapshot, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import CryptoJS from 'crypto-js';
import EditPasswordDialog from './EditPasswordDialog';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const PasswordVault = () => {
    const [passwords, setPasswords] = useState([]);
    const [viewPassword, setViewPassword] = useState({});
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDecryptDialog, setOpenDecryptDialog] = useState(false);
    const [decryptPasswordInput, setDecryptPasswordInput] = useState('');
    const [decryptError, setDecryptError] = useState('');
    const [passwordToView, setPasswordToView] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [passwordToConfirmDelete, setPasswordToConfirmDelete] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [itemToDeleteId, setItemToDeleteId] = useState(null);
    const [showDeletePassword, setShowDeletePassword] = useState(false);



    //     const decryptPassword = async (encryptedPassword, userPassword) => {
    //         try {
    //             const userId = auth.currentUser?.uid;
    //             const secretKeyDoc = await getDocs(query(collection(db, 'userSecrets'), where('userId', '==', userId)));
    //             if (secretKeyDoc.empty) {
    //                 setDecryptError('Secret key not found.');
    //                 return null;
    //             }

    //             const secretKeyData = secretKeyDoc.docs[0].data();
    //             const encryptedSecretKey = secretKeyData.encryptedSecretKey;

    //             const decryptedSecretKey = CryptoJS.AES.decrypt(encryptedSecretKey, userPassword).toString(CryptoJS.enc.Utf8);

    //             if (!decryptedSecretKey) {
    //                 setDecryptError('Incorrect password.');
    //                 return null;
    //             }

    //             const bytes = CryptoJS.AES.decrypt(encryptedPassword, decryptedSecretKey);
    //             return bytes.toString(CryptoJS.enc.Utf8) || '';
    //         } catch (error) {
    //             console.error('Decryption error:', error);
    //             setDecryptError('Decryption failed.');
    //             return null;
    //         }
    //     };

    //     useEffect(() => {
    //         const user = auth.currentUser;
    //         if (!user) {
    //             console.warn('No authenticated user found.');
    //             return;
    //         }

    //         const passwordsRef = collection(db, 'passwordVault');
    //         const q = query(passwordsRef, where('userId', '==', user.uid));

    //         const unsubscribe = onSnapshot(q, (snapshot) => {
    //             const passwordsData = snapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }));
    //             setPasswords(passwordsData);
    //         });

    //         return () => unsubscribe();
    //     }, []);

    //     const toggleViewPassword = async (entry) => {
    //         if (viewPassword[entry.id]) {
    //             setViewPassword((prev) => ({ ...prev, [entry.id]: false }));
    //         } else {
    //             setPasswordToView(entry);
    //             setOpenDecryptDialog(true);
    //         }
    //     };

    //     const handleDecryptPassword = async () => {
    //         setDecryptError('');
    //         const decrypted = await decryptPassword(passwordToView.encryptedPassword, decryptPasswordInput);

    //         if (decrypted) {
    //             setViewPassword((prev) => ({ ...prev, [passwordToView.id]: decrypted }));
    //             setOpenDecryptDialog(false);
    //             setDecryptPasswordInput('');
    //         }
    //     };

    //     const handleEdit = (entry) => {
    //         setSelectedPassword(entry);
    //         setOpenEditDialog(true);
    //     };

    //     const promptDeletePassword = (id) => {
    //         setItemToDeleteId(id);
    //         setPasswordToConfirmDelete('');
    //         setDeleteError('');
    //         setOpenDeleteDialog(true);
    //     };



    // const handleConfirmDelete = async () => {
    //     const user = auth.currentUser;

    //     if (!passwordToConfirmDelete) {
    //         setDeleteError('Password is required.');
    //         return;
    //     }

    //     const credential = EmailAuthProvider.credential(user.email, passwordToConfirmDelete);

    //     try {
    //         await reauthenticateWithCredential(user, credential);
    //         await deleteDoc(doc(db, 'passwordVault', itemToDeleteId));
    //         setPasswords(passwords.filter((password) => password.id !== itemToDeleteId));
    //         setOpenDeleteDialog(false);
    //     } catch (error) {
    //         console.error('Error during reauthentication or deletion:', error);
    //         setDeleteError('Incorrect password or failed to delete. Please try again.');
    //     }
    // };

    // Function to decrypt a stored password using the user's account password
    const decryptPassword = async (encryptedPassword, userPassword) => {
        try {
            // Get the currently logged-in user's UID
            const userId = auth.currentUser?.uid;

            // Fetch the user's encrypted secret key from Firestore
            const secretKeyDoc = await getDocs(
                query(collection(db, 'userSecrets'), where('userId', '==', userId))
            );

            // If no key is found, set error and return
            if (secretKeyDoc.empty) {
                setDecryptError('Secret key not found.');
                return null;
            }

            // Extract the encrypted secret key from Firestore document
            const secretKeyData = secretKeyDoc.docs[0].data();
            const encryptedSecretKey = secretKeyData.encryptedSecretKey;

            // Attempt to decrypt the secret key using the user's account password
            const decryptedSecretKey = CryptoJS.AES.decrypt(
                encryptedSecretKey,
                userPassword
            ).toString(CryptoJS.enc.Utf8);

            // If decryption fails, set error and return
            if (!decryptedSecretKey) {
                setDecryptError('Incorrect password.');
                return null;
            }

            // Use the decrypted secret key to decrypt the stored password
            const bytes = CryptoJS.AES.decrypt(encryptedPassword, decryptedSecretKey);
            return bytes.toString(CryptoJS.enc.Utf8) || '';
        } catch (error) {
            console.error('Decryption error:', error);
            setDecryptError('Decryption failed.');
            return null;
        }
    };

    // Load all passwords belonging to the current user when the component mounts
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            console.warn('No authenticated user found.');
            return;
        }

        // Reference to the 'passwordVault' collection filtered by userId
        const passwordsRef = collection(db, 'passwordVault');
        const q = query(passwordsRef, where('userId', '==', user.uid));

        // Listen for real-time updates from Firestore
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const passwordsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPasswords(passwordsData);
        });

        // Clean up Firestore listener when component unmounts
        return () => unsubscribe();
    }, []);

    // Toggle visibility of a password (triggers decryption if not already viewed)
    const toggleViewPassword = async (entry) => {
        if (viewPassword[entry.id]) {
            // If already visible, hide the password
            setViewPassword((prev) => ({ ...prev, [entry.id]: false }));
        } else {
            // Otherwise, prepare to decrypt and show password
            setPasswordToView(entry);
            setOpenDecryptDialog(true); // Open password confirmation dialog
        }
    };

    // Handle decryption dialog confirmation
    const handleDecryptPassword = async () => {
        setDecryptError('');

        // Decrypt password using user input
        const decrypted = await decryptPassword(
            passwordToView.encryptedPassword,
            decryptPasswordInput
        );

        if (decrypted) {
            // Store the decrypted password in state for display
            setViewPassword((prev) => ({
                ...prev,
                [passwordToView.id]: decrypted,
            }));
            setOpenDecryptDialog(false);
            setDecryptPasswordInput('');
        }
    };

    // Handle "Edit" button click for a password entry
    const handleEdit = (entry) => {
        setSelectedPassword(entry);
        setOpenEditDialog(true);
    };

    // Prompt to confirm password deletion
    const promptDeletePassword = (id) => {
        setItemToDeleteId(id); // Store the ID of the password to delete
        setPasswordToConfirmDelete(''); // Clear previous input
        setDeleteError('');
        setOpenDeleteDialog(true); // Show the delete confirmation dialog
    };

    // Confirm deletion of a password after reauthentication
    const handleConfirmDelete = async () => {
        const user = auth.currentUser;

        // Require user to input their password to proceed
        if (!passwordToConfirmDelete) {
            setDeleteError('Password is required.');
            return;
        }

        // Create Firebase credential for reauthentication
        const credential = EmailAuthProvider.credential(
            user.email,
            passwordToConfirmDelete
        );

        try {
            // Reauthenticate user
            await reauthenticateWithCredential(user, credential);

            // Delete the password entry from Firestore
            await deleteDoc(doc(db, 'passwordVault', itemToDeleteId));

            // Remove the password from local state
            setPasswords(passwords.filter((password) => password.id !== itemToDeleteId));

            setOpenDeleteDialog(false); // Close the dialog
        } catch (error) {
            console.error('Error during reauthentication or deletion:', error);
            setDeleteError('Incorrect password or failed to delete. Please try again.');
        }
    };




    return (
        <Box sx={{ width: '100%', maxWidth: '800px', backgroundColor: '#FFF', borderRadius: 2, p: 3, boxShadow: 3, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#654450' }}>Password Vault</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#F0E8D9' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Username/Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Password</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {passwords.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.serviceName}</TableCell>
                                <TableCell>{entry.usernameOrEmail}</TableCell>
                                <TableCell>
                                    {viewPassword[entry.id] ? viewPassword[entry.id] : '••••••••'}
                                    <IconButton onClick={() => toggleViewPassword(entry)}>
                                        {viewPassword[entry.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(entry)}>
                                        <EditIcon sx={{ color: '#654450' }} />
                                    </IconButton>
                                    <IconButton onClick={() => promptDeletePassword(entry.id)}>

                                        <DeleteIcon sx={{ color: '#BA8477' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDecryptDialog} onClose={() => setOpenDecryptDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>Enter Your Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                        <DialogContentText sx={{ textAlign: 'center' }}>
                            Please enter your password to view the saved password.
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
                                onClick={handleDecryptPassword}
                            >
                                View
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>


            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                {selectedPassword && (
                    <EditPasswordDialog
                        open={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        selectedPassword={selectedPassword}
                    />
                )}
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#654450', textAlign: 'center' }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                        <DialogContentText sx={{ textAlign: 'center' }}>
                            Please enter your account password to delete this saved password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={passwordToConfirmDelete}
                            onChange={(e) => setPasswordToConfirmDelete(e.target.value)}
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
                                onClick={() => setOpenDeleteDialog(false)}
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
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

        </Box>
    );
};

export default PasswordVault;



