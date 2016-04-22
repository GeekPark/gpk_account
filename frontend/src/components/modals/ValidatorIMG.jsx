import React from 'react';

const ValidatorIMG = () => (
  <div className="form-group">
    <input type="text" placeholder="验证码" maxLength="4" />
    <div className="form-side">
      <img src="/rucaptcha" alt="验证码" />
    </div>
  </div>
);

export default ValidatorIMG;
