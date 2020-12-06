import ConversorMoedas from './conversor-moedas';
import React from 'react';
import ReactDOM from 'react-dom';

it('Deve Renderizar o componente sem erros', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConversorMoedas/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

