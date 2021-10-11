import { Api } from '@web-scraper/shared/src';
import { useEffect, useState } from 'react';
import Scraper, { Request, SubmitCallbackRequest } from './components/scraper/scraper';
import { storage } from './services/storage.service';
import { CustomError } from './utils/enums.util';
import styled from 'styled-components';

const AppContainer = styled('section')`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
`;

const ScrapeContainer = styled('section')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 90px;
`;

const Logo = styled('section')`
  color: orange;
  font-family: Verdana;
  font-size: 80px;
  font-weight: bold;
  padding-bottom: 20px;
`;

const ResultsContainer = styled('section')`
  border-top: 7px solid #FBBC04;
  color: #FFFFFF;
  display: grid;
  flex: 1;
  font-weight: bold;
  grid-auto-flow: column;
  grid-template-columns: 1.25fr 2.75fr;
  margin-top: 60px;
  min-width: 0;
  min-height: 0;
  width: 100%;
  word-wrap: break-word;
  word-break: break-all;
`;

const HistoryColumnMessage = styled('div')`
  display: flex;
  justify-content: center;
  padding-top: 24px;
`;

const HistoryColumn = styled('section')`
  background-color: #4285F4;
  border-right: 7px solid #FBBC04;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const PastSearchItem = styled('ol')<{ isSelected: boolean; isDisabled: boolean }>`
  background-color: ${ props => props.isSelected ? '#EA4335' : '#4285F4' };
  border-bottom: 3px solid #FBBC04;
  cursor: ${ props => props.isDisabled ? 'default' : 'pointer' };
  overflow: hidden;
  height: 75px;
  padding: 8px 16px;
  pointer-events: ${ props => props.isDisabled ? 'none' : 'auto' };
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: ${ props => props.isSelected ? '#EA4335' : '#FBBC04' };
    cursor: ${ props => props.isSelected ? 'default' : 'pointer' };
  }
`;

const OutputContainer = styled('section')`
  background-color: #4285F4;
  overflow-y: auto;
  padding: 24px;
`;

const Words = styled('section')`
  overflow-y: scroll;
  text-align: center;
`;

const Error = styled('div')`
  color: #cc0000;
`;

const LOGO_CONFIG: Record<string, string> = {
  'S': '#4285F4',
  'c': '#EA4335',
  'r': '#FBBC04',
  'a': '#4285F4',
  'p': '#34A853',
  'e': '#EA4335',
};

const App: React.FC = () => {
  const dateToMillis = (key: string) => {
    return new Date(JSON.parse(storage.getStorage()[key]).createdAt).getTime();
  };

  const dateToLocaleStr = (key: string) => {
    return new Date(JSON.parse(storage.getStorage()[key]).createdAt).toLocaleString();
  };

  const getSortedSearches = () => {
    return Object.keys(storage.getStorage()).filter((item) => item.includes('url='))
      .sort((a, b) => dateToMillis(b) - dateToMillis(a));
  };

  const getURL = (key: string) => {
    return key.split('url=')[1].split('&date=')[0];
  };

  const [{ isLoading, response, error }, setRequest] = useState<Request>({ isLoading: false });
  const [selectedSearch, setSelectedSearch] = useState<string>(getSortedSearches()[0]);

  useEffect(() => {
    // Every time the app loads we set the most recent past search as the selected one
    // We choose to go with that business logic for the time being to match how other similar apps do it
    if (selectedSearch) {
      setRequest({ isLoading: false, response: JSON.parse(storage.getStorage()[selectedSearch]) });
    }
  }, []);

  const onPastSearchClick = (key: string) => {
    setSelectedSearch(key);
    setRequest({ isLoading: false, response: JSON.parse(storage.getStorage()[key]) });
  };

  const onSubmitCallbackClick = (req: SubmitCallbackRequest) => {
    if (req.url && req.response) {
      const itemKey = `url=${ req.url }&date=${ req.response.createdAt }`;

      storage.setObject<{ data: Api.PostWordCount.ResponseBody['data']; createdAt: Date }>(
        itemKey,
        { data: req.response.data, createdAt: req.response.createdAt },
      );

      setSelectedSearch(itemKey);
    }

    setRequest(req);
  };

  return (
    <AppContainer>
      <ScrapeContainer>
        <Logo>
          {
            Object.keys(LOGO_CONFIG).map((key) => {
              return (
                <span key={ key } style={{ color: LOGO_CONFIG[key] }}>
                  { key }
                </span>
              );
            })
          }
        </Logo>
        <Scraper
          isLoading={ isLoading }
          onSubmitCallback={ onSubmitCallbackClick }
        />
      </ScrapeContainer>
      <ResultsContainer>
        <HistoryColumn>
          { !storage.getStorage().length &&
            <HistoryColumnMessage>
              Your past searches will be presented here
            </HistoryColumnMessage>
          }
          <ul>
            {
              getSortedSearches().map((key: string) =>
                <PastSearchItem
                  key={ key }
                  onClick={ () => onPastSearchClick(key) }
                  isSelected={ selectedSearch === key }
                  isDisabled={ isLoading }
                  >
                    { getURL(key) }<br /><br /><>{ dateToLocaleStr(key) }</>
                </PastSearchItem>
              )
            }
          </ul>
        </HistoryColumn>
        <OutputContainer>
          <Words>
            { !isLoading && !response && error && error.name === CustomError.QuotaExceeded && <Error>This item is too large in size and cannot be added</Error> }
            { !isLoading && !response && error && error.name !== CustomError.QuotaExceeded && <Error>{ error.message }</Error> }

            { isLoading && !error && <div>Loading...</div> }

            { !isLoading && !response && !error && <div>Your output will be presented here</div> }
            { !isLoading && response && !error && <section dangerouslySetInnerHTML={ { __html: response.data } } /> }
          </Words>
        </OutputContainer>
      </ResultsContainer>
    </AppContainer>
  );
};

export default App;