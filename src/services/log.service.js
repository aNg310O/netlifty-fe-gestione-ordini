import axios from "axios";

//const API_URL = "https://heroku-be-gestione-ordini.herokuapp.com/api/auth/";
const API_LOG_URL = "http://localhost:8081/logging/"

class Logging {
  log(severity, username, page, text) {
    return axios.post(API_LOG_URL, {
        severity,
        username,
        page,
        text
      })
  }
}

export default new Logging();
