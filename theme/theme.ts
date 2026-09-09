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
  components: {
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
