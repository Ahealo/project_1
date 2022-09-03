import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import { API } from '../../utils/api'
import { withFormik } from 'formik'
import * as Yup from 'yup'
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Registe extends Component {
  render() {
    // 通过 props 获取高阶组件传递进来的属性
    const { values, handleSubmit, handleChange, handleBlur, errors, touched } =
      this.props

    // console.log(errors, touched)

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号注册</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {errors.username && touched.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {errors.password && touched.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>密码为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={values.repassword}
                onChange={handleChange}
                onBlur={handleBlur}
                name="repassword"
                type="password"
                placeholder="请重新输入密码"
              />
            </div>
            {errors.repassword && touched.repassword && (
              <div className={styles.error}>{errors.repassword}</div>
            )}
            <div className={styles.formSubmit}>
              <button
                className={styles.submit}
                type="button"
                onClick={handleSubmit}
              >
                注册
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/home">回到首页</Link>
            </Flex.Item>
            <Flex.Item>
              <Link to="/login">返回登录</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用 withFormik 高阶组件包装 Login 组件，为 Login 组件提供属性和方法
Registe = withFormik({
  // 提供状态：
  mapPropsToValues: () => ({ username: '', password: '', repassword: '' }),

  // 添加表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
    repassword: Yup.string()
      .required('请再输一次密码')
      .oneOf([Yup.ref('password'), null], '密码必须一致'),
  }),

  // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    // 获取账号和密码
    const { username, password } = values

    // console.log('表单提交了', username, password)
    // 发送请求
    const res = await API.post('/user/registered', {
      username,
      password,
    })
    console.log(res)
    // console.log('登录结果：', res)
    const { status, description } = res.data

    if (status === 200) {
      // 注册成功
      Toast.info(description, 2, null, false)

      props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  },
})(Registe)

// 注意：此处返回的是 高阶组件 包装后的组件
export default Registe
