import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, IconButton, IconButtonProps, Stack, useMediaQuery } from '@mui/material';
// redux
import { RootState, useSelector } from '../../../redux/store';
// utils
// routes
//
import { MHidden, MIconButton } from '../../@material-extend';
import Scrollbar from '../../Scrollbar';
import ChatAccount from './ChatAccount';
import ChatConversationList from './ChatConversationList';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 320;
const COLLAPSE_WIDTH = 96;

const ToggleButtonStyle = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker
  }
}));

// ----------------------------------------------------------------------

export default function ChatSidebar() {
  const theme = useTheme();
  const { pathname } = useLocation();

  const [openSidebar, setOpenSidebar] = useState(true);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const { allConversations, activeConversationId } = useSelector((state: RootState) => state.chat);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCollapse = !isMobile && !openSidebar;

  useEffect(() => {
    if (isMobile) {
      return handleCloseSidebar();
    }
    return handleOpenSidebar();
  }, [isMobile, pathname]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const renderContent = (
    <>
      <Box sx={{ py: 2, px: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <ChatAccount />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <MIconButton onClick={handleToggleSidebar}>
            <Icon
              width={20}
              height={20}
              icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill}
            />
          </MIconButton>
        </Stack>
      </Box>

      <Scrollbar>
        <ChatConversationList
          conversations={allConversations}
          isOpenSidebar={openSidebar}
          activeConversationId={activeConversationId}
          sx={{ ...(isSearchFocused && { display: 'none' }) }}
        />
      </Scrollbar>
    </>
  );

  return (
    <>
      <MHidden width="mdUp">
        <ToggleButtonStyle onClick={handleToggleSidebar}>
          <Icon width={16} height={16} icon={peopleFill} />
        </ToggleButtonStyle>
      </MHidden>

      {/* Mobile */}
      <MHidden width="mdUp">
        <Drawer
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      {/* Desktop */}
      <MHidden width="mdDown">
        <Drawer
          open={openSidebar}
          variant="persistent"
          sx={{
            width: DRAWER_WIDTH,
            transition: theme.transitions.create('width'),
            '& .MuiDrawer-paper': {
              position: 'static',
              width: DRAWER_WIDTH
            },
            ...(isCollapse && {
              width: COLLAPSE_WIDTH,
              '& .MuiDrawer-paper': {
                width: COLLAPSE_WIDTH,
                position: 'static',
                transform: 'none !important',
                visibility: 'visible !important'
              }
            })
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </>
  );
}
