import React, { useReducer, ReactNode } from 'react';
import ProductsContext, { IProductsContext, TProductItem, IPriceList } from './products-context';
import products from '../products.json';
import priceList from '../priceList.json';


type TProductsAction = {
  type: 'ADD',
  product: TProductItem;
} | {
  type: 'REMOVE',
  id: string;
} | {
  type: 'SET_YEAR',
  year: string;
}

interface IProductState {
  userProducts: TProductItem[];
  availableProducts: TProductItem[];
  year: string;
  priceList: IPriceList[];
}

const defaultProductsState: IProductState = {
  userProducts: [],
  availableProducts: products,
  year: '',
  priceList: priceList
};

interface IProductsProviderProps {
  children: ReactNode;
}

const productsReducer = (state: IProductState, action: TProductsAction) => {
  if (action.type === 'ADD') {
    const updatedProducts = state.userProducts.concat(action.product);

    return {
      ...state,
      userProducts: updatedProducts,
    };
  }

  if (action.type === 'REMOVE') {
    const disabledProducts = state.availableProducts
      .filter(product => product.disabled)
      .map(product => ({ id: product.id, enabledWith: product.enabledWith }));

    // Check if product which could be selected only with other product
    // will be removed if the other product appears unselected
    const additionalProductToRemove = disabledProducts.find(disabledProduct =>
      state.userProducts.some(product => product.id === disabledProduct.id && disabledProduct.enabledWith?.includes(action.id))
    )?.id;

    const updatedProducts = state.userProducts.filter(product =>
      product.id !== action.id && product.id !== additionalProductToRemove
    );

    return {
      ...state,
      userProducts: updatedProducts,
    };
  }

  if (action.type === 'SET_YEAR') {

    return {
      ...state,
      year: action.year,
    }
  }

  return defaultProductsState;
};

const ProductsProvider: React.FC<IProductsProviderProps> = (props) => {
  const [productsState, dispatchProductAction] = useReducer<React.Reducer<IProductState, TProductsAction>>(productsReducer, defaultProductsState);

  const addProductHandler = (product: TProductItem) => {
    dispatchProductAction({ type: 'ADD', product: product});
  };

  const removeProductHandler = (id: string) => {
    dispatchProductAction({ type: 'REMOVE', id: id });
  };

  const setYearHandler = (year: string) => {
    dispatchProductAction({ type: 'SET_YEAR', year: year });
  }

  const productsContext: IProductsContext = {
    userProducts: productsState.userProducts,
    availableProducts: productsState.availableProducts,
    year: productsState.year,
    priceList: productsState.priceList,
    addProduct: addProductHandler,
    removeProduct: removeProductHandler,
    setYear: setYearHandler,
  };

  return (
    <ProductsContext.Provider value={productsContext}>
      {props.children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;