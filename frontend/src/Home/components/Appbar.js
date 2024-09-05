import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Box, InputBase, IconButton, Typography, useTheme, Menu, MenuItem} from "@mui/material";
import { Search as SearchIcon, DarkModeOutlined as DarkModeOutlinedIcon, LightModeOutlined as LightModeOutlinedIcon, LanguageOutlined as LanguageOutlinedIcon, LoginOutlined as LoginOutlinedIcon } from "@mui/icons-material";
import { ColorModeContext, tokens } from "../../theme";
import {InstantSearch, SearchBox, Hits, Configure} from 'react-instantsearch-dom';
import searchClient from "../../algoliaClient";
import Hit from "./Hit";

const Appbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSignIn, setAnchorElSignIn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const handleSignInMenuOpen = (event) => {
    setAnchorElSignIn(event.currentTarget);
  };

  const handleSignInMenuClose = () => {
    setAnchorElSignIn(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleSignInMenuClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography
          variant="h3"
          sx={{
            mr: 5,
            fontWeight: 'bold',
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            color: colors.greenAccent[500],
          }}
        >
          {t('personalCollectionApp')}
        </Typography>
        <Box display="flex" flexDirection="column" position="relative">
          <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" position="relative">
            <InstantSearch searchClient={searchClient} indexName="items">
              <Configure hitsPerPage={10} />
              <SearchBox
                translations={{ placeholder: 'Search' }}
                className="search-box"
                onChange={handleSearchChange}
                atoFocus

              />
               {searchQuery && (
                    <Box sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: colors.primary[500],
                      borderRadius: '0 0 4px 4px',
                      zIndex: 10
                    }}>
                    <Hits hitComponent={Hit} />
                  </Box>
               )}
            </InstantSearch>
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton onClick={handleLanguageMenuOpen}>
          <LanguageOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            {t('english')}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('bn')}>
            বাংলা
          </MenuItem>
        </Menu>

        <IconButton onClick={handleSignInMenuOpen}>
          <LoginOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElSignIn}
          open={Boolean(anchorElSignIn)}
          onClose={handleSignInMenuClose}
        >
          <MenuItem onClick={() => handleNavigation('/login')}>
            {t('Login')}
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/register')}>
            {t('Register')}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Appbar;