jest.unmock('../../src/reducers/modal');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import modal from '../../src/reducers/modal';

describe('modal reducer', () => {
  const before = {
    isOpen: false,
    modalName: null,
  };

  deepFreeze(before);

  it('open modal', () => {
    const after = {
      isOpen: true,
      modalName: 2,
    };

    expect(
      modal(before, { type: 'OPEN_MODAL', modalName: 2 })
    ).toEqual(after);
  });

  it('close modal', () => {
    expect(modal(before, { type: 'CLOSE_MODAL' })).toEqual({
      isOpen: false, modalName: null,
    });
  });
});
