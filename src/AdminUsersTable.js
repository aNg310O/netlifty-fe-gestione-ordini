import React, { useState, useEffect } from "react";
import API from './api';
import './mytable.css'
import './other2_table.css'
import AuthService from "./services/auth.service";
import authHeader from './services/auth-header';

const seller = AuthService.getCurrentUser();

//const seller="angelo";
const AdminUsersTable = (props) => {
    const [users, setUsers] = useState([])
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
        API.delete(`api/user/deleteUser/${username}`, { headers: authHeader() }).then(res => {
            const del = users.filter(users => username !== users.username)
            setUsers(del)
        })
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
        </div>
    )
}


export { AdminUsersTable };