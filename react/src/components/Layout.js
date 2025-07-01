import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Person, Chat, Search, Notifications } from '@mui/icons-material';

function Layout() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleNavigationChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/feed');
        break;
      case 1:
        navigate(`/profile/${localStorage.getItem('userId')}`);
        break;
      case 2:
        navigate('/messages');
        break;
      case 3:
        navigate('/search');
        break;
      case 4:
        navigate('/notifications');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Social Network
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Outlet />
      </Box>
      <BottomNavigation
        value={value}
        onChange={handleNavigationChange}
        showLabels
        sx={{ width: '100%', position: 'fixed', bottom: 0 }}
      >
        <BottomNavigationAction label="Feed" icon={<Home />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
        <BottomNavigationAction label="Messages" icon={<Chat />} />
        <BottomNavigationAction label="Search" icon={<Search />} />
        <BottomNavigationAction label="Notifications" icon={<Notifications />} />
      </BottomNavigation>
    </Box>
  );
}

export default Layout;
