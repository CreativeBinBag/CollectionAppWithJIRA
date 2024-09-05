import {Box, IconButton, useTheme, Menu, MenuItem} from "@mui/material";
import {useContext, useState} from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import searchClient from "../../algoliaClient";
import {InstantSearch, SearchBox, Configure} from 'react-instantsearch-dom';
import Results from "./SearchResults";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


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
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <Box display="flex" justifyContent="space-between" p={2}
      sx={{
        background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
      }}
    >
          <Box display="flex" flexDirection="column" position="relative">
          <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" position="relative">
            <InstantSearch searchClient={searchClient} indexName="items">
              <Configure hitsPerPage={10} />
              <SearchBox
                translations={{ placeholder: 'Search' }}
                className="search-box"
                onChange={handleSearchChange}
                autoFocus

              />
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
                      <Results />
                  </Box>
            </InstantSearch>
          </Box>
        </Box>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
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
          <MenuItem onClick={() => handleLanguageChange("en")}>
            {t('english')}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("bn")}>
            বাংলা
          </MenuItem>
        </Menu>

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;