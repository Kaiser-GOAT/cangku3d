import { useState } from 'react'
import * as THREE from 'three'
import taoci from '../image/taoci.png'
import shuini from '../image/shuini.png'
import { Button, Form, Input, InputNumber, Select, Switch } from 'antd'

type plane = {
  length: number
  width: number
  texture: any
  isRepeat: boolean
  textureRepeat: number
  planeName:string;
}
const AddPlane: React.FC<{ visible: boolean; scene: any }> = ({
  visible,
  scene,
}) => {
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const textureImage = [
    { name: '陶瓷', value: taoci },
    { name: '水泥', value: shuini },
  ]
  const textureLoader = new THREE.TextureLoader()

  function getPlane(values: plane) {
    const planeGeometry = new THREE.PlaneGeometry(values.width, values.length)
    const textureImage = textureLoader.load(values.texture)
    textureImage.wrapS = THREE.RepeatWrapping
    textureImage.wrapT = THREE.RepeatWrapping
    if (values.isRepeat) {
      if (values.textureRepeat) {
        textureImage.repeat.set(values.textureRepeat, values.textureRepeat)
      }
    }
    const planeMaterial = new THREE.MeshLambertMaterial({
      map: textureImage,
      side: THREE.DoubleSide,
    })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, 0, 0)
    plane.receiveShadow = true
    plane.name = `${values.planeName}号地板`
    return plane
  }
  return (
    <div style={{ width: 300, display: visible ? 'block' : 'none' }}>
      <div
        style={{
          width: '100%',
          backgroundColor: '#091221',
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          border: '2px solid #fff',
        }}
      > 
        <h1 style={{ width: '100%', textAlign: 'center', color: '#fff' }}>
          创建地板
        </h1>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => {
            console.log(values)
            const plane = getPlane(values)
            scene.add(plane)
          }}
          name="basic"
        >
          <Form.Item
            label={<div style={{ color: '#fff' }}>编号</div>}
            name="planeName"
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={<div style={{ color: '#fff' }}>长度</div>}
            name="length"
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label={<div style={{ color: '#fff' }}>宽度</div>}
            name="width"
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label={<div style={{ color: '#fff' }}>贴图</div>}
            name="texture"
          >
            <Select>
              {textureImage.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.value}>
                    <img src={item.value} alt="" width={30} height={30}></img>
                    <span style={{ marginLeft: 10 }}>{item.name}</span>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <div style={{ color: '#fff', marginRight: 10 }}>
                是否开启阵列贴图
              </div>
            }
            name="isRepeat"
            labelCol={{ span: 12 }}
          >
            <Switch
              style={{ marginLeft: 45 }}
              onChange={setIsRepeat}
              checked={isRepeat}
            />
          </Form.Item>
          <Form.Item
            label={
              <div style={{ color: '#fff', marginRight: 9 }}>贴图数量</div>
            }
            name="textureRepeat"
            labelCol={{ span: 7 }}
            style={{ display: isRepeat ? '' : 'none' }}
          >
            <InputNumber style={{ marginLeft: -10 }} min={0} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">生成地板</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default AddPlane
