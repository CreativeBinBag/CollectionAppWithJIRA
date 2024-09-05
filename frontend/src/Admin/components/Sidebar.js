import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProSidebar, Menu, MenuItem} from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
   
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
      
    >
      
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {t('admin')}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box marginTop="50px" paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item 
          
              title=  {t('home')}
              to="/feed"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
   
            <Item
              title=  {t('manageUsers')}
              to="/manage-users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title={t('manageCollections')}
              to="/manage-collections"
              icon={<CollectionsBookmarkOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

             <Item
              title={t('createNewCollections')}
              to="/create-collection"
              icon={<CreateNewFolderOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          

             <Item
              title={t('viewJIRATicket')}
              to="/user-tickets"
              icon={<ListAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title={t('logout')}
              to="/"
              icon={<LogoutOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};


export default Sidebar;