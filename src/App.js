import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    // console.log('signIn clicked');
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user //get data from user
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
      // console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    // console.log("clicked signout");
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false
      }
      setUser(signedOutUser)
    })
    .catch(err => {
      console.log(err.message);
    })
  }


  // const is_valid_email = email => /^.+@.+\..+$/.test(email)
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email)

  // function hasNumber(input){
  //   return /\d/.test(input)
  // }

  const hasNumber = input => /\d/.test(input)

  const switchForm = e => {
    const createdUser = { ...user }
    createdUser.existingUser = e.target.checked
    setUser(createdUser)
  }

  const handleChange = event => {
    const newUserInfo = {
      ...user
    }
 
    //perform validation
    let isValid = true
    if(event.target.name === "email"){
      isValid = is_valid_email(event.target.value);
    }
    if (event.target.name === "password") {
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value
    newUserInfo.isValid = isValid
    setUser(newUserInfo)
    // console.log(event.target.name, event.target.value);
  }

  const createAccount = (event) => {
    //createAccount
    if(user.isValid){
      // console.log(user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user}
        createdUser.isSignedIn = true
        createdUser.error = ''
        setUser(createdUser)
      })
      .catch(err => {
        // console.log(err);
        // console.log(err.code);
        console.log(err.message);
        const createdUser = { ...user }
        createdUser.isSignedIn = false
        createdUser.error = err.message
        setUser(createdUser)
      })
    }
    // else{
    //   console.log("form is not valid", {email: user.email, pass: user.password});
    // }
    event.preventDefault()
    event.target.reset()
  }

  const signInUser = event =>{
    if (user.isValid) {
      // console.log(user.email, user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user }
          createdUser.isSignedIn = true
          createdUser.error = ''
          setUser(createdUser)
        })
        .catch(err => {
          // console.log(err);
          // console.log(err.code);
          console.log(err.message);
          const createdUser = { ...user }
          createdUser.isSignedIn = false
          createdUser.error = err.message
          setUser(createdUser)
        })
    }
    event.preventDefault()
    event.target.reset()
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email, {user.email}</p>
          {/* <br/>Your:<br/> */}
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm" />
      <label htmlFor="switchForm"> Returning User</label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="email" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="SignIn" />
      </form>
      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required />
        <br/>
        <input type="email" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br/>
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
