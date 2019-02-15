import React from 'react';
import { hot } from 'react-hot-loader/root';
import styles from './App.module.scss';

class App extends React.Component {
  state = {
    greeting: 'Hey',
  };

  render() {
    const { greeting } = this.state;

    return (
      <div className={styles.container}>
        <h1>Hello world!</h1>

        <p>{greeting}</p>
      </div>
    );
  }
}

export default hot(App);
