import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoSaveAPass from '../assets/LogoSaveAPass.png'; // Import your logo file
import BackgroundGraphicDesign from '../assets/background-graphic-design.png'; // Import your background
import AddPassword from './AddPassword'; // Import AddPassword component
import PasswordVault from './passwordVault';
import Settings from './Settings';
import HelpSupport from './HelpSupport';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('Password Vault');
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // Redirect to the login page after logout
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Password Vault':
                return <PasswordVault />;
            case 'Settings':
                return <Settings />;
            case 'Help/Support':
                return <HelpSupport />;
            case 'Logout':
                handleLogout();
                return null;
                case 'Add Password':
                    return <AddPassword setActiveComponent={setActiveComponent} />;                 
            default:
                return <Typography>Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#A9AAA9',
                backgroundImage: `url(${BackgroundGraphicDesign})`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: '#3C4B63' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* App Logo */}
                    <Box>
                        <img src={LogoSaveAPass} alt="Save A Pass Logo" style={{ height: '40px' }} />
                    </Box>
                    {/* Navigation Buttons */}
                    <Box>
                        <Button color="inherit" onClick={() => setActiveComponent('Password Vault')}>
                            Password Vault
                        </Button>
                        <Button color="inherit" onClick={() => setActiveComponent('Settings')}>
                            Settings
                        </Button>
                        <Button color="inherit" onClick={() => setActiveComponent('Help/Support')}>
                            Help/Support
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                {/* Search Bar and Add Button */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        gap: 2,
                        width: '100%',
                        maxWidth: '800px',
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#BA8477',
                            color: '#FFF',
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 3,
                            ':hover': {
                                backgroundColor: '#966868',
                            },
                        }}
                        onClick={() => setActiveComponent('Add Password')}
                    >
                        <AddIcon />
                        Add New Password
                    </Button>
                </Box>
                
                {renderActiveComponent()}

            </Box>
        </Box>
    );
};

export default Dashboard;

