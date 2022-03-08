import React from 'react'
import { Button, Input, InputNumber, Popconfirm, Space } from 'antd'
import 'antd/dist/antd.css'
import * as THREE from 'three'
import { useCallback, useEffect, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import taoci from './image/taoci.png'
import { TiePiHuoJia, CabinetDoorShelf } from './components/Huojia'
import { Rain } from './components/Rain'
import AddGoods from './components/AddGoods'
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form'
import AddPlane from './components/AddPlane'
import DeletePlane from './components/DeletePlane'
import Handset from './components/Handset'

const App: React.FC = () => {
  // const scene = new THREE.Scene()
  const [scene, setScene] = useState(new THREE.Scene())
  const rain = Rain(scene)
  const renderer = new THREE.WebGLRenderer()
  const [position, setPosition] = useState<{ x: number; y: number }>()
  const [information, setInformation] = useState<any>()
  const [shelfInformation, setShelfInformation] = useState<any>()
  const [rotateValue, setRotateValue] = useState<number>(0)
  const [addPlaneVisible, setAddPlaneVisible] = useState<boolean>(false)
  let n = 1
  let m = 10
  useEffect(() => {
    if (information) {
      if (
        /货架/.test(
          information.parent.name || /货架/.test(information.parent.parent.name)
        )
      ) {
        setShelfInformation(information.parent)
      }
    } else {
      setShelfInformation(undefined)
    }
  }, [information])

  const ref = useCallback((node) => {
    function init() {
      //初始化场景对象scene
      let a: any
      const width = window.innerWidth
      const height = window.innerHeight
      const k = width / height
      let textureLoader = new THREE.TextureLoader()
      const camera = new THREE.PerspectiveCamera(45, k, 1, 10000)
      let huojia = TiePiHuoJia(300, 200, 50, 4)
      scene.add(huojia)
      huojia.name = `1号货架`
      huojia.castShadow = true
      // let huojia2 = CabinetDoorShelf(500, 300, 70, 4)
      // huojia2.name = `2号货架`
      // scene.add(huojia2)
      //创建相机
      camera.position.set(1200, 1200, 1200) //设置相机位置
      camera.lookAt(new THREE.Vector3(-1000, 50, 80)) //设置相机方向
      renderer.setSize(width, height) //设置渲染区域大小
      renderer.setClearColor('#222222', 1) //设置背景颜色
      renderer.shadowMap.enabled = true

      let planeGeometry = new THREE.PlaneGeometry(2000, 2000)
      textureLoader.load(taoci, function (texture: any) {
        // texture.wrapS = THREE.RepeatWrapping
        // texture.wrapT = THREE.RepeatWrapping
        // texture.repeat.set(5, 5)
        let planeMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          // color:0x66ff00,
          // color:'#c8d2d7',
          side: THREE.DoubleSide,
        })
        let plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = -0.5 * Math.PI
        plane.position.set(0, 0, 0)
        plane.receiveShadow = true
        plane.name = '初始plane'
        scene.add(plane)
      })
      //添加点光源
      let spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(800, 800, 350)
      spotLight.castShadow = true
      spotLight.shadow.mapSize = new THREE.Vector2(1000, 1000)
      spotLight.shadow.camera.far = 1900
      spotLight.shadow.camera.near = 400
      scene.add(spotLight)
      //辅助坐标系，参数250表示坐标系大小
      // const axesHelper = new THREE.AxesHelper(1000)
      // scene.add(axesHelper)
      //添加环境光
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
      let PLANE: any
      let DOOR: any
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
          console.log(intersects)
          if (SELECTED !== intersects[0].object) {
            //鼠标的变换
            document.body.style.cursor = 'pointer'
            if (SELECTED) SELECTED.material.color.setHex(SELECTED.currentHex)
            SELECTED = intersects[0].object
            SELECTED.currentHex = SELECTED.material.color.getHex() //记录当前选择的颜色
            //改变物体的颜色(红色)
            for (let index = 0; index < intersects.length; index++) {
              if (/地板/.test(intersects[index].object.name)) {
                PLANE = intersects[index].object
              }
            }
            if (/门/.test(SELECTED.parent.name)) {
              DOOR = SELECTED.parent
            }
            if (/(货物)|(板子)/.test(SELECTED.name)) {
              if (record !== SELECTED) {
                record = SELECTED
              }
              setInformation(SELECTED)
              SELECTED.material.color.set(0x66ff00)
            } else {
              record = null
              setInformation(undefined)
            }
          }
        } else {
          document.body.style.cursor = 'auto'
          if (SELECTED) SELECTED.material.color.set(SELECTED.currentHex) //恢复选择前的默认颜色
          SELECTED = null
          PLANE = null
          DOOR = null
        }
        console.log(DOOR)
        function doorOpenRender() {
          if (DOOR) {
            renderer.render(scene, camera)
            if (/左门/.test(DOOR.name)) {
              if (DOOR.rotation._y < 1.3) {
                DOOR.rotateY(0.1)
              } else if (DOOR.rotation._y >= 1.3) {
                DOOR.rotateY(-0.1)
              }
              if (DOOR.rotation._y === 1.3) {
                cancelAnimationFrame(0.1)
              }
            }
            if (/右门/.test(DOOR.name)) {
              if (DOOR.rotation._y > -1.3) {
                DOOR.rotation._y -= 0.1
              } else if (DOOR.rotation._y <= -1.3) {
                DOOR.rotation._y += 0.1
              }
            }
            requestAnimationFrame(doorOpenRender)
          }
        }
        document.addEventListener('click', function (e) {
          doorOpenRender()
        })
        document.addEventListener('keydown', function (e) {
          if (/货架/.test(SELECTED?.parent.name)) {
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
          if (/地板/.test(PLANE?.name)) {
            switch (e.key) {
              case 'ArrowRight':
                PLANE.position.x += m
                break
              case 'ArrowLeft':
                PLANE.position.x -= m
                break
              case 'ArrowUp':
                PLANE.position.z -= m
                break
              case 'ArrowDown':
                PLANE.position.z += m
                break
              default:
                break
            }
          }
        })

        //返回选中的对象
        return intersects
      }
      let rowArray = document.getElementsByClassName('row')
      rowArray[0].addEventListener('click', function (e) {
        if (/货架/.test(SELECTED?.parent.name)) {
          SELECTED.parent.position.z += n
        }
        if (/地板/.test(PLANE?.name)) {
          PLANE.position.z += m
        }
      })
      rowArray[1].addEventListener('click', function (e) {
        if (/货架/.test(SELECTED?.parent.name)) {
          SELECTED.parent.position.z -= n
        }
        if (/地板/.test(PLANE?.name)) {
          PLANE.position.z -= m
        }
      })
      rowArray[2].addEventListener('click', function (e) {
        if (/货架/.test(SELECTED?.parent.name)) {
          SELECTED.parent.position.x -= n
        }
        if (/地板/.test(PLANE?.name)) {
          PLANE.position.x -= m
        }
      })
      rowArray[3].addEventListener('click', function (e) {
        if (/货架/.test(SELECTED?.parent.name)) {
          SELECTED.parent.position.x += n
        }
        if (/地板/.test(PLANE?.name)) {
          PLANE.position.x += m
        }
      })

      // document
      //   .getElementById('container')
      //   ?.addEventListener('mousedown', function (e) {
      //     if (SELECTED && /板子/.test(SELECTED.name)) {
      //       document.onmousemove = onMouseMove
      //       controls.enabled = false
      //     }
      //   })
      // document
      //   .getElementById('container')
      //   ?.addEventListener('mouseup', function (e) {
      //     document.onmousemove = null
      //     controls.enabled = true
      //   })
      document.getElementById('container')?.addEventListener('click', (e) => {
        e.preventDefault()
        getIntersects(e)
        let lastRecord
        if (record && /板子/.test(record.name)) {
          // controls.target = record.position
          camera.fov = 10
        } else if (!record) {
          camera.fov = 45
          controls.target = new THREE.Vector3(0, 0, 0)
        }
        controls.update()
        camera.updateProjectionMatrix()
        if (record !== lastRecord && record) {
          record = lastRecord

          setPosition({ x: e.clientX, y: e.clientY })
        } else {
          setPosition(undefined)
        }
      })
      /**
       * 监听了webgl的上下文丢失事件 并做了处理；这段代码不要更改
       */
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
            renderer.setClearColor('#222222', 1) //设置背景颜色
            node.appendChild(renderer.getContext().canvas)
          }, 0)
          // animationID would have been set by your call to requestAnimationFrame
        },
        false
      )
    }
    init()
  }, [])

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
          <Button style={{ position: 'absolute', margin: 10 }} type="primary">
            新增货架
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          let huojia = TiePiHuoJia(values.x, values.y, values.z, values.line)
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
      <div
        style={{
          position: 'absolute',
          margin: 10,
          transform: `translateY(${60}px)`,
          display: 'flex',
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setAddPlaneVisible(!addPlaneVisible)
          }}
        >
          新增地板
        </Button>
        <div style={{ marginLeft: 10, transform: `translateY(${-60}px)` }}>
          <AddPlane visible={addPlaneVisible} scene={scene} />
        </div>
      </div>
      <DeletePlane scene={scene} />
      <div
        style={{ display: position ? 'block' : 'none', position: 'absolute' }}
      >
        <div
          style={{
            width: 125,
            height: 125,
            background: '#fff',
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
      <div
        style={{
          position: 'absolute',
          color: '#fff',
          right: 0,
          display: shelfInformation ? 'block' : 'none',
        }}
      >
        <div
          style={{
            width: 250,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#091221',
            border: '2px solid #fff',
            margin: 10,
            lineHeight: 2,
          }}
        >
          <h1 style={{ width: '100%', textAlign: 'center', color: '#fff' }}>
            货架信息
          </h1>
          <div>货架名：{shelfInformation?.name}</div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>长度：{shelfInformation?.userData.matrix.x}</span>
            <span>宽度：{shelfInformation?.userData.matrix.z}</span>
            <span>高度：{shelfInformation?.userData.matrix.y}</span>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              whiteSpace: 'nowrap',
              alignItems: 'center',
            }}
          >
            <div>旋转：</div>
            <Space>
              <InputNumber value={rotateValue} onChange={setRotateValue} />
              <Button
                type="primary"
                onClick={() => {
                  if (shelfInformation) {
                    shelfInformation.rotateY(rotateValue / 100)
                  }
                }}
              >
                确认
              </Button>
            </Space>
          </div>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Popconfirm
              title="确认删除吗"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {
                const newScene = scene.remove(shelfInformation)
                setScene(newScene)
              }}
            >
              <Button type="primary">删除货架</Button>
            </Popconfirm>
          </div>
        </div>
      </div>
      <Handset />
    </div>
  )
}

export default App
