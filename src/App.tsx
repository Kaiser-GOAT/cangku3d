import React from 'react'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import * as THREE from 'three'
import { useCallback, useEffect, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import pic from './image/pic.jpg'
import { Huojia } from './components/Huojia'
import { Rain } from './components/Rain'
import AddGoods from './components/AddGoods'
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form'
const App: React.FC = () => {
  // const scene = new THREE.Scene()
  const [scene, setScene] = useState(new THREE.Scene())
  const rain = Rain(scene)
  const renderer = new THREE.WebGLRenderer()
  const [position, setPosition] = useState<{ x: number; y: number }>()
  const [information, setInformation] = useState<any>()
  const ref = useCallback((node) => {
    function init() {
      //初始化场景对象scene
      let a: any
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
      function onMouseMove(e: MouseEvent) {
        e.preventDefault()
        let vector = new THREE.Vector3()
        vector.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1,
          0.5
        )
        // vector.unproject( camera );
        let raycaster1 = new THREE.Raycaster()
        raycaster1.setFromCamera(vector, camera)

        let intersects1 = raycaster1.intersectObjects(scene.children)

        if (intersects1.length > 0) {
          let selected = intersects1[0] //取第一个物体
          setTimeout(() => {
            SELECTED.parent.position.x = selected.point.x
            SELECTED.parent.position.z = selected.point.z
          }, 100)

        }
      }
      function getIntersects(event: any) {
        event.preventDefault()
        // 声明 raycaster 和 mouse 变量
        let raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2()
        let vector = new THREE.Vector3()
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
        raycaster.setFromCamera(mouse, camera)
        vector.set(mouse.x, mouse.y, 0.5)
        vector.unproject(camera)

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
        document.addEventListener('keydown', function (e) {
          let n = 2
          if (/货架/.test(SELECTED.parent.name)) {
            switch (e.key) {
              case 'ArrowRight':
                SELECTED.parent.position.x += n
                break
              case 'ArrowLeft':
                SELECTED.parent.position.x -= n
                break
              case 'ArrowUp':
                SELECTED.parent.position.z -= n
                break
              case 'ArrowDown':
                SELECTED.parent.position.z += n
                break
              default:
                break
            }
          }
        })
        //返回选中的对象
        return intersects
      }

      document
        .getElementById('container')
        ?.addEventListener('mousedown', function (e) {
          if (SELECTED && /板子/.test(SELECTED.name)) {
            document.onmousemove = onMouseMove
            controls.enabled = false
          }
        })
      document
        .getElementById('container')
        ?.addEventListener('mouseup', function (e) {
          document.onmousemove = null
          controls.enabled = true
        })

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

  return (
    <div style={{ position: 'relative' }} ref={ref} id="pos">
      <ModalForm<{
        x: number
        y: number
        z: number
        line: number
        shelfName: number | string
      }>
        title="新建货架"
        trigger={
          <Button
            style={{ position: 'absolute', margin: 10 }}
            type="primary"
          >
            新增货架
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          let huojia = Huojia(values.x, values.y, values.z, values.line)
          huojia.name = `${values.shelfName}货架`
          setScene(scene.add(huojia))
          return true
        }}
      >
        <ProFormText
          width="md"
          name="shelfName"
          label={'货架编号'}
          tooltip="唯一标识符,货架名不可重复"
          placeholder={'唯一标识符,货架名不可重复'}
        />
        <ProForm.Group>
          <ProFormText width={'xs'} name="x" label={'长度'} />
          <ProFormText width={'xs'} name="y" label={'高度'} />
          <ProFormText width={'xs'} name="z" label={'宽度'} />
          <ProFormText width={'xs'} name="line" label={'层级'} />
        </ProForm.Group>
      </ModalForm>

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
