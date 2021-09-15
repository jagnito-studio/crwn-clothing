import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Header from './components/header/header.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connectFirestoreEmulator, onSnapshot } from 'firebase/firestore';

// props can show more info of the route component
const HatsPage = (props) => (
  <div>

    {/* To navigate to other pages */}
    <Link to='/topics'>Topics</Link>
    <button onclick={() => props.history.push('/topics')}>Topics</button>

    {/* To get parameter in url */}
    <h1>{props.match.params.topicId}</h1>

    {/* build out nested page, i.e. the url that is always under the current url */}
    <Link to={`${props.match.url}/21`}>To Topic 21</Link>
    <Link to={`${props.match.url}/13`}>To Topic 13</Link>

    <h1>HATS PAGE</h1>
  </div>
)

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      
    }
  }

  unsubscribeFromAuth = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        onSnapshot(userRef, (snapShot) => {
          // console.log(snapShot.data());
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          }, () => {
            console.log(this.state);
          });
          
        });       

      } else {
        // Set current user to null
        this.setState( {
          currentUser: userAuth
        });
      }
      

      
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        {/* Put it outside of Switch so it is always here */}
        <Header currentUser={this.state.currentUser} />
  
        {/* Switch will only show the 1st matched component */}
        <Switch>
          {/* <Route exact={false} path='/' component={HomePage} /> 
              ALL matched components will be shown, unless an exact parameter is used */}
          {/* Parameter is supported - <Route path='/topics/:topicId' component={TopicDetails} />*/}
  
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route path='/signin' component={SignInAndSignUpPage} />
          {/* <Route path='/shop/hats' component={HatsPage} /> */}
        </Switch>
      </div>
    );
  }  
}

export default App;
