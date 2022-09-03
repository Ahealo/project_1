import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import BASE_URL from '../../utils/url'
import { API } from '../../utils/api.js'
import styles from './index.module.css'
import { isAuth } from '../../utils/auth'
// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房'],
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁'],
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖'],
  },
]

// 百度地图
const BMap = window.BMapGL

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none',
}

export default class HouseDetail extends Component {
  state = {
    // 数据加载中状态
    isLoading: true,
    //是否收藏
    isFavorite: false,
    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466',
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: '',
    },
  }

  componentDidMount() {
    // 获取房屋数据
    this.getHouseDetail()
    this.checkFavorite()
  }

  //检查是否收藏的方法
  async checkFavorite() {
    // console.log('111')
    const isLogin = isAuth()
    if (!isLogin) {
      return
    } else {
      //已登录
      const { id } = this.props.match.params
      const res = await API.get(`/user/favorites/${id}`)
      // console.log('是否收藏信息', res)
      const { status, body } = res.data
      if (status === 200) {
        //表示请求成功，需要更新isFavorite
        this.setState({
          isFavorite: body.isFavorite,
        })
      }
    }
  }
  //点击收藏按钮方法
  handleFavorite = async () => {
    const alert = Modal.alert
    const isLogin = isAuth()
    const { history, location } = this.props
    const { isFavorite } = this.state
    const { id } = this.props.match.params
    // console.log(this.props)
    if (!isLogin) {
      // 未登录
      return alert('提示', '登录后才能收藏，是否去登录？', [
        { text: '取消' },
        {
          text: '确定',
          onPress: () => {
            //push第二个参数是state,用于指定登录后要返回的地址
            history.push('/login', { from: location })
          },
        },
      ])
    }
    if (isLogin) {
      //已登录
      if (isFavorite) {
        //已收藏
        const res = await API.delete(`/user/favorites/${id}`)
        //将收藏状态设置为未收藏
        this.setState({
          isFavorite: false,
        })
        if (res.data.status === 200) {
          Toast.info('已取消收藏', 1, null, false)
        } else {
          //token超时
          Toast.info('登录超时,请重新登录', 1, null, false)
        }
      } else {
        //未收藏，应该添加收藏
        const res = await API.post(`/user/favorites/${id}`)
        if (res.data.status === 200) {
          Toast.info('已收藏', 1, null, false)
          this.setState({
            isFavorite: true,
          })
        } else {
          //token超时
          Toast.info('登录超时,请重新登录', 1, null, false)
        }
      }
    }
  }
  /* 
    展示房屋详情：
    
    1 在找房页面中，给每一个房源列表项添加单击事件，在点击时跳转到房屋详情页面。
    2 在单击事件中，获取到当前房屋 id。
    3 根据房屋详情的路由地址，调用 history.push() 实现路由跳转。
    4 封装 getHouseDetail 方法，在 componentDidMount 中调用该方法。
    5 在方法中，通过路由参数获取到当前房屋 id。
    6 使用 API 发送请求，获取房屋数据，保存到 state 中。
    7 使用房屋数据，渲染房屋详情。
  */
  async getHouseDetail() {
    const { id } = this.props.match.params

    // 开启loading
    // this.setState({
    //   isLoading: true,
    // })

    const res = await API.get(`/houses/${id}`)

    // console.log(res.data.body)

    this.setState({
      houseInfo: res.data.body,
      isLoading: false,
    })

    const { community, coord } = res.data.body

    // 渲染地图
    this.renderMap(community, coord)
    window.scrollTo(0, 0)
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg },
    } = this.state

    return houseImg.map((item) => (
      <a key={item} href="www.baidu.com">
        <img src={BASE_URL + item} alt="" />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36),
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

  // 渲染标签
  renderTags() {
    const {
      houseInfo: { tags },
    } = this.state

    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }

  render() {
    const {
      isLoading,
      isFavorite,
      houseInfo: {
        community,
        title,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description,
      },
    } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>{this.renderTags()}</Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {/* <HousePackage list={supporting} /> */}
          {/* <div className="title-empty">暂无数据</div> */}

          {supporting.length === 0 ? (
            <div className={styles.titleEmpty}>暂无数据</div>
          ) : (
            <HousePackage list={supporting} />
          )}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map((item) => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom} onClick={this.handleFavorite}>
          <Flex.Item>
            <img
              src={
                BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>
              {isFavorite ? '已收藏' : '收藏'}
            </span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
