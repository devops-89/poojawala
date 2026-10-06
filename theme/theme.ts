import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6200',
    },
    background: {
      default: '#FFFBF5',
    }
  },
  typography: {
    fontFamily: '"DM Sans", var(--font-dm-sans), var(--font-outfit), sans-serif',
    h1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: '"DM Sans", sans-serif',
    },
    body2: {
      fontFamily: '"DM Sans", sans-serif',
    },
    button: {
      fontFamily: '"DM Sans", sans-serif',
      textTransform: 'none',
    },
  },
  components: {
    MuiPopover: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '30px',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: '#FF6200',
            color: '#FFFFFF',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(255, 98, 0, 0.25)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: 'rgba(255, 98, 0, 0.3)',
            color: '#FF6200',
            '&:hover': {
              borderColor: '#FF6200',
              background: 'rgba(255, 98, 0, 0.05)',
            }
          }
        }
      ]
    }
  }
});

export default theme;
