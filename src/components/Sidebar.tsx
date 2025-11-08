import { styled } from '@mui/material/styles';
import { AddCircle, CloudDownloadOutlined, SpeedOutlined, NotesOutlined, TipsAndUpdatesOutlined, SettingsOutlined } from "@mui/icons-material";
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Chip } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import { exportJournalData } from '../utils/exportJournal';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
  handleOpenDialog: () => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Sidebar = ({ open, drawerWidth, handleOpenDialog }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          backgroundColor: '#fafafa',
          border: 'none',
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box>
        <DrawerHeader>
          <Typography component="h1" variant="h6" fontWeight={600} ml={1}>
            Work Journal
          </Typography>
        </DrawerHeader>
        <List sx={{ paddingTop: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <ListItem disablePadding sx={{ marginRight: 0 }}>
              <ListItemButton onClick={() => handleOpenDialog()} sx={{ backgroundColor: 'lab(7.78 0 0)', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: 'lab(7.78 0 0)' } }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AddCircle />
                </ListItemIcon>
                <ListItemText primary="Add Entry" />
              </ListItemButton>
            </ListItem>
            <IconButton
              color="primary"
              sx={{ marginRight: '16px', marginLeft: '-8px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid lab(90 0 0)' }}
              onClick={exportJournalData}
            >
              <CloudDownloadOutlined />
            </IconButton>
          </Box>

          <ListItem disablePadding>
            <ListItemButton disabled>
              <ListItemIcon>
                <SpeedOutlined />
              </ListItemIcon>
              <ListItemText primary="Dashboard"/>
              <Chip label="Coming soon" size="small" sx={{ fontStyle: 'italic', marginRight: '-8px' }}/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/entries')} selected={location.pathname === '/entries'}>
              <ListItemIcon>
                <NotesOutlined />
              </ListItemIcon>
              <ListItemText primary="Entries" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/ideas')} selected={location.pathname === '/ideas'}>
              <ListItemIcon>
                <TipsAndUpdatesOutlined />
              </ListItemIcon>
              <ListItemText primary="Ideas & Learning" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <SettingsOutlined />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            <Chip label="Coming soon" size="small" sx={{ fontStyle: 'italic', marginRight: '-8px' }}/>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
