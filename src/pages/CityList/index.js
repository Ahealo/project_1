import React from 'react'
import { Toast } from 'antd-mobile'
import './index.scss'
import { API } from '../../utils/api.js'
import { getCurrentCity } from '../../utils/index.js'
import { List, AutoSizer } from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
/*
// 接口返回的数据格式：
[{ "label": "北京", "value": "", "pinyin": "beijing", "short": "bj" }]

// 渲染城市列表的数据格式为：
{ a: [{}, {}], b: [{}, ...] }
// 渲染右侧索引的数据格式：
['a', 'b']
*/
//处理城市列表信息
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex = []

  // 1 遍历list数组
  list.forEach((item) => {
    // 2 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 4 如果有，直接往该分类中push数据
      // cityList[first] => [{}, {}]
      cityList[first].push(item)
    } else {
      // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })
  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex,
  }
}
// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
//有房源的城市数据
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

export default class CityList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    }

    //创建ref对象
    this.cityListComponent = React.createRef()
  }
  async componentDidMount() {
    await this.getCityList()
    //measureAllRows用于计算列表中每一行的高度，即能提前渲染列表
    //由于使用该方法前需要获取到数据，所以给getCityList方法加上await
    //  this.cityListComponent.current.measureAllRows()
  }
  //修改城市的方法
  changeCity = ({ label, value }) => {
    if (HOUSE_CITY.indexOf(label) > -1) {
      //将数值更新到local Storage中
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市无房源', 1)
    }
  }
  //用rowRenderer渲染列表组件
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 数组中的索引号
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    //通过索引获取每一项的属性名
    const letter = cityIndex[index]
    //根据属性值获取对应的城市信息

    const cityItem = Array.from(cityList[letter])

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityItem.map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              this.changeCity(item)
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    // 获取到 cityIndex，并遍历其，实现渲染
    const { cityIndex, activeIndex } = this.state
    // console.log('cityIndex', cityIndex)
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        {/* 判断数组中每一项索引是否跟activeIndex相同，如果相同则添加类名实现高亮 */}
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  //通过startIndex得到列表底部的索引值，将索引设置为activeIndex，控制高亮效果
  onRowsRendered = ({ startIndex }) => {
    this.setState({
      activeIndex: startIndex,
    })
  }
  //获取城市列表信息
  async getCityList() {
    const res = await API.get('/area/city?level=1')
    //将处理完的城市列表信息导出
    const { cityList, cityIndex } = formatCityData(res.data.body)

    //获取热门城市信息
    const hotres = await API.get('/area/hot')
    //将热门城市信息添加到cityList
    cityList['hot'] = hotres.data.body
    cityIndex.unshift('hot')
    //获取定位城市信息
    const localCity = await getCurrentCity()
    // console.log(localCity)
    //将热门城市信息添加到cityList
    cityList['#'] = [localCity]
    cityIndex.unshift('#')
    // console.log(cityList, cityIndex)
    this.setState({ cityIndex, cityList })
  }

  render() {
    return (
      <div className="List">
        {/* 顶部导航 */}
        <div className="Listhead navBar">
          <NavHeader>城市列表</NavHeader>
        </div>
        <div className="Listbody">
          {/* 列表区域 */}
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.cityListComponent}
                height={height}
                width={width}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
              />
            )}
          </AutoSizer>
          {/* 侧边索引导航 */}
          <ul className="city-index">{this.renderCityIndex()}</ul>
        </div>
      </div>
    )
  }
}
