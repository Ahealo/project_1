import PropTypes from 'prop-types'

import styles from './index.module.css'

const FilterFooter = ({
  cancelText = '清除',
  confirmText = '确定',
  onCancel,
  onConfirm,
}) => {
  return (
    <div className={styles.root}>
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>
      <span
        className={[styles.btn, styles.confirm].join(' ')}
        onClick={onConfirm}
      >
        {confirmText}
      </span>
    </div>
  )
}

FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  className: PropTypes.string,
}

export default FilterFooter
