import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
          light: '#494949',
          main: '#222',
          dark: '#000000',
          contrastText: '#fff',
        },
        secondary: {
          light: '#a98274',
          main: '#795548',
          dark: '#4b2c20',
          contrastText: '#fff',
        },
      },
});

/* export default createMuiTheme({
  palette: {
      primary: {
        light: '#fff',
        main: '#fff',
        dark: '#ccc',
        contrastText: '#000',
      },
      secondary: {
        light: '#8e8e8e',
        main: '#616161',
        dark: '#373737',
        contrastText: '#fff',
      },
    },
}); */