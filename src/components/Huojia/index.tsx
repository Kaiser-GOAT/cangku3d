import * as THREE from 'three'

export const TiePiHuoJia = (x: number, y: number, z: number, line: number) => {
  const ganzi1Creater = (y: number) => {
    let ganzi1Geometry = new THREE.BoxGeometry(4, y, 2)
    let ganzi1Material = new THREE.MeshLambertMaterial({
      color: '#03368c',
    })
    let ganzi1Mesh = new THREE.Mesh(ganzi1Geometry, ganzi1Material)
    ganzi1Mesh.position.setY(y / 2)
    return ganzi1Mesh
  }
  const banziCreater = (x: number, z: number) => {
    let banziGeometry = new THREE.BoxGeometry(x, 2, z)
    let banziMaterial = new THREE.MeshLambertMaterial({
      color: '#03368c',
    })
    let banziMesh = new THREE.Mesh(banziGeometry, banziMaterial)

    return banziMesh
    // let banzi = new THREE.Mesh(banziGeometry,banziMaterial)
  }
  const huojiaGroup = new THREE.Group()
  huojiaGroup.name = '货架'
  huojiaGroup.castShadow = true

  let ganzi1No1 = ganzi1Creater(y)
  ganzi1No1.name = '细杆子1号'
  let ganzi1No2 = ganzi1Creater(y)
  ganzi1No2.name = '细杆子2号'
  ganzi1No2.translateX(x)
  let ganzi1No3 = ganzi1Creater(y)
  ganzi1No3.name = '细杆子3号'
  ganzi1No3.translateZ(z)
  let ganzi1No4 = ganzi1Creater(y)
  ganzi1No4.name = '细杆子4号'
  ganzi1No4.translateX(x)
  ganzi1No4.translateZ(z)

  const banzi = []
  let space = (y - 2 * line) / line
  let initialHeight = y
  for (let index = 0; index < line; index++) {
    let mesh = banziCreater(x, z)
    mesh.name = `${index}号板子`
    let afterHeight = initialHeight - space
    mesh.position.set(x / 2, afterHeight, z / 2)
    initialHeight = afterHeight
    banzi.push(mesh)
  }
  huojiaGroup.userData.matrix = { x, y, z, line }
  huojiaGroup.add(...banzi, ganzi1No1, ganzi1No2, ganzi1No3, ganzi1No4)

  return huojiaGroup
}

export const CabinetDoorShelf = (
  x: number,
  y: number,
  z: number,
  line: number
) => {
  const doorSide = (
    x: number,
    y: number,
    z: number,
    rotate?: number,
    translate?: { z: number; y: number; x: number }
  ) => {
    const geometry = new THREE.BoxGeometry(x, y, z)
    const material = new THREE.MeshLambertMaterial({
      color: '#cccccc',
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.setY(y / 2)
    if (rotate) {
      mesh.rotateY(rotate)
    }
    if (translate) {
      mesh.translateZ(translate.z)
      mesh.translateX(translate.x)
      mesh.translateY(translate.y)
    }
    return mesh
  }
  const banziCreater = (x: number, z: number) => {
    let banziGeometry = new THREE.BoxGeometry(x, 2, z)
    let banziMaterial = new THREE.MeshLambertMaterial({
      color: '#cccccc',
    })
    let banziMesh = new THREE.Mesh(banziGeometry, banziMaterial)

    return banziMesh
    // let banzi = new THREE.Mesh(banziGeometry,banziMaterial)
  }
  const shelfGroup = new THREE.Group()
  shelfGroup.name = '货架'
  shelfGroup.castShadow = true
  const doorSideGroup = new THREE.Group()
  const backDoorSide = doorSide(x, y, 2)
  doorSideGroup.name = '背门'
  doorSideGroup.add(backDoorSide)
  const leftDoorSide = doorSide(z, y, 2, 1.56, { z: x / 2, y: 0, x: -z / 2 +3})
  leftDoorSide.name = '左门'
  doorSideGroup.add(leftDoorSide)
  const rightDoorSide = doorSide(z, y, 2, 1.56, { z: -x / 2, y: 0, x: -z / 2 -3})
  rightDoorSide.name = '右门'
  doorSideGroup.add(rightDoorSide)
  const topDoorSide = doorSide(x, 2, z, 0, { z: z / 2, y: y - 2, x: 0 })
  topDoorSide.name = '顶门'
  doorSideGroup.add(topDoorSide)
  doorSideGroup.translateX(x / 2)
  shelfGroup.add(doorSideGroup)

  const banzi = []
  let space = (y - 2 * line) / line
  let initialHeight = y
  for (let index = 0; index < line; index++) {
    let mesh = banziCreater(x, z)
    mesh.name = `${index}号板子`
    let afterHeight = initialHeight - space
    mesh.position.set(x / 2, afterHeight, z / 2)
    initialHeight = afterHeight
    banzi.push(mesh)
  }
  shelfGroup.add(...banzi)

  function openDoorCreater(x: number, y: number, z: number) {
    const openDoorGroup = new THREE.Group()
    const mirrorGeometry = new THREE.BoxGeometry(x / 3, 0.8 * y, 2)
    const mirrorMaterial = new THREE.MeshLambertMaterial({
      color: '#222222',
      opacity: 0.7,
      transparent: true,
    })
    const rightMirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
    const leftMirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
    rightMirrorMesh.translateX(-x / 4)
    rightMirrorMesh.translateZ(1)
    leftMirrorMesh.translateZ(1)
    leftMirrorMesh.translateX(x / 4)

    function openDoorBackSideMaker(x: number, y: number, z: number) {
      const openDoorBackSideGroup = new THREE.Group()
      const openDoorBackSideGeometry1 = new THREE.BoxGeometry(x / 2, 0.1 * y, 2)
      const openDoorBackSideGeometry2 = new THREE.BoxGeometry(
        (x / 2 - x / 3) / 2 - 1,
        0.8 * y,
        2
      )
      const openDoorBackSideMaterial = new THREE.MeshLambertMaterial({
        color: '#ccc',
      })

      const topOpenDoorBackSideMesh = new THREE.Mesh(
        openDoorBackSideGeometry1,
        openDoorBackSideMaterial
      )
      const bottomOpenDoorBackSideMesh = new THREE.Mesh(
        openDoorBackSideGeometry1,
        openDoorBackSideMaterial
      )
      const leftOpenDoorBackSideMesh = new THREE.Mesh(
        openDoorBackSideGeometry2,
        openDoorBackSideMaterial
      )
      const rightOpenDoorBackSideMesh = new THREE.Mesh(
        openDoorBackSideGeometry2,
        openDoorBackSideMaterial
      )
      topOpenDoorBackSideMesh.translateY(y / 2 - (0.1 * y) / 2)
      bottomOpenDoorBackSideMesh.translateY(-y / 2 + (0.1 * y) / 2)
      leftOpenDoorBackSideMesh.translateX(-x / 4 + (x / 2 - x / 3) / 4)
      rightOpenDoorBackSideMesh.translateX(x / 4 - (x / 2 - x / 3) / 4)
      openDoorBackSideGroup.add(
        topOpenDoorBackSideMesh,
        bottomOpenDoorBackSideMesh,
        rightOpenDoorBackSideMesh,
        leftOpenDoorBackSideMesh
      )
      openDoorBackSideGroup.translateX(-x / 4)
      return openDoorBackSideGroup
    }
    const rightSide = openDoorBackSideMaker(x, y, z)
    const leftSide = openDoorBackSideMaker(x, y, z)
    leftSide.translateX(x / 2)

    function doorHandleMaker() {
      const p1 = new THREE.Vector3(-8, -3,0)
      const p2 = new THREE.Vector3(-5, 0, 0)
      // const p3 = new THREE.Vector3(0, 5, 0)
      const p4 = new THREE.Vector3(5, 0, 0)
      const p5 = new THREE.Vector3(8, -3)
      let line1 = new THREE.LineCurve3(p1, p2)
    //   const curve = new THREE.CatmullRomCurve3([p2, p3, p4])

      let line2 = new THREE.LineCurve3(p4, p5)
      const CurvePath: any = new THREE.CurvePath()
      CurvePath.curves.push(line1, line2)
      const geometry = new THREE.TubeGeometry(CurvePath, 100, 2, 5, false)
	  const material = new THREE.MeshLambertMaterial({
		  color:'#ccc'
	  })
	  const Mesh = new THREE.Mesh(geometry,material)
	  Mesh.translateZ(4.5)
	  Mesh.rotateZ(1.57)
	  Mesh.rotateX(1.57)
	  return Mesh
    }
	const leftDoorHandle = doorHandleMaker()
	leftDoorHandle.translateZ(x/4 - ( x / 2 - x / 3)/4 )
	const rightDoorHandle = doorHandleMaker()
	rightDoorHandle.translateZ( ( x / 2 - x / 3)/4-x/4)
	const rightDoor = new THREE.Group()
	rightDoor.translateX(x/2)
	rightDoor.name = '右门'
	const leftDoor = new THREE.Group()
	leftDoor.translateX(-(x/2))
	leftDoor.name = '左门'
  rightSide.add(rightDoorHandle)
	rightDoor.add(rightMirrorMesh,rightSide)
  leftSide.add(leftDoorHandle)
	leftDoor.add(leftMirrorMesh,leftSide)
    openDoorGroup.add(rightDoor, leftDoor)
	// openDoorGroup.name = '门'
    openDoorGroup.translateY(y / 2)
    openDoorGroup.translateX(x / 2)
    openDoorGroup.translateZ(z)
    return openDoorGroup
  }

  shelfGroup.add(openDoorCreater(x, y, z))
  shelfGroup.name = '柜门货架'
  shelfGroup.userData.matrix = { x, y, z, line }

  return shelfGroup
}
