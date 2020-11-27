import React, { useState } from "react";
import API from './api';
import { AdminAppBar } from './AdminAppBar';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ProductTable } from './AdminProductTable';
import { AdminUsersTable } from './AdminUsersTable';
import { AdminReportTable } from './AdminReportTable';
import { AdminReportDay } from './AdminReportDay';
import authHeader from './services/auth-header';
import Register from "./components/register.component";
import AuthService from "./services/auth.service";

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

export default function AdminComponent() {
  const classes = useStyles();
  const [desc, setDesc] = useState('');
  const [grammatura, setGrammatura] = useState(0);
  //const [nome, setNome] = useState("");
  const [boxUsersVisibility, setBoxUsersVisibility] = useState("none");
  const [pesoTotale, setPesoTotale] = useState(0);
  //const [items, setItems] = useState();
  const [result, setResult] = useState('');
  const [open, setOpen] = useState(false);
  //const [email, setEmail] = useState('');
  //const [ordine, setOrdine] = useState(0);
  //const [password, setPassword] = useState('');
  //const [pesoTotaleCustom, setPesoTotaleCustom] = useState(0);
  const [checkA, setCheckA] = useState(false);
  const [boxProductVisibility, setBoxProductVisibility] = useState("none");
  const [checkB,setCheckB] = useState(false);
  const [boxReportVisibility, setBoxReportVisibility] = useState("none");
  const [checkC,setCheckC] = useState(false);
  const [boxReportDayVisibility, setBoxReportDayVisibility] = useState("none");
  const [checkD,setCheckD] = useState(false);
  const [snackColor, setSnackColor] = useState('teal');
  
const seller = AuthService.getCurrentUser();

  const handleSwitchChange = (event) => {
    setCheckA(event.target.checked);
    if (event.target.checked) { setBoxProductVisibility("block"); }
    else { setBoxProductVisibility("none"); }
  };

  const handleSwitchBChange = (event) => {
    setCheckB(event.target.checked);
    if (event.target.checked) { setBoxUsersVisibility("block"); }
    else { setBoxUsersVisibility("none"); }
  };

  const handleSwitchCChange = (event) => {
    setCheckC(event.target.checked);
    if (event.target.checked) { setBoxReportVisibility("block"); }
    else { setBoxReportVisibility("none"); }
  };

  const handleSwitchDChange = (event) => {
    setCheckD(event.target.checked);
    if (event.target.checked) { setBoxReportDayVisibility("block"); }
    else { setBoxReportDayVisibility("none"); }
  };

   const handleProductClick = (desc,grammatura,pesoTotale) => {
    if (desc !== '') {
      let data = {
        "desc": desc,
        "grammatura": grammatura,
        "pesoTotale": pesoTotale
      };
      API.post('gestione-ordini/prodotti/', data, { headers: authHeader() })
        .then(response => {
          if (response.status === 200) {
            setSnackColor('green');
            setResult("Prodotto inserito!")
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
      setResult("Il prodotto non può essere vuoto...")
      setSnackColor('orange');
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
      <AdminAppBar />
      <FormControlLabel
        control={<Switch checked={checkA} onChange={handleSwitchChange} name="checkedA" color="primary" />}
        label="Gestione prodotti"
      />
      <Box display={boxProductVisibility} className={classes.root}>
      <ProductTable trigP={checkA} />
        <br></br>
          <TextField required label="Descrizione" variant="outlined" value={desc} margin="dense" type="string" defaultValue="" onChange={e => setDesc(e.target.value)}></TextField>
          <TextField required label="Grammatura (gr)" variant="outlined" value={grammatura} margin="dense" type="number" defaultValue="" onChange={e => setGrammatura(e.target.value)}></TextField>
          <TextField required label="Peso Totale (gr)" variant="outlined" value={pesoTotale} margin="dense" type="number" defaultValue="" onChange={e => setPesoTotale(e.target.value)}></TextField>
          <br></br>
          <Button onClick={() => handleProductClick(desc,grammatura,pesoTotale)} size="large" style={{ display: 'flex', backgroundColor: "#3f51b5", alignItems: 'center', justifyContent: 'center' }} startIcon={<CloudUploadIcon />} variant="outlined">
            Inserisci il prodotto
          </Button>
      </Box>
      <br></br>
      <FormControlLabel
        control={<Switch checked={checkB} onChange={handleSwitchBChange} name="checkedB" color="primary" />}
        label="Elimina o crea nuovi utenti"
      />
      <Box display={boxUsersVisibility} className={classes.root}>
      <AdminUsersTable trigU={checkB} />
          <Register />
        </Box>
        <br></br>
        <FormControlLabel
        control={<Switch checked={checkC} onChange={handleSwitchCChange} name="checkedC" color="primary" />}
        label="Report ordini"
      />
        <Box display={boxReportVisibility} className={classes.root}>
          <AdminReportTable trigR={checkC} />
        </Box>
        <br></br>
        <FormControlLabel
        control={<Switch checked={checkD} onChange={handleSwitchDChange} name="checkedD" color="primary" />}
        label="Report ordini per data"
      />
        <Box display={boxReportDayVisibility} className={classes.root}>
          <AdminReportDay trigRD={checkD} />
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