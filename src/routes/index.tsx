

import React from 'react';
import { Route, Switch  } from 'react-router-dom';
import City from '../pages/city';
import Home from '../pages/home';

const Routes: React.FC = () => {

    return(
        <Switch>
            <Route path="/" exact component={ Home } ></Route>
            <Route path="/city/:city+" component={ City } ></Route>
        </Switch>
    )
}

export default Routes;