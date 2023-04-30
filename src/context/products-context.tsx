import React from 'react';
import { IProduct } from '../components/Product/Product';

export type TProductItem = Omit<IProduct, 'onStatusChanged'>;

export interface IPriceList {
  year: number;
  products: { id: string; price: number; currency: string; }[];
}

export interface IProductsContext {
  userProducts: TProductItem[];
  availableProducts: TProductItem[];
  year: string;
  priceList: IPriceList[];
  addProduct: (product: TProductItem) => void;
  removeProduct: (id: string) => void;
  setYear: (year: string) => void;
}

const ProductsContext = React.createContext<IProductsContext>({
  userProducts: [],
  availableProducts: [],
  year: '',
  priceList: [],
  addProduct: () => {},
  removeProduct: () => {},
  setYear: () => {}
});

export default ProductsContext;