import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Typography } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
  title: string;
  handleOpenDialog: () => void;
}

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme }) => ({
  backgroundColor: '#fafafa',
  flexGrow: 1,
  height: 'fit-content',
  minHeight: '100vh',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${-1 * drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

const Layout = ({ children, title, handleOpenDialog }: LayoutProps) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa' }}>
      <Sidebar open={open} drawerWidth={drawerWidth} handleOpenDialog={handleOpenDialog} />
      <Main open={open}>
        <Box sx={{
          backgroundColor: 'lab(100 0 0)',
          borderStyle: 'solid',
          borderColor: 'lab(90 0 0)',
          borderRadius: '14px',
          margin: '8px',
          minHeight: 'calc(100vh - 18px)',
        }}>
          <TopBar toggleDrawer={toggleDrawer} open={open}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: '600' }}>
              {title}
            </Typography>
          </TopBar>
          <Box sx={{ padding: '24px' }}>
            {children}
          </Box>
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;
