import { Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

const Routes = () => {
    return (
        <>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
            </Switch>
        </>
    );
};

export default Routes;