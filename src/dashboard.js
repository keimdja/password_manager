// import React, { useState } from 'react';
// import { AppBar, Toolbar, Button, Box, TextField, Typography } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import LogoSaveAPass from './LogoSaveAPass.png'; // Import your logo file
// import BackgroundDesign from './background-design.png'; // Import your logo file\
// import BackgroundGraphicDesign from './background-graphic-design.png'; // Import your logo file

// const Dashboard = () => {
//     const [activeComponent, setActiveComponent] = useState('Password Vault');

//     const renderActiveComponent = () => {
//         switch (activeComponent) {
//             case 'Password Vault':
//                 return <div>Password Vault Component</div>;
//             case 'Settings':
//                 return <div>Settings Component</div>;
//             case 'Help/Support':
//                 return <div>Help/Support Component</div>;
//             case 'Logout':
//                 return <div>Logout Component</div>;
//             default:
//                 return <div>Welcome to the Dashboard</div>;
//         }
//     };

// return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 backgroundColor: '#A9AAA9',
//                 backgroundImage: `url(${BackgroundGraphicDesign})`,
//                 backgroundSize: 'cover',
//                 display: 'flex',
//                 flexDirection: 'column',
//             }}
//         >
//             {/* Navbar */}
//             <AppBar position="static" sx={{ backgroundColor: '#3C4B63' }}>
//                 <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     {/* App Logo */}
//                     <Box>
//                         <img src={LogoSaveAPass} alt="Save A Pass Logo" style={{ height: '40px' }} />
//                     </Box>
//                     {/* Navigation Buttons */}
//                     <Box>
//                         <Button color="inherit" onClick={() => setActiveComponent('Password Vault')}>
//                             Password Vault
//                         </Button>
//                         <Button color="inherit" onClick={() => setActiveComponent('Settings')}>
//                             Settings
//                         </Button>
//                         <Button color="inherit" onClick={() => setActiveComponent('Help/Support')}>
//                             Help/Support
//                         </Button>
//                         <Button color="inherit" onClick={() => setActiveComponent('Logout')}>
//                             Logout
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* Main Content */}
//             <Box
//                 sx={{
//                     flex: 1,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 3,
//                 }}
//             >
//                 {/* Search Bar and Add Button */}
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         mb: 3,
//                         gap: 2,
//                         width: '100%',
//                         maxWidth: '800px',
//                     }}
//                 >
//                     <TextField
//                         variant="outlined"
//                         placeholder="Search passwords..."
//                         sx={{
//                             flex: 1,
//                             backgroundColor: '#FFF',
//                             borderRadius: 1,
//                             '.MuiOutlinedInput-root': {
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: '#BA8477',
//                                 },
//                             },
//                         }}
//                     />
//                     <Button
//                         variant="contained"
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 1,
//                             backgroundColor: '#BA8477',
//                             color: '#FFF',
//                             borderRadius: '20px',
//                             textTransform: 'none',
//                             px: 3,
//                             ':hover': {
//                                 backgroundColor: '#966868',
//                             },
//                         }}
//                     >
//                         <AddIcon />
//                         Add New Password
//                     </Button>
//                 </Box>

//                 {/* Dynamic Content Box */}
//                 <Box
//                     sx={{
//                         width: '100%',
//                         maxWidth: '800px',
//                         backgroundColor: '#FFF',
//                         borderRadius: 2,
//                         p: 3,
//                         boxShadow: 3,
//                         minHeight: '300px',
//                     }}
//                 >
//                     {renderActiveComponent()}
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default Dashboard;

// import React, { useState } from 'react';
// import { AppBar, Toolbar, Button, Box, TextField, Typography } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { auth } from './firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import LogoSaveAPass from './LogoSaveAPass.png'; // Import your logo file
// import BackgroundGraphicDesign from './background-graphic-design.png'; // Import your background

// const Dashboard = () => {
//     const [activeComponent, setActiveComponent] = useState('Password Vault');
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         await signOut(auth);
//         navigate('/'); // Redirect to the login page after logout
//     };

//     const renderActiveComponent = () => {
//         switch (activeComponent) {
//             case 'Password Vault':
//                 return <Typography>Password Vault Component (Coming Soon)</Typography>;
//             case 'Settings':
//                 return <Typography>Settings Component (Coming Soon)</Typography>;
//             case 'Help/Support':
//                 return <Typography>Help/Support Component (Coming Soon)</Typography>;
//             case 'Logout':
//                 handleLogout();
//                 return null;
//             default:
//                 return <Typography>Welcome to the Dashboard</Typography>;
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 backgroundColor: '#A9AAA9',
//                 backgroundImage: `url(${BackgroundGraphicDesign})`,
//                 backgroundSize: 'cover',
//                 display: 'flex',
//                 flexDirection: 'column',
//             }}
//         >
//             {/* Navbar */}
//             <AppBar position="static" sx={{ backgroundColor: '#3C4B63' }}>
//                 <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     {/* App Logo */}
//                     <Box>
//                         <img src={LogoSaveAPass} alt="Save A Pass Logo" style={{ height: '40px' }} />
//                     </Box>
//                     {/* Navigation Buttons */}
//                     <Box>
//                         <Button color="inherit" onClick={() => setActiveComponent('Password Vault')}>
//                             Password Vault
//                         </Button>
//                         <Button color="inherit" onClick={() => setActiveComponent('Settings')}>
//                             Settings
//                         </Button>
//                         <Button color="inherit" onClick={() => setActiveComponent('Help/Support')}>
//                             Help/Support
//                         </Button>
//                         <Button color="inherit" onClick={handleLogout}>
//                             Logout
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* Main Content */}
//             <Box
//                 sx={{
//                     flex: 1,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 3,
//                 }}
//             >
//                 {/* Search Bar and Add Button */}
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         mb: 3,
//                         gap: 2,
//                         width: '100%',
//                         maxWidth: '800px',
//                     }}
//                 >
//                     <TextField
//                         variant="outlined"
//                         placeholder="Search passwords..."
//                         sx={{
//                             flex: 1,
//                             backgroundColor: '#FFF',
//                             borderRadius: 1,
//                             '.MuiOutlinedInput-root': {
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: '#BA8477',
//                                 },
//                             },
//                         }}
//                     />
//                     <Button
//                         variant="contained"
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 1,
//                             backgroundColor: '#BA8477',
//                             color: '#FFF',
//                             borderRadius: '20px',
//                             textTransform: 'none',
//                             px: 3,
//                             ':hover': {
//                                 backgroundColor: '#966868',
//                             },
//                         }}
//                         onClick={() => setActiveComponent('Password Vault')}
//                     >
//                         <AddIcon />
//                         Add New Password
//                     </Button>
//                 </Box>

//                 {/* Dynamic Content Box */}
//                 <Box
//                     sx={{
//                         width: '100%',
//                         maxWidth: '800px',
//                         backgroundColor: '#FFF',
//                         borderRadius: 2,
//                         p: 3,
//                         boxShadow: 3,
//                         minHeight: '300px',
//                     }}
//                 >
//                     {renderActiveComponent()}
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default Dashboard;

import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoSaveAPass from './LogoSaveAPass.png'; // Import your logo file
import BackgroundGraphicDesign from './background-graphic-design.png'; // Import your background
import AddPassword from './AddPassword'; // Import AddPassword component

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
                return <Typography>Password Vault Component (Coming Soon)</Typography>;
            case 'Settings':
                return <Typography>Settings Component (Coming Soon)</Typography>;
            case 'Help/Support':
                return <Typography>Help/Support Component (Coming Soon)</Typography>;
            case 'Logout':
                handleLogout();
                return null;
            case 'Add Password':
                return <AddPassword />; // Render AddPassword component
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
                    <TextField
                        variant="outlined"
                        placeholder="Search passwords..."
                        sx={{
                            flex: 1,
                            backgroundColor: '#FFF',
                            borderRadius: 1,
                            '.MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#BA8477',
                                },
                            },
                        }}
                    />
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

                {/* Dynamic Content Box */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: '#FFF',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: 3,
                        minHeight: '300px',
                    }}
                >
                    {renderActiveComponent()}
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;

