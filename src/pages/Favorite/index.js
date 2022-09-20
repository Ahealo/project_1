import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { API } from '../../utils/api'
import BASE_URL from '../../utils/url'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'

import styles from './index.module.css'

export default class Favorite extends Component {
  state = {
    // 出租房屋列表
    list: [],
  }

  // 获取已发布房源的列表数据
  async getHouseList() {
    const res = await API.get('/user/favorites')

    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        list: body,
      })
    } else {
      const { history, location } = this.props
      history.replace('/login', {
        from: location,
      })
    }
  }

  componentDidMount() {
    this.getHouseList()
  }
  //渲染房屋列表
  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props

    return list.map((item) => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => history.push(`/detail/${item.houseCode}`)}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }
  //渲染页面方法
  renderRentList() {
    const { list } = this.state
    const hasHouses = list.length > 0
    //如果没有收藏房屋，返回没有房屋页面
    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有收藏房屋，
          <Link to="/home/list" className={styles.link}>
            去收藏房屋
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={() => history.go(-1)}>收藏管理</NavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}
