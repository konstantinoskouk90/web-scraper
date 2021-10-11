import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scraper from './scraper';
import { noAuthApi } from '../../services/no-auth-api.service';

test('makes sure the component renders', () => {
  render(<Scraper isLoading={ false } onSubmitCallback={ jest.fn() } />);

  const container = screen.getByTestId('scraper-container');
  expect(container).toBeInTheDocument();
});

test('makes sure the component\'s input value updates', () => {
  const onSubmitCallbackFn = jest.fn();

  render(<Scraper isLoading={ false } onSubmitCallback={ onSubmitCallbackFn } />);

  const scraperBaseInput = screen.getByTestId('scraper-base-input');

  fireEvent.change(scraperBaseInput, { target: { value: 'https://' } });

  expect(scraperBaseInput).toHaveValue('https://');
});

test('makes sure the component\'s submit callback triggers, when the user presses enter, after inputting a valid URL', async () => {
  jest.spyOn(noAuthApi, 'getWordCount').mockResolvedValueOnce({
    data: '<div>a: 1</div>',
    createdAt: new Date(),
  });

  const onSubmitCallbackFn = jest.fn();

  render(<Scraper isLoading={ false } onSubmitCallback={ onSubmitCallbackFn } />);

  const scraperBaseInput = screen.getByTestId('scraper-base-input');

  fireEvent.change(scraperBaseInput, { target: { value: 'https://www.bbc.co.uk' } });
  expect(scraperBaseInput).toHaveValue('https://www.bbc.co.uk');
  
  fireEvent.keyDown(scraperBaseInput, { key: 'Enter', keyCode: 13 });
  await waitFor(() => expect(onSubmitCallbackFn).toHaveBeenCalled());
});