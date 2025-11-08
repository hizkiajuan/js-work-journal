import { ViewSidebarOutlined } from '@mui/icons-material';
import { Toolbar, IconButton, Divider } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface TopBarProps {
  toggleDrawer: () => void;
  open: boolean;
  children: ReactNode;
}

const TopBarElement = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: 'black',
  borderBottomStyle: 'solid',
  borderBottomColor: 'lab(90 0 0)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const TopBar = ({ toggleDrawer, open, children }: TopBarProps) => (
  <TopBarElement position="relative" open={open}>
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
      >
        <ViewSidebarOutlined sx={{ transform: "scaleX(-1)" }} />
      </IconButton>
      <Divider orientation="vertical" sx={{ margin: '0 18px 0 10px', border: '0.8px solid lab(90 0 0)', height: '24px' }} />
      {children}
    </Toolbar>
  </TopBarElement>
);

export default TopBar;