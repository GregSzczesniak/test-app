import React, { useRef } from 'react';
import './Product.scss';
import { TProductItem } from '../../context/products-context';

export interface IProduct {
  id: string;
  name: string;
  price?: number | null;
  currency?: string;
  disabled?: boolean;
  enabledWith?: string[];
  onStatusChanged?: ({ id, name, price, currency, disabled }: TProductItem) => void;
}

type TProduct = IProduct & { className?: string };

const Product = ({ id, name, price, currency, disabled, onStatusChanged, className }: TProduct) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = () => {
    onStatusChanged?.({ id, name, price, currency, disabled });
  }

  return (
    <li
      className={`product${className ?  ' ' + className : ''}`}
      key={id}
    >
      <input
        className="product__checkbox"
        type="checkbox"
        name="product-checkbox"
        value={name}
        onChange={handleChange}
        disabled={disabled}
        ref={inputRef}
        checked={disabled ? false : inputRef.current ? inputRef.current.checked : false}
      />
      <div className="product__wrapper">
        <div className="product__name">{name}</div>
        <div className="product__price">
          {price && currency && (
            <>
              <span>{price}</span>
              <span className="product__unit">{currency}</span>
            </>
          )}
        </div>
      </div>

    </li>
  )
};

export default Product;