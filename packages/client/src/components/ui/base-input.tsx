import { ChangeEventHandler } from 'react';
import styled from 'styled-components';

const Input = styled('input')`
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  height: 44px;
  max-width: 584px;
  padding: 0 20px;
  width: 100%;
`;

type BaseInputProps = {
  dataTestId: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onEnter: () => void;

  disabled?: boolean;
};

export default function BaseInput(props: BaseInputProps): JSX.Element {
  return (
    <Input
      data-testid={ props.dataTestId }
      disabled={ props.disabled }
      placeholder={ props.placeholder }
      value={ props.value }
      onChange={ props.onChange }
      onKeyDown={ (e) => {
        if (e.key === 'Enter') {
          props.onEnter();
        }
      } }
    />
  );
}