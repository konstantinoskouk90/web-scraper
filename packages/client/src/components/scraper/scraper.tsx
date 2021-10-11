import { Api } from '@web-scraper/shared/src';
import { AxiosError } from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import { noAuthApi } from '../../services/no-auth-api.service';
import BaseInput from '../ui/base-input';

const ScraperContainer = styled('section')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 525px;
`;

export type Request = {
  isLoading: boolean;
  error?: Error;
  response?: Api.PostWordCount.ResponseBody;
};

export type SubmitCallbackRequest = Request & { url?: string | undefined };

export type ScraperProps = {
  isLoading: boolean;
  onSubmitCallback: (request: SubmitCallbackRequest) => void;
};

const Scraper: React.FC<ScraperProps> = ({ isLoading, onSubmitCallback }) => {
  const [url, setUrl] = useState('');

  const onEnter = async() => {
    if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)) {
      onSubmitCallback({ isLoading: false, error: new Error('Please enter a valid URL') });

      return;
    }

    onSubmitCallback({ isLoading: true });

    await noAuthApi.getWordCount({ url: url })
      .then((response) => {
        onSubmitCallback({ isLoading: false, response, url });
      })
      .catch((error) => {
        onSubmitCallback({ isLoading: false, error });
      })
      .finally(() => {
        setUrl('');
      });
  };

  return (
    <ScraperContainer data-testid='scraper-container'>
      <BaseInput
        dataTestId='scraper-base-input'
        placeholder='Type a URL and press Enter'
        value={ url }
        onChange={ (event: { target: { value: string } }) => setUrl(event.target.value) }
        onEnter={ onEnter }
        disabled={ isLoading }
      />
    </ScraperContainer>
  );
}

export default Scraper;