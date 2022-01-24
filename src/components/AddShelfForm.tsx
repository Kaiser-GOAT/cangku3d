import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'antd'
import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form'
import * as THREE from 'three'


type Props  = {
	scene: any;
	camera: any
}
const AddShelfForm: React.FC<Props> = ({scene,camera}) => {
	const [coordinateSwitch,setCoordinateSwitch] = useState<boolean>(false)
	const getIntersects = useCallback((event: any)=>{
		event.preventDefault()
		let raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2()
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(mouse, camera)
		console.log(raycaster.intersectObjects(scene.children));
		
		return raycaster.intersectObjects(scene.children)
		
	},[camera,scene])

  return (
    <ProForm<{
      name: string
      coordinate: { x: number; y: number; z: number }
    }>
	style={{width:'100%'}}
	 onFinish={async (values) => {     
        console.log(values);
      }}
	>
		<Form.Item name={'coordinate'}>
	  		<Button onClick={()=>{
				 document.body.style.cursor = 'crosshair'
				 setCoordinateSwitch(true)
			  }}>获取坐标</Button>
		</Form.Item>
	</ProForm>
  )
}

export default AddShelfForm
