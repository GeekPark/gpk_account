import $ from 'jquery';

const createUser = params => (
  $.ajax({
    url: '/signup',
    method: 'POST',
    data: params,
  }).then(d => {
    if (d.statusText === 200) {
      return new Promise();
    } else {
      return new Promise();
    }
  })
);


export { createUser };
