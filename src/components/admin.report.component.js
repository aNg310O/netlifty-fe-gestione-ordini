import "date-fns";
import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {isMobile} from 'react-device-detect';
import { CircularIndeterminate } from './Loader';

const { Toast } = Plugins;

const seller = AuthService.getCurrentUser();

const AdminReportTable = (props) => {
    const [ordine, setOrdine] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        getData()
    },[props.trigR])

    const getData = () => {
        var totalone = 0;
        API.get(`/gestione-ordine/todayOrder`, { headers: authHeader() })
            .then(res => {
                if (res.status === 200) {
                    if(seller.roles[0] === "ROLE_ADMIN") {
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
                          setLoading(false);
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
        let today = new Date().toISOString().slice(0, 10)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${today}`, 10, 15);
        test.autoTable({html: '#report', startY: 25 });
        var strb64 = btoa(test.output());
        if (isMobile) {
            Plugins.Filesystem.writeFile({
                path: `report_${today}.pdf`,
                data: strb64,
                directory: FilesystemDirectory.Documents,
                recursive:true
            })
            Toast.show({
                text: `Download report_${today}.pdf in ${FilesystemDirectory.Documents}`,
                position: 'center',
                duration: 'long'
            })
        } else {
            test.save(`report_${today}.pdf`);
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

if (!loading){
    return (
        <div>
                    <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#007BFF", alignItems: 'center', justifyContent: 'center', "margin-top": "10px" }} startIcon={<CloudUploadIcon />} variant="outlined">
            Download Report
        </Button>
        <br></br>
        <div id='content'>
            <table id='report'>
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
} else {
    return (
        <CircularIndeterminate />
    )
}
}


export { AdminReportTable };