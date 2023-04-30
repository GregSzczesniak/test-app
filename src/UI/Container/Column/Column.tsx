import React, { ReactNode } from 'react';
import './Column.scss';

interface IColumn {
  children: ReactNode;
  width: number;
}

const Column = ({ children, width}: IColumn) => {
  return (
    <div className={`column${width ? ' column--' + width : ''}`}>{children}</div>
  )
};

export default Column;