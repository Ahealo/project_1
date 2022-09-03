import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import { API } from '../../utils/api.js'
import Nav1 from '../../assets/imags/nav-1.png'
import Nav2 from '../../assets/imags/nav-2.png'
import Nav3 from '../../assets/imags/nav-3.png'
import Nav4 from '../../assets/imags/nav-4.png'
import { getCurrentCity } from '../../utils/index.js'
import './index.scss'
import BASE_URL from '../../utils/url.js'
import SearchHeader from '../../components/SearchHeader'
// 底部导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list',
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list',
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map',
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent',
  },
]

export default class Index extends React.Component {
  state = {
    //轮播图数据
    swipers: [],
    //租房小组数据
    groups: [],
    //最新资讯数据
    news: [],
    //定位城市
    location: '',
    isSwiperloaded: false,
  }
  //生命周期钩子函数componentDidMount，组件第一次被渲染时
  componentDidMount() {
    this.getSwiper()
    this.getGroups()
    this.getNews()
    this.getCity()
  }
  //发起请求获取轮播图的数据
  //设置isSwiperloaded，当值为true时才渲染轮播图，数据加载完值才为true
  async getSwiper() {
    const res = await API.get('/home/swiper')
    this.setState({
      swipers: res.data.body,
      isSwiperloaded: true,
    })
  }
  //获取租房小组信息
  async getGroups() {
    const res = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0',
      },
    })
    //Grids宫格数据存放到groups
    this.setState({
      groups: res.data.body,
    })
  }
  //获取最新资讯信息
  async getNews() {
    const res = await API.get('/home/news')
    this.setState({
      news: res.data.body,
    })
  }
  //根据定位获取城市信息
  async getCity() {
    const curCity = await getCurrentCity()

    this.setState({
      location: curCity.label,
    })
  }
  //渲染轮播图方法
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="www"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  //渲染导航栏菜单的方法
  renderNav() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ))
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
      <div className="index">
        {/* 轮播图 */}
        <div className="Carousel">
          {this.state.isSwiperloaded ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>
        {/* 搜索框 */}
        <div className="indexsearch">
          <SearchHeader cityName={this.state.location} />
        </div>
        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNav()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <h5 className="title">
            租房小组<span className="more">更多</span>
          </h5>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <h4 className="group-title">{item.title}</h4>
                  <span className="info">{item.desc}</span>
                </div>

                <img src={BASE_URL + item.imgSrc} alt="" className="img" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h5 className="title">
            最新资讯<span className="more">更多</span>
          </h5>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
