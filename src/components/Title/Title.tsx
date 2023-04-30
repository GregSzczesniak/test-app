import React, { ElementType, ReactNode } from 'react';
import { Polymorphic } from '../../utils/polymorphic.types';
import './Title.scss';

type TBaseTitle = {
  size: '1' | '2' | '3' | '4';
  align?: 'center' | 'left';
  spacer?: 's' | 'm' | 'l';
  weight?: 'regular' | 'bold';
  className?: string;
  children?: ReactNode;
  underline?: boolean;
};

export type TTitle<C extends ElementType> = Polymorphic<C, TBaseTitle>;

const defaultElement = 'h2';

const Title = <C extends ElementType = typeof defaultElement>({
  type,
  size,
  spacer,
  children,
  align,
  weight,
  underline,
}: TTitle<C>) => {
  const Component = type || defaultElement;
  const classes = `title${size ? ' title--h' + size : ''}${spacer ? ' title--spacer-' + spacer : ''}${weight ? ' title--weight-' + weight : ''}${align ? ' title--align-' + align : ''}`;

  return (
    <>
      <Component
        className={classes}
      >
        {children}
      </Component>
      {underline && <hr />}
    </>
  );
};

export default Title;
