import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { isAuth, getToken, removeToken } from '../../utils/auth.js'
import { API } from '../../utils/api.js'
import BASE_URL from '../../utils/url'

import styles from './index.module.css'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity',
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' },
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

/* 
  1 在 state 中添加两个状态：isLogin（是否登录） 和 userInfo（用户信息）。
  2 从 utils 中导入 isAuth（登录状态）、getToken（获取token）。
  3 创建方法 getUserInfo，用来获取个人资料。
  4 在方法中，通过 isLogin 判断用户是否登录。
  5 如果没有登录，则不发送请求，渲染未登录信息。
  6 如果已登录，就根据接口发送请求，获取用户个人资料。
  7 渲染个人资料数据。
*/

export default class Profile extends Component {
  state = {
    // 是否登录
    isLogin: isAuth(),

    // 用户信息
    userInfo: {
      avatar: '',
      nickname: '',
    },
  }

  componentDidMount() {
    this.getUserInfo()
  }
  //获取个人资料，根据是否登录来判断发送请求
  async getUserInfo() {
    if (!this.state.isLogin) {
      // 未登录
      return
    }

    // 发送请求，获取个人资料,由于在请求拦截器中设置了请求头，所以在这里不用加上
    const res = await API.get('/user', {})

    // console.log(res)
    if (res.data.status === 200) {
      const { avatar, nickname } = res.data.body
      this.setState({
        userInfo: {
          avatar: BASE_URL + avatar,
          nickname,
        },
      })
      //返回状态码不为200时，应该将isLogin设置为false
    } else {
      this.setState({
        isLogin: false,
      })
    }
  }
  //退出方法
  logout = () => {
    const alert = Modal.alert
    alert('提示', '是否确定退出?', [
      { text: '取消' },
      {
        text: '退出',
        onPress: async () => {
          // 调用退出接口
          await API.post('/user/logout', null, {
            headers: {
              authorization: getToken(),
            },
          })

          // 移除本地token
          removeToken()

          // 处理状态
          this.setState({
            isLogin: false,
            userInfo: {
              avatar: '',
              nickname: '',
            },
          })
        },
      },
    ])
  }

  render() {
    const { history } = this.props

    const {
      isLogin,
      userInfo: { avatar, nickname },
    } = this.state

    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {/* 登录后展示： */}
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                  </Button>
                  {/* <Button
                    onClick={async () => {
                      const result = await API.post('/user/registered', {
                        username: test1,
                        password: test1,
                      })
                      console.log(result)
                    }}
                  >
                    注册
                  </Button> */}
                </div>
              )}
              {/* 未登录展示： */}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={(item) =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
