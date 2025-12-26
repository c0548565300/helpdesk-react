import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import Swal from 'sweetalert2';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Stack 
} from '@mui/material';

// Icons
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: "תצטרך להתחבר מחדש כדי לגשת למערכת",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן, התנתק',
      cancelButtonText: 'ביטול',
      customClass: { popup: 'swal-rtl' },
      didOpen: (popup) => { popup.style.direction = 'rtl'; }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const navItems = [
    { label: 'לוח בקרה', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'רשימת פניות', path: '/tickets', icon: <ConfirmationNumberIcon /> },
  ];

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', direction: 'rtl' }}>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <SupportAgentIcon sx={{ color: '#1976d2' }} />
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          HELPDESK
        </Typography>
      </Box>
      <Divider />
      <List>
        {user && navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{ textAlign: 'right' }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 'bold' : 'medium' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="התנתקות" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }} dir="rtl">
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: '#fff', color: '#333' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px' }}>

            {/* --- צד ימין: לוגו והמבורגר --- */}
            <Box display="flex" alignItems="center">
              {user && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box
                display="flex"
                alignItems="center"
                sx={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => navigate('/')}
              >
                <SupportAgentIcon sx={{ fontSize: 32, color: '#1976d2', ml: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    letterSpacing: '.1rem',
                    color: '#1976d2',
                    display: { xs: 'none', sm: 'block' } // מוסתר במסכים ממש קטנים אם צריך
                  }}
                >
                  HELPDESK
                </Typography>
              </Box>

              {/* תפריט דסקטופ */}
              {user && (
                <Stack direction="row" spacing={1} sx={{ mr: 4, display: { xs: 'none', md: 'flex' } }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        color: location.pathname === item.path ? '#1976d2' : '#555',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        px: 2,
                        bgcolor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#f5f5f5' },

                        // --- התיקון החשוב לרווחים בעברית ---
                        '& .MuiButton-startIcon': {
                          marginLeft: '8px',  // מרחיק את הטקסט מהאייקון
                          marginRight: '0px', // מאפס את הרווח המקורי של אנגלית
                        }
                        // -----------------------------------
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>

            {/* --- צד שמאל: פרופיל משתמש --- */}
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#f8f9fa',
                  border: '1px solid #eee',
                  pl: 2, pr: 0.5, py: 0.5, // ריווח פנימי מדויק
                  borderRadius: 50,
                  ml: 1
                }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '0.85rem', fontWeight: 'bold', ml: 1 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                    {user.name}
                  </Typography>
                </Box>

                <Tooltip title="התנתק">
                  <IconButton
                    onClick={handleLogout}
                    size="small"
                    sx={{
                      color: '#d32f2f',
                      bgcolor: '#ffebee',
                      '&:hover': { bgcolor: '#ffcdd2' },
                      display: { xs: 'none', md: 'inline-flex' }
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => navigate('/login')} sx={{ fontWeight: 'bold' }}>התחברות</Button>
                <Button variant="contained" onClick={() => navigate('/register')} sx={{ borderRadius: 5 }}>הרשמה</Button>
              </Box>
            )}

          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Navbar;