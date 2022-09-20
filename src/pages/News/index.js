import React from 'react'

import { Flex, WingBlank } from 'antd-mobile'
import BASE_URL from '../../utils/url'
import { API } from '../../utils/api'
import './index.scss'
export default class News extends React.Component {
  state = {
    //最新资讯数据
    news: [],
  }
  componentDidMount() {
    this.getNews()
  }
  //获取最新资讯信息
  async getNews() {
    const res = await API.get('/home/news')
    this.setState({
      news: res.data.body,
    })
  }
  //渲染最新资讯方法
  renderNews() {
    return this.state.news.map((item) => (
      <Flex className="newsItem" key={item.id}>
        <img src={BASE_URL + item.imgSrc} alt=""></img>
        <div className="text">
          <h5 className="newsTitle">{item.title}</h5>
          <div className="newsBottom">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </div>
        </div>
      </Flex>
    ))
  }
  render() {
    return (
      <div className="news">
        <WingBlank size="md">{this.renderNews()}</WingBlank>
      </div>
    )
  }
}
