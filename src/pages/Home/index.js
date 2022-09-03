import React from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import News from '../News/index.js'
import HouseList from '../HouseList/index.js'
import Index from '../Index/index.js'
import Profile from '../Profile/index.js'
import './index.scss'

//TabBar数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home',
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list',
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news',
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile',
  },
]
export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    // fullScreen: true,
  }
  componentDidUpdate(prevProps) {
    //当路由切换时,重新对比前后网页地址，不一样时重新执行一次底部导航高亮逻辑
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
  //渲染TabBar.Item的方法
  renderTabBarItem() {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon} iconbottom`} />}
        selectedIcon={<i className={`iconfont ${item.icon} iconbottom`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          })
          //点击切换路由
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      ></TabBar.Item>
    ))
  }

  render() {
    return (
      <div className="home">
        {/* 渲染路由组件 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/news" component={News} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />
        {/* 底部菜单TabBar页面内容 */}
        <div className="tabBar">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.state.hidden}
            noRenderContent={true}
          >
            {this.renderTabBarItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}
