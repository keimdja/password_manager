import React from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpSupport = () => {
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
                Help and Support
            </Typography>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How to Add a Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        1. Go to the <strong>Password Vault</strong> section. <br />
                        2. Click the <strong>“Add Password”</strong> button. <br />
                        3. Fill in the <strong>Service Name</strong>, <strong>Username/Email</strong>, and <strong>Password</strong>. <br />
                        4. Use the <strong>“Generate Password”</strong> button for a secure suggestion. <br />
                        5. Click <strong>“Save”</strong> to store it.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How to Remove a Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        1. In the <strong>Password Vault</strong>, find the password entry.<br />
                        2. Click the <strong>Delete</strong> (trash icon).<br />
                        3. Confirm the deletion when prompted. <br />
                        <em>⚠️ This action is permanent.</em>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How to Edit a Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        1. Locate the password entry in the <strong>Password Vault</strong>.<br />
                        2. Click the <strong>Edit</strong> (pencil icon).<br />
                        3. Update any fields and click <strong>“Save”</strong> to apply changes.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How to Change Your Account Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        1. Go to the <strong>Account Settings</strong> section.<br />
                        2. Enter the new password and confirm the new password. <br />
                        3. Click <strong>“Change Password”</strong> to update it. <br />
                        4. Confirm the change with your old password and click <strong>“Confirm”</strong>.<br />
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How to Delete Your Account</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        1. Go to <strong>Account Settings</strong>.<br />
                        2. Click <strong>“Delete Account.”</strong><br />
                        3. Confirm with your password to proceed.<br />
                        <em>⚠️ This will permanently delete your account and data.</em>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default HelpSupport;
