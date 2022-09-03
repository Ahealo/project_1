import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import { Flex } from 'antd-mobile'
// import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { API } from '../../utils/api'
import Filter from './components/Filter'
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from 'react-virtualized'
import HouseItem from '../../components/HouseItem/index.js'
import BASE_URL from '../../utils/url'
import Sticky from '../../components/Sticky/index.js'
import { Toast } from 'antd-mobile'
export default class HouseList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      locaCity: '',
      // 列表数据
      list: [],
      // 总条数
      count: 0,
    }
  }
  //初始化实例对象，当渲染页面时从this.filters拿到filters
  filters = {}
  componentDidMount() {
    this.getlocaCity()
    this.searchHouseList()
  }
  componentWillUnmount() {
    Toast.hide()
  }
  //获取当前城市
  getlocaCity() {
    const { label } = JSON.parse(localStorage.getItem('hkzf_city'))
    this.setState({
      locaCity: label,
    })
  }
  //接收获取房屋数据
  onFilter = (filters) => {
    window.scrollTo(0, 0)
    this.filters = filters
    this.searchHouseList()
  }
  //发起请求获取房屋数据
  searchHouseList() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))

    //找到数据后用Toast提示
    Toast.loading(
      'Loading...',
      0.5,
      async () => {
        const res = await API.get('houses', {
          params: {
            cityId: value,
            ...this.filters,
            start: 1,
            end: 20,
          },
        })
        const { list, count } = res.data.body

        this.setState({
          list,
          count,
        })
        if (count === 0) {
          Toast.fail('没有房源数据', 3, false)
          return
        }
        Toast.success(`获取到${count}条房屋数据`, 1, false)
      },
      false
    )
  }
  //渲染房屋列表
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
      />
    )
  }
  //判断每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  //用来获取更多房屋数据
  //该方法返回值是一个promise对象，并且这个对象应该在数据加载完调用resolve
  loadMoreRows = ({ startIndex, stopIndex }) => {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    return new Promise((resolve) => {
      API.get('/houses', {
        params: {
          cityId: value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list],
        })

        // 数据加载完成时，调用 resolve 即可
        resolve()
      })
    })
  }
  render() {
    return (
      <div className="houselist">
        {/* 顶部导航 */}

        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader
            cityName={this.state.locaCity}
            className={styles.searchHeader}
          />
        </Flex>

        {/* 条件筛选栏 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter}></Filter>
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                        width={width} // 视口的宽度
                        height={height} // 视口的高度
                        rowCount={this.state.count} // List列表项的行数
                        rowHeight={120} // 每一行的高度
                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }
}
