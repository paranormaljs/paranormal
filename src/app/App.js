// @flow
import React from 'react';
import styled from 'styled-components';
import type { ExamplesData } from '../types';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const NavBar = styled.nav`
  position: absolute;

  top: 0;
  height: 4rem;
  left: 0;
  right: 0;
  background: black;
  color: white;

  display: flex;
  align-items: stretch;
`;

const NavItem = styled.span`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 0.5rem 1.5rem;
`;

const NavLink = NavItem.withComponent('a').extend`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NavLogo = NavItem.extend`
  font-weight: 900;
  font-size: 1.5em;
`;

const NavSelect = styled.select`
  appearance: none;
  width: auto;
  padding: 0 2em;
  border-radius: 0;
  font: inherit;
  border: none;
  margin: 0;
  background: transparent;
  color: inherit;
`;

const ExampleFrame = styled.iframe`
  position: absolute;
  top: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
  border: 0;
`;

export type AppProps = {
  examples: ExamplesData,
};

export default class App extends React.Component<AppProps> {
  state = {
    active: this.props.examples[0].href,
  };

  handleChange = event => {
    console.log(event.target.value);
    this.setState({ active: event.target.value });
  };

  render() {
    console.log(this.props);
    return (
      <Container>
        <NavBar>
          <NavLogo>👻</NavLogo>
          <NavSelect onChange={this.handleChange} value={this.state.active}>
            {this.props.examples.map(example => {
              return (
                <option key={example.href} value={example.href}>
                  {example.title}
                </option>
              );
            })}
          </NavSelect>
        </NavBar>
        <ExampleFrame src={this.state.active} />
      </Container>
    );
  }
}
