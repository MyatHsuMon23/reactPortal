import { createTheme } from "@mui/material";
import { blue, green, purple, red } from "@mui/material/colors";


const primary = {
  main: '#4c0fb2', //bluePurple
  light: '#a877fb', //lightGreen
}

const secondary = {
  main: '#6e42ff', //pinkpurple
  light: '#1ae1ee' //lightGreen2
}

const success = {
  main: '#009148', //lightGreenDark
  light: '#edf5ff' //lightgray
}

const error = {
  main: '#db0922',
}

const info = {
  main: '#dedede', //yellow
  light: '#6e42ff' //lightPurple
}

const warning = {
  main: '#db7312',
  light: '#d6acff' //orange #bca7ff
}

const common = {
  black: '#000',
  white: '#FFF',
  gradient: 'linear-gradient(90deg, rgb(88, 84, 148) 0%, rgb(191 123 248) 40%, rgb(109, 209, 230) 100%)',
  gradient2: 'linear-gradient(90deg, #bfc7ff 0%, rgb(191 123 248) 40%, rgb(109, 209, 230) 100%)',
  buttonColor: 'linear-gradient(90deg, rgba(233,84,255,1) 0%, rgba(233,219,58,1) 54%, rgba(59,207,195,1) 100%)',
  boxShadow: '0px 3px 4px 1px rgb(129 127 127 / 20%)',
  blueColors: {
    level1: '#1919ae',
    level2: '#bfc7ff',
    level3: '#3e3ee0'
  }
}

const palette = {
  primary,
  secondary,
  success,
  error,
  info,
  warning,
  common,
}

export const theme = createTheme({
  typography: {
    button: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {
        // Name of the slot
        root: {
          maxHeight: 'calc(100vh - 200px) !important'
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: '15px'
        },
      },
    },
    MuiInputBase:{
      styleOverrides: {
        root: {
          background: '#FFF',
          borderRadius: '5px',
          '& .MuiInputBase-input':{
            borderRadius: '5px'
          },
          '& input[name=password]:-internal-autofill-selected':{
            background: '#FFF',
            borderRadius: '10px 0 0 10px',
          }
        }
      }
    },
    MuiInputLabel:{
      styleOverrides: {
        root: {
            fontSize: '16px',
            color: primary.main
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: '15px',
        },
      },

    },
    MuiAccordion: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: '17px 17px 15px 15px',
          marginTop: '10px',
          '& .MuiAccordionSummary-root': {
            borderRadius: '17px 17px 15px 15px',
            backgroundColor: '#dceaf6',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: '#0054A6',
            },
          },
          '& .MuiAccordionDetails-root': {
            padding: '15px 16px 2em 16px',
            minHeight: '300px',
          },
          details: {
            root: {
              borderRadius: '28px',
            }
          }
        },

      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            textTransform: 'none',
            border: `4x solid ${blue[500]}`,
            borderRadius: '5px',
            padding: '7px 10px'
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            textTransform: 'none',
            border: `1px solid ${secondary.main}`,
            borderRadius: '5px',
            padding: '7px 10px'
          },
        },
      ],
    },
    MuiList: {
      styleOverrides: {
        root: {
          MuiButtonBase: {
            styleOverrides: {
              // Name of the slot
              root: {
                borderRadius: '0px',
              },
            },
      
          },
        }
      }
    }
  },
  shape: {
    borderRadius: 10,
  },
  palette: palette
});

