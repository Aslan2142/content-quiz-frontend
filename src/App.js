import React from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import Page404 from './components/Page404';
import Home from './components/Home';
import Quiz from './components/Quiz';
import EditQuiz from './components/EditQuiz';
import Results from './components/Results';

import { RootPath } from './AppSettings';

import './App.scss'

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path={RootPath + '/'} exact component={Home} />
            <Route path={RootPath + '/quiz/:uuid'} exact component={Quiz} />
            <Route path={RootPath + '/editquiz/:uuid'} exact component={EditQuiz} />
            <Route path={RootPath + '/results/:uuid'} exact component={Results} />
            <Route component={() => <Page404 path={useLocation().pathname}/>} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

}

export default App;