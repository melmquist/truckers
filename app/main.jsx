'use strict'
import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'

// Component import
import AppContainer from './components/App/AppContainer';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import SingleTruckContainer from './components/SingleTruck/SingleTruckContainer';
import AllTrucks from './components/AllTrucks';
import ProfilePageContainer from './components/ProfilePage/ProfilePageContainer';

// Dispatcher import
import { fetchTrucksFromServer } from './reducers/trucks';
import { fetchSingleTruckFromServer } from './reducers/singleTruck';
import { fetchSingleUserFromServer } from './reducers/user';


// onEnter prompts ----------------------------------------------------
const onTrucksEnter = () => {
    const thunk = fetchTrucksFromServer();
    store.dispatch(thunk);
};

const onSingleTruckEnter = (nextRouterState) => {
    const truckID = nextRouterState.params.truckID;
    const thunk = fetchSingleTruckFromServer(truckID);
    store.dispatch(thunk);
};

const onUserEnter = (nextRouterState) => {
    const userID = nextRouterState.params.userID;
    const thunk = fetchSingleUserFromServer(userID);
    store.dispatch(thunk);
};

// React-Router--------------------------------------------------------
render (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={AppContainer}>
                <Route path="/trucks" component={AllTrucks} onEnter={onTrucksEnter}/>
                <Route path="/trucks/:truckID" component={SingleTruckContainer} onEnter={onSingleTruckEnter}/>
                <IndexRoute component={AllTrucks} onEnter={onTrucksEnter}/>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/profile/:userID" component={ProfilePageContainer} onEnter={onUserEnter}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('main')
)
