import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';


const seller = AuthService.getCurrentUser();

const AdminUsersTable = (props) => {
    const [users, setUsers] = useState([])
    const [snackColor, setSnackColor] = useState('teal');
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        getData()
    },[props.trigU])

    const getData = async () => {
        if(seller.roles[0] === "ROLE_ADMIN"){
            const response = await API.get(`/api/user/findUser`, { headers: authHeader() })
            if (response.status === 200) {
            setUsers(response.data)
            } else if (response.status === 401) {
                console.log("Token scaduto!")
            }
        }
    }

    //DA FARE
    const removeData = (username) => {
        if (username === seller.username) {
            setResult("Non puoi rimuovere te stesso...")
            setSnackColor('orange');
            setOpen(true);
        } else {
        API.delete(`api/user/deleteUser/${username}`, { headers: authHeader() }).then(res => {
            const del = users.filter(users => username !== users.username)
            setUsers(del)
        })}
    }

    const renderHeader = () => {
        let headerElement = ['username', 'email', 'operation']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return users && users.map(({ id, username, email}) => {
            return (
                <tr key={id}>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(username)}>Delete</button>
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
            <table id='users'>
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


export { AdminUsersTable };