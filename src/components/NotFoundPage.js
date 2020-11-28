import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../asset/404-error-page-found.jpg';
class NotFoundPage extends React.Component{
    render(){
        return <div class="container">
            <img src={PageNotFound} alt="" />
            <h1 style={{textAlign:"center"}}>
              <Link to="/">Go to Home </Link>
            </h1>
          </div>;
    }
}
export default NotFoundPage;