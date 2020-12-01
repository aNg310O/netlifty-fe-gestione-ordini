import React, { useState, useEffect } from "react";
import API from '../services/api';
//import { ButtonAppBar } from './ordini.appbar.component';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Table } from './ordini.table.component';
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';

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

export function RivediOrdineComponent() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(['']);
  const [boxVisibility, setBoxVisiblity] = useState("none");
  const [boxCustomVisibility, setBoxCustomVisiblity] = useState("none");
  const [order, setOrder] = useState(0);
  const [result, setResult] = useState('');
  const [open, setOpen] = useState(false);
  const [prodotto, setProdotto] = useState('');
  const [ordine, setOrdine] = useState(0);
  const [note, setNote] = useState('');
  const [pesoTotaleCustom, setPesoTotaleCustom] = useState(0);
  const [checkA, setCheckA] = useState(false);
  const [boxProductVisibility, setBoxProductVisibility] = useState("none");
  const [checkB,setCheckB] = useState(false);
  const [boxOrderVisibility, setBoxOrderVisibility] = useState("none");
  const [snackColor, setSnackColor] = useState('teal');
  
const currentUser = AuthService.getCurrentUser();

  const handleSwitchChange = (event) => {
    setCheckA(event.target.checked);
    if (event.target.checked) { setBoxProductVisibility("block"); }
    else { setBoxProductVisibility("none"); }
  };

  const handleSwitchBChange = (event) => {
    setCheckB(event.target.checked);
    if (event.target.checked) { setBoxOrderVisibility("block"); }
    else { setBoxOrderVisibility("none"); }
  };

  useEffect(() => {
    retrieveProduct();
  }, []);

  const retrieveProduct = () => {
    API.get('gestione-ordini/prodotti',  { headers: authHeader() })
      .then(response => {
        if (response.status === 200) {
          setItems(response.data);
        }
      })
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

  const handleChange = (event) => {
    if (event.target.value !== 2) {
      setSelected(event.target.value || '');
      setBoxVisiblity("block");
      setBoxCustomVisiblity("none");
      setOrdine(0);
      setNote('');
      setProdotto('');
      setPesoTotaleCustom(0);
      setOrder(0);
    } else {
      setSelected(event.target.value || '');
      setBoxVisiblity("none");
      setBoxCustomVisiblity("block");
      setOrdine(0);
      setNote('');
      setProdotto('');
      setPesoTotaleCustom(0);
      setOrder(0);
    }
  };

  const handleClick = (selection,note) => {
    if (order !== 0) {
      let data = {
        "desc": selection.desc,
        "seller": currentUser.username,
        "pesoProdotto": selection.pesoTotale,
        "qty": order,
        "note": note,
        "isCustom": false
      };
      API.post('gestione-ordini/ordine/', data,  { headers: authHeader() })
        .then(response => {
          if (response.status === 200) {
            setSnackColor('green');
            setResult("Ordine inserito!")
            setOpen(true);
          }
        })
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
    } else {
        setResult("L'ordine non può essere vuoto...")
        setOpen(true);
      }
  }

  const handleCustomClick = (prodotto, pesoTotaleCustom, ordine, note) => {
    if (ordine !== 0) {
      let customData = {
        "desc": prodotto,
        "seller": currentUser.username,
        "pesoProdotto": pesoTotaleCustom,
        "qty": ordine,
        "note": note,
        "isCustom": true
      };
      API.post('gestione-ordini/ordine/', customData,  { headers: authHeader() })
        .then(response => {
          if (response.status === 200) {
            setSnackColor('green');
            setResult("Ordine custom inserito!")
            setOpen(true);
          }
        })
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
    } else {
        setResult("L'ordine non può essere vuoto...")
        setOpen(true);
      }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>  
      <Box className={classes.root}>
              <Table trig={checkB} />
      </Box>

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