import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const seller = AuthService.getCurrentUser();

const ProductTable = (props) => {
    const [prodotto, setProdotto] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');

    useEffect(() => {
        getData()
    },[props.trigP])

    const getData = () => {
        API.get(`/gestione-ordini/prodotti/`, { headers: authHeader() })
            .then(res => {
                if (res.status === 200) {
                    if(seller.roles[0] === "ROLE_ADMIN") {
                    setProdotto(res.data)
                    }
                }})
                .catch(e => {
                    if (e.response.status === 401) {
                      setSnackColor('red');
                      setResult("La tua sessione è scaduta. Fai logout/login!")
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

    const removeData = (id) => {
        API.delete(`gestione-ordini/prodotto/${id}`, { headers: authHeader() }).then(res => {
            const del = prodotto.filter(prodotto => id !== prodotto.id)
            setProdotto(del)
        })
    }

    const renderHeader = () => {
        let headerElement = ['desc', 'grammatura', 'peso totale', 'operation']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return prodotto && prodotto.map(({ id, desc, grammatura, pesoTotale }) => {
            return (
                <tr key={id}>
                    <td>{desc}</td>
                    <td>{grammatura}</td>
                    <td>{pesoTotale}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(id)}>Delete</button>
                    </td>
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

    return (
        <div>
            <table id='styled-table'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>

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


export { ProductTable };