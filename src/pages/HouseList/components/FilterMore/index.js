import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter/index.js'

import styles from './index.module.css'
import { Spring } from 'react-spring/renderprops'

export default class FilterMore extends Component {
  state = {
    //存放选中标签的value
    selectedValues: this.props.defaultValue,
  }
  // 点击标签的方法
  onTagClick(value) {
    const { selectedValues } = this.state
    // 创建新数组
    const newSelectedValues = [...selectedValues]

    if (newSelectedValues.indexOf(value) <= -1) {
      // 没有当前项的值,往新数组中添加
      newSelectedValues.push(value)
    } else {
      // 有，在新数组中删除该值,index为当前项的索引
      const index = newSelectedValues.findIndex((item) => item === value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues,
    })
  }
  //点击清除内容
  onClear = () => {
    this.setState({
      selectedValues: [],
    })
  }
  //点击确定方法
  onOK = () => {
    const { onSave, type } = this.props
    const { selectedValues } = this.state
    onSave(type, selectedValues)
  }
  // 渲染标签方法
  renderFilters(array) {
    const { selectedValues } = this.state
    return array.map((item) => {
      //如果selectedValues中有该项的value值则isSelected为true
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          key={item.value}
          onClick={() => {
            this.onTagClick(item.value)
          }}
        >
          {item.label}
        </span>
      )
    })
    // <span className={[styles.tag, styles.tagActive].join(' ')}>东北</span>
  }
  renderMask() {
    const { onCancel, type } = this.props

    const isOpen = type === 'more'
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
              className={styles.mask}
              onClick={() => {
                onCancel(type)
              }}
            />
          )
        }}
      </Spring>
    )
  }
  render() {
    const { data } = this.props
    const { roomType, oriented, floor, characteristic } = data
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {this.renderMask()}

        <div className={styles.tags}>
          {/* 条件内容 */}
          <div className={styles.content}>
            <dl className={styles.dl}>
              <dt className={styles.dt}>户型</dt>
              <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

              <dt className={styles.dt}>朝向</dt>
              <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

              <dt className={styles.dt}>楼层</dt>
              <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

              <dt className={styles.dt}>房屋亮点</dt>
              <dd className={styles.dd}>
                {this.renderFilters(characteristic)}
              </dd>
            </dl>
          </div>
          {/* 底部按钮 */}
          <div className={styles.footer}>
            <FilterFooter
              cancelText="清除"
              onCancel={this.onClear}
              onConfirm={this.onOK}
            />
          </div>
        </div>
      </div>
    )
  }
}
