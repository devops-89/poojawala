import { createTheme } from '@mui/material/styles';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.BRAND_ORANGE,
    },
    background: {
      default: COLORS.BG_CREAM,
    }
  },
  typography: {
    fontFamily: FONTS.THEME_DEFAULT,
    h1: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
    },
    h6: {
      fontFamily: FONTS.PRIMARY,
      fontWeight: 700,
    },
    body1: {
      fontFamily: FONTS.PRIMARY,
    },
    body2: {
      fontFamily: FONTS.PRIMARY,
    },
    button: {
      fontFamily: FONTS.PRIMARY,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none !important',
          margin: 0,
        },
        'input[type=number]': {
          MozAppearance: 'textfield !important',
          appearance: 'textfield !important',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          htmlInput: {
            min: 0,
          },
        },
      },
    },
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
            background: COLORS.BRAND_ORANGE,
            color: COLORS.WHITE,
            '&:hover': {
              boxShadow: `0 8px 24px ${COLORS.PRIMARY_SHADOW}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: COLORS.LIGHT_BORDER,
            color: COLORS.BRAND_ORANGE,
            '&:hover': {
              borderColor: COLORS.BRAND_ORANGE,
              background: COLORS.LIGHT_BG_HOVER,
            }
          }
        }
      ]
    }
  }
});

export default theme;
