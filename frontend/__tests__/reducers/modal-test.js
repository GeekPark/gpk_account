jest.unmock('../../src/reducers/modal');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import modal from '../../src/reducers/modal';

describe('modal reducer', () => {
  const before = {
    isOpen: false,
    modalName: null,
    modalStyle: {},
  };

  deepFreeze(before);

  it('open modal', () => {
    const after = {
      isOpen: true,
      modalName: 2,
      modalStyle: {
        overlay: {
          background: '#000',
        },
      },
    };

    expect(
      modal(before, { type: 'OPEN_MODAL', modalName: 2, modalStyle: {
        overlay: {
          background: '#000',
        },
      } })
    ).toEqual(after);
  });

  it('open modal with undefined style', () => {
    const after = {
      isOpen: true,
      modalName: 3,
      modalStyle: {},
    };

    expect(
      modal(before, { type: 'OPEN_MODAL', modalName: 3 })
    ).toEqual(after);
  });

  it('close modal', () => {
    expect(modal(before, { type: 'CLOSE_MODAL' })).toEqual({
      isOpen: false, modalName: null, modalStyle: {},
    });
  });
});
