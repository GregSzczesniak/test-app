import React, { useContext } from 'react';
import Product from '../Product/Product';
import ProductsContext, { TProductItem } from '../../context/products-context';

interface IProducts {
  products: TProductItem[];
}

const ProductsList = ({ products }: IProducts) => {
  const { userProducts, availableProducts, removeProduct, addProduct } = useContext(ProductsContext);
  const disabledProducts = availableProducts
      .filter(product => product.disabled)
      .map(product => ({ id: product.id, enabledWith: product.enabledWith }));

  const onClickHandler = ({id, name, price, currency}: TProductItem) => {
    const selectedProduct = { id, name, price, currency };
    const isElementExist = userProducts.findIndex((product) => product.id === selectedProduct.id) > -1 ? true : false;

    if (isElementExist) {
      removeProduct(selectedProduct.id);
    } else {
      addProduct(selectedProduct);
    }
  }

  return (
    <ul className='products-list'>
      {products.map(product => {
        const { id, name, disabled } = product;
        // Check if the product should be enabled/disabled
        const isDisabledProduct = disabledProducts.some(el => el.id === id);
        const currentDisabledProduct = isDisabledProduct ? disabledProducts.filter(current => current.id === id)[0] : null;

        const isEnable = isDisabledProduct && currentDisabledProduct ? !userProducts.some(el => currentDisabledProduct.enabledWith?.includes(el.id)) : disabled;

        return (
          <Product
            key={id}
            id={id}
            name={name}
            onStatusChanged={() => onClickHandler(product)}
            disabled={isEnable}
          />
        )
      })}
    </ul>
  )
};

export default ProductsList;