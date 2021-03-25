import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Form from './Form';
import Demo from './Demo';
import "./App.css";

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/demo">
          <Demo />
        </Route>
        <Route path="/">
          <Form />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
