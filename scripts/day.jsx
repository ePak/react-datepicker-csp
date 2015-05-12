import React from 'react';
import Immutable from 'immutable';
import csp from 'js-csp';

export default class Day extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      day: props.day
    }
  }

  render() {
    //console.log("Day.render()");
    var className = "day " + this.props.className;
    return (
      <span 
        className={className}
        onClick={this._clickHandler.bind(this)}
        onMouseOver={this._mouseOverHandler.bind(this)}>
        <span className="text">{this.props.date.date()}</span>
      </span>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.day != this.props.day) {
      this.setState({ 
        day: nextProps.day
      });
    }
  }

  _clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this._putEvent("selectDate");
  }

  _mouseOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this._putEvent("mouseOver");
  }

  _putEvent(action) {
    csp.putAsync(this.props.eventChan, {action: action, date: this.props.date.clone()});
  }

}

Day.propTypes = {
  date: React.PropTypes.object.isRequired,
  eventChan: React.PropTypes.object.isRequired
};
