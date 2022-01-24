import * as THREE from 'three'
import RainImage from '../image/rain.png'
export const Rain = (scene) => {
  const texture = new THREE.TextureLoader().load(RainImage)
  const rainGroup = new THREE.Group()
  let sprite
  rainGroup.name = '雨'
  for (let index = 0; index < 400; index++) {
    const rainMaterial = new THREE.SpriteMaterial({
      map: texture,
    })
    sprite = new THREE.Sprite(rainMaterial)
	scene.add(sprite)
    sprite.scale.set(8, 10, 1)
    const k1 = Math.random() - 0.5
    const k2 = Math.random() - 0.5
    const k3 = Math.random() - 0.5
    sprite.position.set(9000 * k1, 9000 * k2, 9000 * k3)
    rainGroup.add(sprite)
  }
//   function render() {
//     group.children.forEach((sprite) => {
//       sprite.position.y -= 1
//       if (sprite.position.y < 0) {
//         sprite.position.y = 200
//       }
//     })
//   }
  return rainGroup
}
