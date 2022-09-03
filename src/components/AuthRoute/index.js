import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

//使用该组件的方式为<AuthRoute path:'...' component={...}></AuthRoute>
//将参数component命名为Component，用于后面返回组件
//将AuthRpute接收到的props通过...rest传递给Route组件
const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLogin = isAuth()
        //已登录
        if (isLogin) {
          //将props传递给组件，组件才能获取到路由相关的信息
          return <Component {...props}></Component>
        }
        //未登录
        else {
          //返回路由重定向到地址/login
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      }}
    ></Route>
  )
}
export default AuthRoute
