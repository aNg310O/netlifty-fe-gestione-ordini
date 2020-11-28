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

const seller = AuthService.getCurrentUser();

const AdminReportTable = (props) => {
    const [ordine, setOrdine] = useState([])

    useEffect(() => {
        getData()
    },[props.trigR])

    const getData = async () => {
        var totalone = 0;
        if(seller.roles[0] === "ROLE_ADMIN"){
            const response = await API.get(`/gestione-ordine/todayOrder`, { headers: authHeader() })
            for (var key in response.data) {
                var obj=response.data[key];
                for (var prop in obj) {
                    if (prop === 'totale') {
                        totalone = totalone + obj.totale;
                    }
                }
              }
              response.data.push({_id: "TOTALE", qty: 0, totale: totalone })
              setOrdine(response.data)
        }  
    }

    const handleReportClick = () => {
        let today = new Date().toISOString().slice(0, 10)
        window.scrollTo(0,0)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${today}`, 5, 15);
        test.autoTable({html: '#report', startY: 25});
        test.save(`report_${today}.pdf`);
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

    return (
        <div>
                    <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#3f51b5", alignItems: 'center', justifyContent: 'center', "margin-top": "10px" }} startIcon={<CloudUploadIcon />} variant="outlined">
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
        </div>
    )
}


export { AdminReportTable };