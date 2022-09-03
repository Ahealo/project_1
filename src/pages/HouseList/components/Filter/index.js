import React, { Component } from 'react'

import FilterTitle from '../FilterTitle/index.js'
import FilterPicker from '../Filter.Picker/index.js'
import FilterMore from '../FilterMore/index.js'

import styles from './index.module.css'
import { API } from '../../../../utils/api.js'

import { Spring } from 'react-spring/renderprops'
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: [],
}

export default class Filter extends Component {
  state = {
    //控制Filter高亮效果
    titleSelectedStatus,
    //控制下拉菜单,遮罩层，右侧更多等组件显示
    openType: '',
    //下拉菜单信息
    filtersData: {},
    //下拉菜单选中的值
    selectedValues,
  }
  componentDidMount() {
    //获取body
    this.htmlBody = document.body
    this.getFiltersData()
  }
  //标题点击方法
  onTitleClick = (type) => {
    // 给页面设置overflow:hidden,防止点击按钮时页面还能滚动
    this.htmlBody.className = 'body-fixed'
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象
    // Object.keys() => ['area', 'mode', 'price', 'more']
    Object.keys(titleSelectedStatus).forEach((key) => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值。
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true

        return
      }

      // 其他标题：
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }
  //隐藏组件方法
  onCancel = (type) => {
    this.htmlBody.className = ''
    // console.log('cancel:', type)
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type]
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 隐藏对话框
    this.setState({
      openType: '',

      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }
  //点击确定按钮方法
  onSave = (type, value) => {
    this.htmlBody.className = ''
    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = value
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前 type 对应的选中值
      [type]: value,
    }
    const { area, mode, price, more } = newSelectedValues

    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多筛选条件 more
    filters.more = more.join(',')

    // console.log(filters)
    this.props.onFilter(filters)

    // 隐藏对话框
    this.setState({
      openType: '',

      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,

      selectedValues: newSelectedValues,
    })
    console.log(this.state.selectedValues)
  }
  //封装获取下拉菜单条件的方法
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { data } = await API.get(`/houses/condition?id=${value}`)

    this.setState({
      filtersData: data.body,
    })
  }
  //渲染FilterPicker组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
    } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      let data = []
      let cols = ''
      // 根据渲染的哪一项拿到对应的默认值
      let defaultValue = this.state.selectedValues[openType]

      //将下拉菜单所需数据赋值给data,将下拉菜单列数赋值给cols
      switch (openType) {
        case 'area':
          data = [area, subway]
          cols = 3
          break
        case 'mode':
          data = rentType
          cols = 1
          break
        case 'price':
          data = price
          cols = 1
          break
        default:
          break
      }

      return (
        <FilterPicker
          //添加key值，当点击不同顶部标题时,由于key不同，react会销毁旧的生成新的
          //解决了FilterOicker渲染时没被销毁的问题
          key={openType}
          onCancel={this.onCancel}
          onSave={this.onSave}
          data={data}
          cols={cols}
          type={openType}
          defaultValue={defaultValue}
        />
      )
    }
    return null
  }
  //渲染Filtermore组件的方法
  renderFiltermore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues,
    } = this.state
    if (openType === 'more') {
      const data = { roomType, oriented, floor, characteristic }
      const defaultValue = selectedValues.more
      return (
        <FilterMore
          onCancel={this.onCancel}
          data={data}
          type={openType}
          onSave={this.onSave}
          defaultValue={defaultValue}
        />
      )
    }
  }
  //渲染遮罩层
  renderMask() {
    const { openType } = this.state
    const isOpen =
      openType === 'area' || openType === 'mode' || openType === 'price'
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isOpen ? 1 : 0 }}>
        {(props) => {
          // props => { opacity: 0 } 是从 0 到 1 的中间值
          // console.log(props.opacity)
          if (props.opacity === 0) {
            return null
          }
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          )
        }}
      </Spring>
    )
  }
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}

        {this.renderMask()}

        <div className={styles.content}>
          {/* 顶部标题 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />
          {/* 下拉菜单 */}
          {this.renderFilterPicker()}
          {/* 右侧更多 */}
          {this.renderFiltermore()}
        </div>
      </div>
    )
  }
}
