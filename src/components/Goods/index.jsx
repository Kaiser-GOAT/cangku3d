import WoodImage from '../../image/wood.jpg'
import * as THREE from 'three'

export const WoodBox = ()=>{
	const woodGeoMetry = new THREE.BoxBufferGeometry(30,30,30)
	const loader = new THREE.TextureLoader()
	const imageTexture = loader.load(WoodImage)
	const woodMaterial = new THREE.MeshLambertMaterial({
		map:imageTexture
		// color:'#03368c'
	})
	const woodMesh = new THREE.Mesh(woodGeoMetry,woodMaterial)
	woodMesh.name = '货物-木箱'
	return woodMesh
}