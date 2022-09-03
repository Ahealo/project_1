import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter/index.js'

export default class FilterPicker extends Component {
  state = {
    //滚动菜单当前的值
    value: this.props.defaultValue,
  }
  render() {
    const { data, onCancel, onSave, cols, type } = this.props
    const { value } = this.state
    // console.log(value)
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          // value为当前下拉菜单的值
          value={value}
          cols={cols}
          onChange={(val) => {
            this.setState({
              value: val,
            })
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter
          cancelText="取消"
          onCancel={() => {
            onCancel(type)
          }}
          onConfirm={() => {
            onSave(type, value)
          }}
        />
      </>
    )
  }
}
