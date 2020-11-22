import React, { useState, useEffect } from "react";
import API from './api';
import './mytable.css'
import './other2_table.css'
import AuthService from "./services/auth.service";
import authHeader from './services/auth-header';

const seller = AuthService.getCurrentUser();

const ProductTable = (props) => {
    const [prodotto, setProdotto] = useState([])
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
            } else if (res.status === 401) {
                console.log("Token scaduto!");
            }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    console.log(err)
                    AuthService.logout()
                }
            })
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
        </div>
    )
}


export { ProductTable };