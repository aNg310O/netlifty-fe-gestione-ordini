import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { AdminUsersTable } from './admin.users.component';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }
}));

export function AdminUsers() {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.root}>
        <AdminUsersTable />
      </Box>

    </div>
  )
}