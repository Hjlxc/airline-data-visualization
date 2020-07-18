import React, { PureComponent } from 'react';

const defaultStyle = {
  margin: { top: 30, right: 120, bottom: 30, left: 120 },
  color: ['steelblue', '#ccc'],
  duration: 750,
};

const styles = {
  default: defaultStyle,
  customize: {
    ...defaultStyle,
    margin: { top: 50, right: 200, bottom: 50, left: 200 },
    color: ['red', '#000'],
  },
};

export const StyleContext = React.createContext(styles.default);

// override default provider to pass the setStyle action to child component
export class StyleProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      style: this.getStyle(props.style),
    };

    // fix me: for dev test, remove or use env variable to hide for production env
    window.setStyle = this.setStyle;
  }
  getStyle = (style) => styles[style] || styles.default;

  setStyle = (style) => this.setState({ style: this.getStyle(style) });
  render() {
    return (
      <StyleContext.Provider value={{ ...this.state, setStyle: this.setStyle }}>
        {this.props.children}
      </StyleContext.Provider>
    );
  }
}
