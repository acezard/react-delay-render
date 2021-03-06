import React, { Component } from 'react';
import DelayChild from './DelayChild';
import PropTypes from 'prop-types'

export class ReactDelayRender extends Component {
  constructor() {
    super();
    this.state = { ready: false };
    this.done = 0;
    this.onDoneFn = this.onDone.bind(this);
  }

  componentWillMount() {
    if (this.props.delay) {
      this.timeout = setTimeout(() => {
        this.setState({ ready: true });
      }, this.props.delay);
    } else {
      this.setState({ ready: true });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onDone() {
    this.done += 1;
    const childLen = this.props.children.length || 1;
    if (this.done === childLen) {
      if (this.props.onFinishRender) {
        this.props.onFinishRender();
      }
    }
  }

  render() {
    if (this.state.ready) {
      const children = this.props.children.length ?
      this.props.children : [this.props.children];
      return (
        <span>
          {children.map((d, i) => {
            if (d.type.displayName === 'ReactDelayRender') {
              const props = Object.assign({}, d.props, { key: i });
              return React.createElement(d.type, props,
              d.props.children);
            }
            return (
              <DelayChild key={i} delay={d.props.delay} onDone={this.onDoneFn}>
                {d}
              </DelayChild>
            );
          })}
        </span>
      );
    }
    return <span></span>;
  }
}

ReactDelayRender.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  delay: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onFinishRender: PropTypes.func,
};

export { DelayChild };
export default ReactDelayRender;
