// dom.getBoundingClientRect() 获取元素的大小及其相对于视口的位置。

/* 
  条件筛选栏吸顶功能实现步骤：

  1 封装 Sticky 组件，实现吸顶功能。
  2 在 HouseList 页面中，导入 Sticky 组件。
  3 使用 Sticky 组件包裹要实现吸顶功能的 Filter 组件。

  4 在 Sticky 组件中，创建两个 ref 对象（placeholder、content），分别指向占位元素和内容元素。
  5 组件中，监听浏览器的 scroll 事件（注意销毁事件）。
  6 在 scroll 事件中，通过 getBoundingClientRect() 方法得到筛选栏占位元素当前位置（top）。
  7 判断 top 是否小于 0（是否在可视区内）。
  8 如果小于，就添加需要吸顶样式（fixed），同时设置占位元素高度（与条件筛选栏高度相同）。
  9 否则，就移除吸顶样式，同时让占位元素高度为 0。
*/

import React, { createRef } from 'react'
import styles from './index.module.css'
import PropsTypes from 'prop-types'
class Sticky extends React.Component {
  componentDidMount() {
    //在组件创建时监听滚动事件并添加handleScroll方法
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    //在组件销毁时移除该监听事件
    window.removeEventListener('scroll', this.handleScroll)
  }

  //创建实例对象
  placeholder = createRef()
  content = createRef()

  //滚动页面调用方法
  handleScroll = () => {
    const { height } = this.props
    // 获取dom对象
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current
    //获取标题栏组件离页面的高度
    const { top } = placeholderEl.getBoundingClientRect()
    //  console.log(top);
    if (top < 0) {
      // 吸顶
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = `${height}px`
    } else {
      // 取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}
Sticky.propsTypes = {
  height: PropsTypes.number.isRequired,
}
export default Sticky
