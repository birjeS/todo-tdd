import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TodoList from './TodoList';
import Login from './Login';
import Register from './Register';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/todo" component={TodoList} />
            </Switch>
        </Router>
    );
}

export default App;
