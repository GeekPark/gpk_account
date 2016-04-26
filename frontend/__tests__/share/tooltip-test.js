jest.unmock('../../src/share/tooltip');
import { initState } from '../../src/share/tooltip';

const defaultTip = {
  isShow: false,
  type: 'error',
  msg: '',
};

describe('tooltip', () => {
  it('initstate with keys', () => {
    expect(initState(['a', 'b'])).toEqual(
      {
        tooltips: {
          a: { ...defaultTip },
          b: { ...defaultTip },
        },
      }
    );
  });

  it('return {} with invild params', () => {
    expect(initState('x,b,asdf')).toEqual({});
  });
});
