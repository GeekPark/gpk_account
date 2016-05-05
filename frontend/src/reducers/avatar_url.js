const before = null;

export default function avatarURL(state = before, action) {
  switch (action.type) {
    case 'CHANGE_AVATAR':
      return action.url;
    default:
      return state;
  }
}
