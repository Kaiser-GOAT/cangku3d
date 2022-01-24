import React from 'react'
import { Button, Form } from 'antd'
import 'antd/dist/antd.css'
import * as THREE from 'three'
import { useCallback, useEffect, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import pic from './image/pic.jpg'
import { Huojia } from './components/Huojia'
import { Rain } from './components/Rain'
import AddGoods from './components/AddGoods'
import ProForm from '@ant-design/pro-form'
const App: React.FC = () => {
  // const scene = new THREE.Scene()
  const scene = new THREE.Scene()
  const rain = Rain(scene)
  const renderer = new THREE.WebGLRenderer()
  const [position, setPosition] = useState<{ x: number; y: number }>()
  const [shelfVisible, setShelfVisible] = useState<boolean>(false)
  const [coordinateSwitch, setCoordinateSwitch] = useState<boolean>(false)
  const [coordinate, setCoordinate] = useState<{ x: number; z: number }>()

  const [information, setInformation] = useState<any>()

  const ref = useCallback((node) => {
    function init() {
      //初始化场景对象scene
      let a: any
      let objectNode: any = []
      const width = window.innerWidth
      const height = window.innerHeight
      const k = width / height
      let textureLoader = new THREE.TextureLoader()
      const camera = new THREE.PerspectiveCamera(45, k, 1, 10000)
      //创建相机
      camera.position.set(822, 759, 968) //设置相机位置
      camera.lookAt(scene.position) //设置相机方向
      renderer.setSize(width, height) //设置渲染区域大小
      renderer.setClearColor(0xb9d3f1, 1) //设置背景颜色
      renderer.shadowMap.enabled = true
      let huojia = Huojia(300, 200, 50, 4)
      scene.add(huojia)
      huojia.name = `1号货架`
        huojia.castShadow = true
      /* 创建货架**/

      // function createShelf(
      //   x: number,
      //   y: number,
      //   z: number,
      //   line: number,
      //   identifier: number
      // ) {
      //   let huojia = Huojia(x, y, z, line)
      //   huojia.name = `${identifier}号货架`
      //   huojia.castShadow = true
      //   let geometry = new THREE.BoxGeometry(x, y, z)
      //   let material = new THREE.MeshBasicMaterial({
      //     color: 0xfff,
      //     transparent: true,
      //     opacity: 0.1,
      //   })
      //   let outerMesh = new THREE.Mesh(geometry, material)
      //   outerMesh.position.x = huojia.position.x               
      //   outerMesh.position.y = huojia.position.y 
      //   outerMesh.position.z = huojia.position.z
      //   outerMesh.rotation.x = huojia.position.x
      //   outerMesh.rotation.y = huojia.position.y
      //   outerMesh.rotation.z = huojia.position.z
      //   outerMesh.name = `outer${identifier}`
      //   console.log(huojia)
      //   console.log(outerMesh)

      //   objectNode.push(outerMesh)
      //   scene.add(huojia, outerMesh)
      //   initDragControls(huojia)
      // }
      // createShelf(200, 100, 50, 4, 1)
      // function initDragControls(group: any) {
      //   // 添加平移控件
      //   // 初始化拖拽控件

      //   var dragControls = new DragControls(
      //     objectNode,
      //     camera,
      //     renderer.domElement
      //   )
      //   var transformControls = new TransformControls(
      //     camera,
      //     renderer.domElement
      //   )
      //   scene.add(transformControls)
      //   // 鼠标略过事件
      //   dragControls.addEventListener('hoveron', function (event) {
      //     // 让变换控件对象和选中的对象绑定
      //     transformControls.attach(event.object)
      //   })
      //   // 开始拖拽
      //   dragControls.addEventListener('dragstart', function (event) {
      //     controls.enabled = false
      //   })
      //   // 拖拽过程
      //   dragControls.addEventListener('drag', function (event) {
      //     var name = event.object.name // event.object即为外部模型，在这里可以通过外层模型的name属性找到内部模型
      //     var x = event.object.position.x
      //     var y = event.object.position.y
      //     var z = event.object.position.z
      //     group.position.set(x,y,z)
      //     // group.position.x = x // 给内部模型位置赋值
      //     // group.position.y = y
      //     // group.position.z = z
      //   })
      //   // 拖拽结束
      //   dragControls.addEventListener('dragend', function (event) {
      //     controls.enabled = true
      //   })
      // }
      let planeGeometry = new THREE.PlaneGeometry(2000, 2000)
      textureLoader.load(pic, function (texture: any) {
        let planeMaterial = new THREE.MeshLambertMaterial({
          map: texture,
        })
        let plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = -0.5 * Math.PI
        plane.position.set(0, 0, 0)
        plane.receiveShadow = true
        plane.name = '地板'
        scene.add(plane)
      })
      // huojia.add(WoodBox())
      //添加点光源
      let spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(-400, 400, -150)
      spotLight.castShadow = true
      spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
      spotLight.shadow.camera.far = 1300
      spotLight.shadow.camera.near = 400
      scene.add(spotLight)
      //辅助坐标系，参数250表示坐标系大小
      const axesHelper = new THREE.AxesHelper(1000)
      //添加环境光
      scene.add(axesHelper)
      let ambient = new THREE.AmbientLight(0x353535)
      scene.add(ambient)
      //创建渲染器对象
      scene.add(rain)

      node.appendChild(renderer.domElement)
      function render() {
        rain.children.forEach((sprite) => {
          sprite.position.y -= 1
          if (sprite.position.y < 0) {
            sprite.position.y = 500
          }
        })

        renderer.render(scene, camera)
        requestAnimationFrame(render)
      }
      a = requestAnimationFrame(render)
      render()
      let controls = new OrbitControls(camera, renderer.domElement)
      document.getElementsByTagName('canvas')[0].id = 'container'
      let SELECTED: any
      let record: any
      function getIntersects(event: any) {
        event.preventDefault()
        // 声明 raycaster 和 mouse 变量
        let raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2()
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
        raycaster.setFromCamera(mouse, camera)

        // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length > 0) {
          //获取第一个物体
          if (SELECTED !== intersects[0].object) {
            //鼠标的变换
            document.body.style.cursor = 'pointer'
            if (SELECTED) SELECTED.material.color.setHex(SELECTED.currentHex)
            SELECTED = intersects[0].object
            SELECTED.currentHex = SELECTED.material.color.getHex() //记录当前选择的颜色
            //改变物体的颜色(红色)
            if (/(货物)|(板子)/.test(SELECTED.name)) {
              if (record !== SELECTED) {
                record = SELECTED
              }
              setInformation(SELECTED)
              SELECTED.material.color.set(0x66ff00)
            } else {
              record = null
            }
          }
        } else {
          document.body.style.cursor = 'auto'
          if (SELECTED) SELECTED.material.color.set(SELECTED.currentHex) //恢复选择前的默认颜色
          SELECTED = null
        }
        //返回选中的对象
        return intersects
      }

      document.getElementById('container')?.addEventListener('click', (e) => {
        let lastRecord
        e.preventDefault()

        getIntersects(e)
        if (record !== lastRecord && record) {
          record = lastRecord
          setPosition({ x: e.clientX, y: e.clientY })
        } else {
          setPosition(undefined)
        }
      })
      renderer.domElement.addEventListener(
        'webglcontextlost',
        function (event) {
          event.preventDefault()
          cancelAnimationFrame(a)
          // animationID would have been set by your call to requestAnimationFrame
        },
        false
      )
      renderer.domElement.addEventListener(
        'webglcontextrestored',
        function (event) {
          event.preventDefault()
          setTimeout(() => {
            document.getElementsByTagName('canvas')[0].remove()
            renderer.forceContextRestore()
            renderer.setClearColor(0xb9d3f1, 1) //设置背景颜色

            node.appendChild(renderer.getContext().canvas)
          }, 0)
          // animationID would have been set by your call to requestAnimationFrame
        },
        false
      )
    }
    init()
  }, [])
  useEffect(() => {
    console.log('information :>> ', information)
  })
  useEffect(() => {
    console.log(coordinate)
  }, [coordinate])
  useEffect(() => {
    if (coordinateSwitch) {
    }
  }, [coordinateSwitch])

  return (
    <div style={{ position: 'relative' }} ref={ref} id="pos">
      <div style={{ position: 'absolute', margin: 10 }}>
        <Button
          onClick={() => {
            setShelfVisible(true)
          }}
          type="primary"
        >
          新增货架
        </Button>
        <div
          style={{
            width: 200,
            height: 250,
            marginTop: 10,
            backgroundColor: '#fff',
            border: '1px solid #1890ff',
            display: shelfVisible ? 'block' : 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: 5,
            }}
          >
            <ProForm<{
              name: string
              coordinate: { x: number; y: number; z: number }
            }>
              style={{ width: '100%' }}
              onFinish={async (values) => {
                console.log(values)
              }}
            >
              <Form.Item name={'coordinate'}>
                <Button
                  onClick={() => {
                    setCoordinateSwitch(true)
                  }}
                >
                  获取坐标
                </Button>
              </Form.Item>
            </ProForm>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginBottom: 5,
                width: '70%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Button type="primary">确认</Button>
              <Button
                onClick={() => {
                  setShelfVisible(false)
                }}
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: position ? 'block' : 'none' }}>
        <div
          style={{
            width: 125,
            height: 125,
            background: '#fff',
            position: 'absolute',
            transform: `translate(${position?.x}px,${position?.y}px)`,
            margin: 5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            信息
          </div>
          <div
            style={{
              display: 'flex',
              height: '80%',
              flexDirection: 'column',
              lineHeight: 2,
              marginLeft: 5,
            }}
          >
            <div>名称：{information?.name}</div>
            <div>所属：{information?.parent.name}</div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/板子/.test(information?.name) ? (
                <AddGoods info={information} />
              ) : (
                <Button
                  onClick={() => {
                    const newInformation =
                      information.parent.remove(information)
                    setInformation(newInformation)
                  }}
                >
                  删除货物
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
