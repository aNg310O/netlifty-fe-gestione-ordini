import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'
import { AdminReportDay } from './admin.customReport.component';
import { AdminOrderTable } from './admin.ordini.table.component';
import { AdminMonthOrder } from './admin.ordini.table.monthOrder';
import { AdminYearOrder } from './admin.ordini.table.yearOrder';

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

export function AdminReportAltri() {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h5" gutterBottom={true} color='textPrimary'>Report per data</Typography> 
      <Box className={classes.root}>
        <AdminReportDay />
      </Box>
      <Typography variant="h5" gutterBottom={true} color='textPrimary'>Report per singolo ordine</Typography> 
      <Box className={classes.root}>
        <AdminOrderTable />
      </Box>
      <Typography variant="h5" gutterBottom={true} color='textPrimary'>Report mensile</Typography> 
      <Box className={classes.root}>
        <AdminMonthOrder />
      </Box>
      <Typography variant="h5" gutterBottom={true} color='textPrimary'>Report annuale</Typography> 
      <Box className={classes.root}>
        <AdminYearOrder />
      </Box>
    </div>
  )
}