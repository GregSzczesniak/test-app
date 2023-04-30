import React, { ReactNode } from 'react';
import './Container.scss';

interface IContainer {
  children: ReactNode;
  col?: boolean;
  inner?: boolean;
}

const Container = ({ children, col, inner}: IContainer) => {
  const classes = `${col ? ' container--column' : ''}${inner ? ' container--inner' : ''}`

  return (
    <div className={`container${classes}`}>{children}</div>
  )
};

export default Container;