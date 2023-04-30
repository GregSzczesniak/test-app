import { ChangeEvent } from 'react';
import './Select.scss';
import { removeSpaces } from '../../utils/index';

interface ISelect {
  id: string;
  name: string;
  label: string;
  items: string[];
  onSelect: (value: string) => void;
}

const Select = ({ id, label, name, items, onSelect }: ISelect) => {
  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  }

  return (
    <div className="select">
      <label className="select__label" htmlFor={id}>{label}</label>
      <select name={name} id={id} onChange={handleOnChange}>
        <option key="zero-option" value=""></option>
        {items.map(item => <option key={removeSpaces(item)} value={removeSpaces(item)}>{item}</option>)}
      </select>
    </div>
  )
};

export default Select;