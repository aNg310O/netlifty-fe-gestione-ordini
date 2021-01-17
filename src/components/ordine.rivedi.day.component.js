import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { TableDay } from './ordini.table.day.component';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { format } from 'date-fns';
import TextField from '@material-ui/core/TextField'

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

export function RivediOrdineDayComponent() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState();
  const [myDate, setmyDate] = useState('');

  useEffect(() => {}, [selectedDate])

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const str = format(date,'yyyyMMdd')
    setmyDate(str);
  };

  const handleKeypress = (e) => {
    e.preventDefault();
    return false
    }

  return (
    <div>
        <TextField style={{ backgroundColor: "#6d6c6c"}} InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Scegli la data"/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                InputProps={{ readOnly: true, }}
                format="yyyyMMdd"
                disableFuture={true}
                id="date-picker-inline-custom"
                inputVariant="filled"
                onKeyPress={(e) => { handleKeypress(e)}}
                variant="dialog"
                value={selectedDate}
                onChange={handleDateChange}
            />
    </MuiPickersUtilsProvider>
      {myDate ? <Box className={classes.root}><TableDay str={myDate}/></Box> : ""}
      </div>
  )
}