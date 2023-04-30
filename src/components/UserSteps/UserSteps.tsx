import React, { useContext } from 'react';
import ProductsList from '../ProductsList/ProductsList';
import Title from '../Title/Title';
import Select from '../Select/Select';
import ProductsContext from '../../context/products-context';

const UserSteps = () => {
  const { setYear, availableProducts, priceList } = useContext(ProductsContext);
  const yearsList = priceList.map(item => item.year.toString());

  const handleOptionSelect = (option: string) => {
    setYear(option);
  }

  return (
      <div className="user-steps">
        <Title size="2" align="center" underline>Lista usług</Title>
        <Title type="h3" size="3"><div>Krok 1.</div> Wybierz interesujące cię produkty</Title>
        <ProductsList products={availableProducts} />
        <Title type="h3"  size="3"><div>Krok 2.</div> Wybierz rok obowiązywania umowy</Title>
        <Select name="year" label="Wybierz rok" id="select-year" items={yearsList} onSelect={handleOptionSelect} />
      </div>
  )
};

export default UserSteps;