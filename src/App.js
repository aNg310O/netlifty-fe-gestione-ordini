import React, { Component } from "react";
import { Switch, Route, Link, Redirect, withRouter } from "react-router-dom";
import "./asset/App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import { SellerComponent } from './components/ordini.component'
import { RivediOrdineComponent } from './components/ordine.rivedi.component'
import { AdminProdotti } from './components/admin.gestioneprodotti.component'
import { AdminUsers } from './components/admin.gestioneutenti.component'
import { AdminNewUsers } from './components/admin.inserimentoutenti.component'
import { AdminReportOggi } from './components/admin.reportoggi.component'
import { AdminReportAltri } from './components/admin.altrireport.component'
import NotFoundPage from './components/NotFoundPage'

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };

    this.state = {
      title: ""
   }
}

changeTitle = (newTitle) => {
  this.setState({
      title: newTitle
  })
}

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState ({currentUser: undefined, showAdminBoard: false});
  }

  render() {
    const { currentUser,
      showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-dark bg-primary mb-4">
            <span className="navbar-text">
              {currentUser ? currentUser.username + this.state.title  : 'Benvenuto'}
            </span>
        <button className="navbar-toggler toggler-example" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1"
    aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"><i
        className="fas fa-bars fa-1x"></i></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent1">
          <ul className="navbar-nav mr-auto">
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin/prodotti"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Gestione dei prodotti"})}>
                  Gestione prodotti
                </Link>
              </li>
            ) }

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin/users"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Gestione degli utenti"})}>
                  Gestione utenti
                </Link>
              </li>
            ) }

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin/new"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Creazione nuovi utenti"})}>
                  Inserimento utenti
                </Link>
              </li>
            ) }

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin/report/oggi"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Report di oggi"})}>
                  Report di oggi
                </Link>
              </li>
            ) }

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin/report/altri"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Altri report"})}>
                  Altri report
                </Link>
              </li>
            ) }

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user/ordine"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Inserimento ordini"})}>
                  Esegui ordine
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user/recap"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({title: " | Verifica ordine"})}>
                  Visualizza Ordine
                </Link>
              </li>
            )}


          {currentUser ? (
            <div>
              <li className="nav-item"><Link to={"/login"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={this.logOut}>LogOut</Link></li>
            </div>
          ) : (
              <li className="nav-item"><Link to={"/login"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">Login</Link></li>
                )}
            </ul>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user/ordine" component={SellerComponent} />
            <Route path="/user/recap" component={RivediOrdineComponent} />
            <Route path="/admin/prodotti" component={AdminProdotti} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/new" component={AdminNewUsers} />
            <Route path="/admin/report/oggi" component={AdminReportOggi} />
            <Route path="/admin/report/altri" component={AdminReportAltri} />
            <Route path="/404" component={NotFoundPage} />
              <Redirect to="/404" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
