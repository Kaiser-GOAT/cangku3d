import { Button, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { WoodBox } from './Goods'
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form'

const AddGoods: React.FC<{ info: any }> = ({ info }) => {
  const [goodsHash, setGoodsHash] = useState<number[]>([])
  useEffect(() => {
    if (info) {
      let width = info.geometry.parameters.width
      const hash = []
      // let n = Math.floor((width + 20) / 30 + 20);
      // let space = (width - n * 30) / (n-1) -20
      // let initialPosition =  - width/2 +15
      let n = Math.floor(width / (30 + 20))
      let space = (width - n * 30) / n - 20
      let initialPosition = -width / 2 + 15 + 10 + space / 2
      for (let index = 0; index < n; index++) {
        let position = initialPosition + (30 + 20 + space) * index
        hash.push(position)
      }
      setGoodsHash(hash)
    }
  }, [info])

  return (
    <>
      <ModalForm<{
        position: number
      }>
        title="新增货物"
        trigger={<Button type="primary">新增货物</Button>}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onFinish={async (values) => {
          let bool = true
          let box = WoodBox()
          let positionValue = values?.position
          let children = info.children.map((u: any) => u.position.x)
          for (let index = 0; index < children.length; index++) {
            if (positionValue === children[index]) {
              bool = false
            }
          }
          if (bool) {
            box.position.set(positionValue, 15, 0)
            info.add(box)
          }else{
            message.error('此格已被占用')
          }
          return bool
        }}
      >
        <div>总格位：{goodsHash?.length}</div>
        <ProFormSelect
          options={
            goodsHash &&
            goodsHash.map((u, index) => {
              return { value: u, label: `第${index + 1}格` }
            })
          }
          name="position"
          label="位置"
          width="md"
        />
      </ModalForm>
    </>
  )
}

export default AddGoods
