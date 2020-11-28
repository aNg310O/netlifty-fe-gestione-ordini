import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./asset/App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import NotFoundPage from './components/NotFoundPage'

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      //showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        //showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser,
      //showModeratorBoard, 
      showAdminBoard } = this.state;

    return (
      <div>
        <nav class="navbar navbar-dark bg-primary mb-4">
        <p class="navbar-brand">Navbar</p>
        <button class="navbar-toggler toggler-example" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1"
    aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"><i
        class="fas fa-bars fa-1x"></i></span></button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent1">
          <ul class="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/"} className="nav-link">
                Home
              </Link>
            </li>
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Ordini
                </Link>
              </li>
            )}


          {currentUser ? (
            <div>
              <li className="nav-item"><Link to={"/profile"} className="nav-link">{currentUser.username}</Link></li>
              <li className="nav-item"><a href="/" className="nav-link" onClick={this.logOut}>LogOut</a></li>
            </div>
          ) : (
              <li className="nav-item"><Link to={"/login"} className="nav-link">Login</Link></li>
                )}
            </ul>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/404" component={NotFoundPage} />
            <Redirect to="/404" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
