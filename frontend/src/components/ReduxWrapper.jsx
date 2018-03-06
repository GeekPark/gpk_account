import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import reducers from '../reducers/index';
import intl from "react-intl-universal";
const en = {
  "记住我": "Remember me",
  "登录": "Log in",
  "退出登录": "Logout",
  "登录中": "Logging in",
  "用户不存在": "User does not exist",
  "用户名不能为空": "User name cannot be blank",
  "用户名必须为邮箱或手机号": "User name can only be email address or phone number",
  "密码不能为空": "Password cannot be blank",
  "请填写密码": "Please fill in the password",
  "密码必须在 6-32 位": "Password must be 6-32 characters",
  "密码格式不对": "Password format invalid",
  "手机号码/邮箱": "Mobile number/ email address",
  "密码": "Password",
  "立即登录": "Log in now",
  "记住我": "Remember me",
  "忘记密码？": "Forget password?",
  "注册": "Register",
  "用户已存在": "User already exists",
  "邮箱": "Email address",
  "手机号": "Mobile number",
  "不能为空": "cannot be blank",
  "格式不对": "format invalid",
  "邮箱校验码": "E-mail verification code",
  "手机校验码": "Verification code",
  "获取校验码": "Obtain verification code",
  "校验码必须为6位数数字": "Verification code must be 6 characters",
  "请获取校验码并输入": "Please obtain verification code and enter the code",
  "手机号码（仅支持中国大陆）": "Mobile number (Chinese numbers only)",
  "使用手机注册": "Use mobile to register",
  "使用邮箱注册": "Use email address to register",
  "密码": "Password",
  "立即注册": "Register now",
  "微信登录": "Log in via WeChat",
  "通过第三方帐号登录": "Log in via 3rd party account",
  "手机浏览器内暂不支持微信登录，请前往桌面端登录或复制链接在微信内打开。": "Mobile browser does not support WeChat login, please go to the desktop login or copy link opened in WeChat.",
  "返回登录": "Return to login",
  "重设密码": "Reset password",
  "校验码将会发送至你的注册邮箱或手机": "The verification code will be sent to your registered email address or mobile phone",
  "新密码": "New password",
  "密码修改成功，正在跳转中...": "Password is modified successfully, opening new page ...",
  "请填写手机号或邮箱": "Please fill in the phone number or email",
  "邮箱或手机号不对喔": "Email or cell phone number is not valid",
  "验证码不能为空": "Verification code must be filled",
  "请输入4位数验证码": "Please enter the 4 digit verification code",
  "图形验证码": "Captcha",
  "重新发送": "Resend",
  "验证码": "Verification code",
  "验证码发送成功": "Verification code sent successfully",
  "请输入下面的图形验证码": "Please enter the following image verification code",
  "提交": "Submit",
  "昵称不能为空": "Username should be filled",
  "昵称必须在 2-20 个字符喔": "Username must be 2-20 characters",
  "更新成功, 自动跳转中...": "Update successful, leaving for new page ...",
  "请输入你的昵称": "Please enter your nickname",
  "恭喜你成功注册极客公园帐号！": "Congratulations on your successful registration GeekPark account!",
  "快来为你的帐号起个响亮的名字，配个帅气的头像吧！": "Please input your name for your account with a profile picture now!",
  "跳过，稍后去帐号中心设置": "Skip, go to the account center settings later",
  "帐号中心": "Account",
  "头像更新成功": "Profile picture updated successfully",
  "上传头像": "Upload profile picture"
}

let cn = {}
for (let i in en) {
  cn[i] = i
}

console.log('navigator.language', navigator.language)

intl.init({
  currentLocale: navigator.language == 'zh-CN' ? 'cn' : 'en',
  locales: {cn, en},
})

const store = createStore(reducers, {}, compose(
  applyMiddleware(ReduxThunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const ReduxWrapper = props => (
  <Provider store={store}>
    {props.children}
  </Provider>
);

ReduxWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ReduxWrapper;


