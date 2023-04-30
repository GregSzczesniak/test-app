import React from 'react';
import './Summary.scss';
import { TFinalProduct } from '../UserProducts/UserProducts';
import Title from '../Title/Title';


interface ISummary {
  products: TFinalProduct[];
}

const Summary = ({ products }: ISummary) => {
  const sum = products.reduce((acc, p) => acc + p.price!, 0);
  const currency = products[0].currency;

  return (
    <ul className="summary">
      {products.map((product) => {
        const { id, name, price, currency, regularPrice, isExtra } = product;
        return <li className="summary__item" key={`summary-${id}`}>
          {isExtra && <Title type="div" size="3" weight="bold">BONUS! </Title>}<Title type="div" size="4">{name}:</Title>

          <span>{regularPrice !== price && <span className="summary__crossed-out">{regularPrice} {currency}</span>}{price} {currency}</span>
        </li>
      })}
      <hr></hr>
      <Title type="span" size="3">Razem: {sum} {currency}</Title>
    </ul>
  )
};

export default Summary;