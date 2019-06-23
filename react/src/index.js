import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import './index.css';
import './website.css';
//import App from './App';
import List from './components/list';
import Update from './components/update';
import Create from './components/create';
import Menu from './components/menu';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
	<Router>
		<div>
			<Route exact path='/' component={List} />
            <Route path='/update/:id' component={Update} />
            <Route path='/create' component={Create} />
            <Route path='/usermenu/:id' component={Menu} />
		</div>
	</Router>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
