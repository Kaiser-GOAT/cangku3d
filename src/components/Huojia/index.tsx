import * as THREE from 'three'

const ganzi1Creater = (y: number)=>{
	let ganzi1Geometry = new THREE.BoxGeometry(4,y,2)
	let ganzi1Material = new THREE.MeshLambertMaterial({
		color:'#03368c'
	})
	let ganzi1Mesh = new THREE.Mesh(ganzi1Geometry,ganzi1Material)
	ganzi1Mesh.position.setY(y/2)
	return ganzi1Mesh
}
const banziCreater = (x: number,z: number)=>{
	let banziGeometry = new THREE.BoxGeometry(x,2,z)
	let banziMaterial = new THREE.MeshLambertMaterial({
		color:'#03368c'
	})
	let banziMesh = new THREE.Mesh(banziGeometry,banziMaterial)
	
	return banziMesh
	// let banzi = new THREE.Mesh(banziGeometry,banziMaterial)
	
}
export const TiePiHuoJia = (x: number,y: number,z: number,line: number)=>{
	const huojiaGroup = new THREE.Group()
	huojiaGroup.name = '货架'
	huojiaGroup.castShadow = true	

	let ganzi1No1 = ganzi1Creater(y)
	ganzi1No1.name = '细杆子1号'
	let ganzi1No2 = ganzi1Creater(y)
	ganzi1No2.name = '细杆子2号'
	ganzi1No2.translateX(x)
	let ganzi1No3 =ganzi1Creater(y)
	ganzi1No3.name = '细杆子3号'
	ganzi1No3.translateZ(z)
	let ganzi1No4 = ganzi1Creater(y)
	ganzi1No4.name = '细杆子4号'
	ganzi1No4.translateX(x)
	ganzi1No4.translateZ(z)	

	const banzi = [ganzi1No1,ganzi1No2,ganzi1No3,ganzi1No4]
	let space =( y- (2*line))/(line)
	let initialHeight = y
	for (let index = 0; index <line; index++) {
		let mesh = banziCreater(x,z)
		mesh.name = `${index}号板子`
		let afterHeight = initialHeight - space
		mesh.position.set(x/2,afterHeight,z/2)
		initialHeight = afterHeight		
		banzi.push( mesh)
	}

	huojiaGroup.add(...banzi,ganzi1No1,ganzi1No2,ganzi1No3,ganzi1No4)
	
	return huojiaGroup
} 
