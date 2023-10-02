import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';

// const Button = styled('button')(
//   ({ theme }) => css`
//     background-color: #1976D2;
//     color: white;
//     border: none;
//     padding: 10px 20px;
//     cursor: pointer;
//   `
// );

const useStyles = {
  icon: {
    fontSize: '48px',
  },
  username: {
    fontSize: '24px',
  },
};


const LogoutDialog = ({ open, handleClose, handleLogout }) => {

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle >Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >
          Cancel
        </Button>
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
