import React, { useCallback, useEffect, useState } from 'react';
import './UserProducts.scss';
import Product from '../Product/Product';
import ProductsContext from '../../context/products-context';
import { useContext } from 'react';
import Title from '../Title/Title';
import { TProductItem } from '../../context/products-context';
import priceList from '../../priceList.json';
import packages from '../../packages.json';
import Summary from '../Summary/Summary';

interface IPriceList {
  id: string;
  price: number;
  currency: string;
};

interface IPackage {
  id: string;
  regularPrice: number;
  discountedPrice: number;
  saving: number;
}

export type TFinalProduct = TProductItem & { regularPrice: number; isExtra: boolean };

const UserProducts = () => {
  const userProducts = useContext(ProductsContext).userProducts;
  const currentYear = useContext(ProductsContext).year;
  const availableProducts = useContext(ProductsContext).availableProducts;
  const [products, setProducts] = useState<TProductItem[]>(userProducts);
  const [currentPriceList, setCurrentPriceList] = useState<IPriceList[]>();
  const [finalProductsIdList, setFinalProductsIdList] = useState<TFinalProduct[]>([]);

  const detectPackages = (products: TProductItem[]) => {
    const productsId = new Set(products.map(product => product.id));
    const availablePackages = new Set<string>();

    for (const pack of packages) {
      const productsInPackage = pack.products;
      const shouldBePackage = productsInPackage.every(id => productsId.has(id));

      if (shouldBePackage) {
        availablePackages.add(pack.id);
      }
    }

    return Array.from(availablePackages);
  }

  const getBetterPackage = (arr: IPackage[], compareable: string) => {
    const maxObj = arr?.reduce((acc: any, obj: any) => obj[compareable] > acc[compareable] ? obj : acc);
    return maxObj.id;
  }

  const comparePackages = useCallback((availablePackages: string[], priceList: IPriceList[]) => {
    let valueOfPackages: IPackage[] = [];

    packages.forEach(pack => {
      const currentPackage = availablePackages.find(p => p === pack.id);
      console.log(currentPackage, 'current package');

      if (currentPackage) {
        let valueOfProducts = 0;

        pack.products.forEach(product => {
          const productsToSum = priceList?.filter(p => p.id === product);
          valueOfProducts = valueOfProducts + productsToSum[0].price;

          return valueOfProducts;
        });

        const extraProducts = pack.extraProducts.length > 0 ? pack.extraProducts : null;
        let extraProductValue = 0;

        if (extraProducts) {
          extraProducts?.forEach((el) => {
            extraProductValue += priceList?.filter(p => p.id === el)[0].price;
          });
        }
        const regularPrice = valueOfProducts + extraProductValue;
        const discountedPrice = priceList?.filter(p => p.id === currentPackage)[0].price;

        valueOfPackages.push({
          id: currentPackage,
          regularPrice: regularPrice,
          discountedPrice: discountedPrice,
          saving: regularPrice - discountedPrice,
        });
      }
    });

    if (valueOfPackages.length <= 0) return undefined;
    // Return better Package
    return valueOfPackages?.filter(p => p.id === getBetterPackage(valueOfPackages, 'saving'))[0];
  }, []);

  const getFinalProductsList = useCallback((currentPackage: IPackage | undefined, products: TProductItem[], priceList: IPriceList[]) => {
    const productsId = products.map(product => product.id);

    if (!currentPackage) {
      const finalListWithPrices: TFinalProduct[] = [];

      products.forEach(product => {
        const currentPrice = priceList?.filter(p => p.id === product.id)[0];

        finalListWithPrices.push({
          id: product.id,
          name: product.name,
          price: currentPrice.price,
          currency: currentPrice.currency,
          regularPrice: currentPrice.price,
          isExtra: false,
        });
      });
      return finalListWithPrices;
    } else {
      for (const pack of packages) {
        if (pack.id === currentPackage.id) {
          const productsInPackage = pack.products;

          // Remove products from user list which package contains
          const finalProductsIdList = productsId
            .filter(value => !productsInPackage.includes(value))
            .filter(value => !pack.extraProducts.includes(value))
            .concat(productsInPackage.filter(value => !productsId.includes(value)));

          // Add Package id to final products list
          finalProductsIdList.push(currentPackage.id);

          // Add extra products to final products list if exists
          const extraProductsId = pack.extraProducts;
          let extraProductsValue = 0;
          if (extraProductsId.length > 0) {
            pack.extraProducts.forEach((el) => {
              extraProductsValue += priceList?.filter(p => p.id === el)[0].price;
              finalProductsIdList.push(el);
            });
          }

          const finalListWithPrices: TFinalProduct[] = [];

          finalProductsIdList.forEach(productId => {
            const isPackage = productId === currentPackage.id;
            const currentPriceList = priceList?.filter(p => p.id === productId)[0];
            const extraProductId = extraProductsId.filter(p => p === productId)[0];

            const name = extraProductId ? availableProducts?.filter(p => p.id === productId)[0].name : !isPackage ? products?.filter(p => p.id === productId)[0].name : pack.name;
            const regularPrice = !isPackage ? currentPriceList.price : currentPackage.regularPrice - extraProductsValue;
            const price = extraProductId ? 0 : currentPriceList.price;

            finalListWithPrices.push({
              id: productId,
              name: name,
              price: price,
              currency: currentPriceList.currency,
              regularPrice: regularPrice,
              isExtra: extraProductId ? true : false,
            });
          });

          return finalListWithPrices;
        }
      }
    }
  }, [availableProducts]);

  useEffect(
    function getFinalOffer() {
      setProducts(userProducts);
      if (currentYear !== '') {
        const currentYearPrices = priceList.filter(list => list.year.toString() === currentYear);
        const currentYearProductsPrices = currentYearPrices.map(list => list.products);
        setCurrentPriceList(currentYearProductsPrices[0]);

        const availablePackages = detectPackages(userProducts);
        const betterPackage = comparePackages(availablePackages, currentYearProductsPrices[0]);
        const idsList = getFinalProductsList(betterPackage, userProducts, currentYearProductsPrices[0]);

        if (idsList) {
          setFinalProductsIdList(idsList);
        }
      }
    },
  [comparePackages, currentYear, getFinalProductsList, userProducts]);

  return (
    <div className="user-products">
      <Title size="2" underline align="center">Twój wybór</Title>
      <ul className="user-products__list">
        {products.map((product) => {
          const { id, name } = product;
          const currentProduct = currentPriceList?.filter(product => product.id === id)[0];

          return (
            <Product
              key={id}
              id={id}
              name={name}
              price={currentProduct?.price}
              currency={currentProduct?.currency}
              className="product--picked"
            />
          )
        })}
      </ul>
      {finalProductsIdList.length > 0 && (
        <>
          <Title type="h2" size="2" align="center" underline>Nasza Oferta</Title>
          <Summary products={finalProductsIdList} />
        </>
      )}
    </div>
  )
};

export default UserProducts;