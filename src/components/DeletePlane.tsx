import { ModalForm } from '@ant-design/pro-form'
import { Button, Checkbox, Col, Form, Row } from 'antd'
import {  useState } from 'react'

const DeletePlane: React.FC<{ scene: any }> = ({ scene }) => {
  const [planeArray, setPlaneArray] = useState<any[]>([])
  return (
    <ModalForm
      title="删除地板"
      trigger={
        <Button
          type="primary"
          style={{
            position: 'absolute',
            margin: 10,
            transform: `translateY(${120}px)`,
          }}
		  onClick={()=>{
			setPlaneArray(
				scene.children.filter((item: any) =>{return  /地板/.test(item.name)})
			  )
		  }}
        >
          删除地板
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
	  onFinish={async(values)=>{
		  if (values.plane) {
			 for (let index = 0; index < values.plane.length; index++) {
				const item = values.plane[index]
				 for (let j = 0; j < planeArray.length; j++) {
					 const item1 = planeArray[j];
					 if(item === item1.uuid){
						 scene.remove(item1)
					 }
				 }
			 }
		  }
		  return true
	  }}
    >
		<Form.Item name="plane">
		<Checkbox.Group  style={{width:'100%'}}>
		  <Row>
			  {planeArray.map((item,index)=>{
				  return(
					  <Col
					  key={index} 
					  span={6}
					  >
						  <Checkbox value={item.uuid}>
							  {item.name}
						  </Checkbox>
					  </Col>
				  )
			  })}
		  </Row>
	  </Checkbox.Group>
		</Form.Item>
     
    </ModalForm>
  )
}

export default DeletePlane
