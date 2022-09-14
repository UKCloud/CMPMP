<template>
    <div id='app'>
      <header>
        <h1>Sign in page</h1>
      </header>
      <div id='container'></div>
    </div>
  </template>
  <script lang = "ts">
import Greet from './Greeting';

  export default {
    name: 'app',
    components: {
        Greet,
    },
    data() {
    return {
      email: 'dinesh@fusionauth.io'
    }
  }
  };
  </script>
  <style>
  h1 {
    text-align: center;
    font-size: 40px;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  #container {
    box-sizing: border-box;
    border: 5px solid gray;
    border-radius: 15%;
    width: 400px;
    height: 400px;
    margin: auto;
  }
  </style>