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

const seller = AuthService.getCurrentUser();

const AdminOrderTable = (props) => {
    const [ordine, setOrdine] = useState([])
    const [selectedDate, setSelectedDate] = useState();
    const [fileName, setFileName] = useState('');

    useEffect(() => {},[props.trigE])

    const handleDateChange = (date) => {
        //console.log(date)
        setSelectedDate(date);
        const str = format(date,'yyyyMMdd')
        getData(str);
        setFileName("report_full_" + str);
      };

    const getData = async (str) => {
        if(seller.roles[0] === "ROLE_ADMIN"){
            const response = await API.get(`/gestione-ordine/allOrder/${str}`, { headers: authHeader() })
            //console.log(response.data)
              setOrdine(response.data)
        } 
    }

    const handleReportClick = () => {
        window.scrollTo(0,0)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${fileName.substring(7,16)}`, 10, 15);
        test.autoTable({html: '#reportdaysingle', startY: 25 });
        test.save(`${fileName}.pdf`);
        };

    const renderHeader = () => {
        let headerElement = ['desc', 'quantità', 'peso totale (gr)', 'data inserimento', 'venditore', 'note']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordine && ordine.map(({ _id, desc, qty, pesoTotale, dataInserimento, seller, note }) => {
            return (
                <tr key={_id}>
                    <td>{desc}</td>
                    <td>{qty}</td>
                    <td>{pesoTotale}</td>
                    <td>{dataInserimento}</td>
                    <td>{seller}</td>
                    <td>{note}</td>
                </tr>
            )
        })
    }

    const handleKeypress = (e) => {
        e.preventDefault();
        return false
        }

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
        <div id='contentdaysingle'>
            <table id='reportdaysingle'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>
        <br></br>
        </div>
    )
}


export { AdminOrderTable };