import cloneDeep from 'lodash/cloneDeep';

const defaultTip = {
  isShow: false,
  type: 'error',
  msg: '',
};

export function initState(keys) {
  const tooltips = {};
  if (!Array.isArray(keys)) return {};
  keys.forEach(x => {
    tooltips[x] = { ...defaultTip };
  });
  return { tooltips };
}

export function postErr(tipName, msg) {
  this.clearAllTip();
  const newTips = cloneDeep(this.state.tooltips);
  newTips[tipName] = { ...newTips[tipName], type: 'error', msg, isShow: true };
  this.setState({ tooltips: newTips });
}

export function clearAllTip() {
  const newTips = cloneDeep(this.state.tooltips);
  Object.keys(newTips).forEach(x => {
    newTips[x].isShow = false;
  });

  this.setState({ tooltips: newTips });
}

export function hideTip(tipName) {
  const newTips = cloneDeep(this.state.tooltips);
  newTips[tipName].isShow = false;
  this.setState({ tooltips: newTips });
}
