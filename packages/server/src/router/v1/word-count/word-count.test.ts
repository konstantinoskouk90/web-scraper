import { expect } from 'chai';
import { cleanseTextToArr, countSortWords, tupleToHTML } from './word-count.get';

describe('/GET word-count', async function () {

  it('It should cleanse the text and convert it to an array', () => {
    const cleanse = cleanseTextToArr('Tell the audience what you are going to say. Say it. Then tell them what you have said.');

    expect(cleanse).to.eql([
      'tell',  'the',  'audience',
      'what',  'you',  'are',
      'going', 'to',   'say',
      'say',   'it',   'then',
      'tell',  'them', 'what',
      'you',   'have', 'said'
    ]);
  });

  it('It should count the word frequency by using a dictionary and convert to a sorted by ascending order array of tuples', () => {
    const tupleArr = countSortWords([
      'tell',  'the',  'audience',
      'what',  'you',  'are',
      'going', 'to',   'say',
      'say',   'it',   'then',
      'tell',  'them', 'what',
      'you',   'have', 'said'
    ]);
    
    expect(tupleArr).to.eql([
      ['are', 1],   ['audience', 1],
      ['going', 1], ['have', 1],
      ['it', 1],    ['said', 1],
      ['say', 2],   ['tell', 2],
      ['the', 1],   ['them', 1],
      ['then', 1],  ['to', 1],
      ['what', 2],  ['you', 2]
    ]);
  });

  it('It should convert an array of tuples to stringified HTML', () => {
    const htmlStr = tupleToHTML([
      ['are', 1],   ['audience', 1],
      ['going', 1], ['have', 1],
      ['it', 1],    ['said', 1],
      ['say', 2],   ['tell', 2],
      ['the', 1],   ['them', 1],
      ['then', 1],  ['to', 1],
      ['what', 2],  ['you', 2]
    ]);

    expect(htmlStr).equal(
      '<div>are: 1</div><div>audience: 1</div><div>going: 1</div><div>have: 1</div><div>it: 1</div><div>said: 1</div><div>say: 2</div><div>tell: 2</div><div>the: 1</div><div>them: 1</div><div>then: 1</div><div>to: 1</div><div>what: 2</div><div>you: 2</div></div>'
    );
  });
});