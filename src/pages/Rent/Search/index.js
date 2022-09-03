import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.css'
import { API } from '../../../utils/api'

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: [],
  }
  //获取城市id
  getCity = () => {
    return JSON.parse(localStorage.getItem('hkzf_city'))
  }
  timerid = null
  //处理搜索栏信息
  handleChange = (value) => {
    // 当前城市id
    const { value: cityId } = this.getCity()

    this.setState({ searchTxt: value })
    //如果搜索栏为空，将提示信息清空
    if (!value) {
      return this.setState({
        tipsList: [],
      })
    } else {
      //先清除定时器
      clearTimeout(this.timerid)
      //开启定时器，如果输入间隔小于500毫秒则不会发送请求
      this.timerid = setTimeout(async () => {
        const res = await API.get('/area/community', {
          params: {
            name: value,
            id: cityId,
          },
        })
        console.log(res)
        this.setState({
          tipsList: res.data.body,
        })
      }, 500)
    }
  }
  //点击提示小区
  clickTip = (item) => {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community,
    })
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map((item) => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => {
          this.clickTip(item)
        }}
      >
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleChange}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
