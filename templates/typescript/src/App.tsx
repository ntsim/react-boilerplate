import React from 'react';
import { hot } from 'react-hot-loader/root';
import styles from './App.module.scss';

interface State {
  greeting: string;
}

class App extends React.Component<{}, State> {
  public state = {
    greeting: 'Hey',
  };

  public render() {
    const { greeting } = this.state;

    return (
      <div className={styles.container}>
        <h1>Hello world! hey</h1>

        <p>{greeting}</p>
      </div>
    );
  }
}

export default hot(App);
