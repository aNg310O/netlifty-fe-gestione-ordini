import "date-fns";
import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField'
import { format } from 'date-fns';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
const { Toast } = Plugins;

const seller = AuthService.getCurrentUser();

const AdminReportDay = (props) => {
    const [ordine, setOrdine] = useState([])
    const [selectedDate, setSelectedDate] = useState();
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');

    useEffect(() => {},[props.trigRD])

    const handleDateChange = (date) => {
        console.log(date)
        setSelectedDate(date);
        const str = format(date,'yyyyMMdd')
        getData(str);
        setFileName("report_" + str);
      };

    const getData = (str) => {
        var totalone=0;
        API.get(`/gestione-ordine/dateOrder/${str}`, { headers: authHeader() })
            .then(res => {
                if (res.status === 200) {
        if(seller.roles[0] === "ROLE_ADMIN"){
            for (var key in res.data) {
                var obj=res.data[key];
                for (var prop in obj) {
                    if (prop === 'totale') {
                        totalone = totalone + obj.totale;
                    }
                }
              }
              res.data.push({_id: "TOTALE", qty: 0, totale: totalone })
              setOrdine(res.data)
        } 
               }})
                .catch(e => {
                    if (e.response.status === 401) {
                      setSnackColor('red');
                      setResult("Sessione scaduta. Fai logout/login!")
                      setOpen(true);
                    } else if (e.response.status === 403) {
                      setSnackColor('red');
                      setResult("No token provided. Fai logout/login!")
                      setOpen(true);
                    } else {
                      setSnackColor('red');
                      setResult(e.message)
                      setOpen(true);
    }
                 });
              }

    const handleReportClick = () => {
        window.scrollTo(0,0)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${fileName.substring(7,16)}`, 10, 15);
        test.autoTable({html: '#reportday', startY: 25 });
        var strb64 = btoa(test.output());
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            Plugins.Filesystem.writeFile({
                path: `${fileName}.pdf`,
                data: strb64,
                directory: FilesystemDirectory.Documents,
                recursive:true
            })
            Toast.show({
                text: `Download ${fileName}.pdf in ${FilesystemDirectory.Documents}`,
                position: 'center',
                duration: 'long'
            })
        } else {
        test.save(`${fileName}.pdf`);
        }
        };

    const renderHeader = () => {
        let headerElement = ['desc', 'quantità', 'peso totale (gr)', 'data inserimento']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordine && ordine.map(({ _id, qty, totale, dataInserimento }) => {
            return (
                <tr key={_id}>
                    <td>{_id}</td>
                    <td>{qty}</td>
                    <td>{totale}</td>
                    <td>{dataInserimento}</td>
                </tr>
            )
        })
    }

    const handleKeypress = (e) => {
        e.preventDefault();
        return false
        }
        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setOpen(false);
          };

    return (
        <div id='root-content'>
        <TextField style={{ backgroundColor: "#D4D4D4"}} InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Inserire la data per il report"/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                InputProps={{ readOnly: true, }}
                format="yyyyMMdd"
                disableFuture={true}
                id="date-picker-inline"
                inputVariant="filled"
                onKeyPress={(e) => { handleKeypress(e)}}
                variant="dialog"
                value={selectedDate}
                onChange={handleDateChange}
            />
    </MuiPickersUtilsProvider>

        <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#3f51b5", alignItems: 'center', justifyContent: 'center', "margin-top": "10px" }} startIcon={<CloudUploadIcon />} variant="outlined">
            Download Report
        </Button>
        <br></br>
        <div id='contentday'>
            <table id='reportday'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>
        <br></br>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent style={{
          backgroundColor: snackColor,
        }}
          message={result}
        />
      </Snackbar>
        </div>
    )
}


export { AdminReportDay };