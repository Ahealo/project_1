import React, { Component } from 'react'

import styles from './index.module.css'
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' },
]
export default class FilterTitle extends Component {
  state = {}
  componentDidMount() {}
  render() {
    return (
      <div className={styles.root}>
        {titleList.map((item) => {
          const isSelected = this.props.titleSelectedStatus[item.type]
          const { onClick } = this.props
          return (
            <div
              className={[
                styles.titleList,
                isSelected ? styles.selected : '',
              ].join(' ')}
              key={item.type}
              onClick={() => onClick(item.type)}
            >
              <div className={styles.text}>
                <span> {item.title}</span>
                <i className="iconfont icon-arrow" />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
