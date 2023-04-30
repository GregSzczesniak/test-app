import React from 'react';
import './styles/main.scss';
import ProductsProvider from './context/ProductsProvider';
import Container from './UI/Container/Container';
import UserProducts from './components/UserProducts/UserProducts';
import UserSteps from './components/UserSteps/UserSteps';
import Column from './UI/Container/Column/Column';

function App() {

  return (
    <div id="root">
      <ProductsProvider>
        <Container col>
          <Column width={50}>
            <UserSteps />
          </Column>
          <Column width={50}>
            <UserProducts />
          </Column>
        </Container>
      </ProductsProvider>
    </div>
  );
}

export default App;
