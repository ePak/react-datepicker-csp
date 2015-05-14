import React from 'react';
import DatePicker from './datepicker';

export default class App extends React.Component {
  render() {
    return (
      <DatePicker name="Matt" month={5} options={{ range: true }} />
    );
  }
}
