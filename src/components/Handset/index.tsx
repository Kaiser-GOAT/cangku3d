import './index.css'
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons'
import classnames from 'classnames'

const Handset: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="handset">
        <DownOutlined className={classnames(['down', 'row'])} />
        <UpOutlined className={classnames(['up', 'row'])} />
        <LeftOutlined className={classnames(['left', 'row'])} />
        <RightOutlined className={classnames(['right', 'row'])} />
        <div className="circle"></div>
      </div>
    </div>
  )
}

export default Handset
