import {
  CubeRefractionMapping,
  CubeTextureLoader,
  LinearFilter,
  PMREMGenerator,
  UnsignedByteType
} from 'three'
import {
  HDRCubeTextureLoader
} from 'three/examples/jsm/loaders/HDRCubeTextureLoader'

import { materialList } from './materialList'

const genCubeUrls = function (prefix, postfix) {
  return [
    prefix + 'px' + postfix, prefix + 'nx' + postfix,
    prefix + 'py' + postfix, prefix + 'ny' + postfix,
    prefix + 'pz' + postfix, prefix + 'nz' + postfix
  ]
}

const hdrUrls = genCubeUrls('3d/environments/cubeTexture/', '.hdr')

const textureCubeUrls = genCubeUrls('3d/environments/imageTexture/', '.jpg')

let hdrCubeRenderTarget

function getImageCubeMapTexture () {
  return new Promise((resolve, reject) => {
    // console.log(textureCubeUrls)
    const textureCube = new CubeTextureLoader().load(textureCubeUrls)
    textureCube.mapping = CubeRefractionMapping

    // scene.background = textureCube
    resolve({
      envMap: textureCube
    })
  })
}

let UVCubeMap
function getUVCubeMapTexture (renderer) {
  return new Promise((resolve, reject) => {
    if (UVCubeMap) {
      resolve({
        envMap: UVCubeMap
      })
    } else {
      const hdrTextureLoader = new HDRCubeTextureLoader()
      UVCubeMap = hdrTextureLoader.setDataType(UnsignedByteType).load(hdrUrls, function (hdrCubeMap) {
        const pmremGenerator = new PMREMGenerator(renderer)
        hdrCubeRenderTarget = pmremGenerator.fromCubemap(UVCubeMap)

        UVCubeMap.magFilter = LinearFilter
        UVCubeMap.needsUpdate = true
        resolve({
          envMap: UVCubeMap
        })
      })
    }
  })
}

function setRequiredMaterial (object, renderer, data) {
  object.traverse(o => {
    const meshName = o.name.toLowerCase()
    if (meshName.includes('customizable')) {
      const [, nodeName, ] = meshName.split('-')
      
      const calibrationData = data.calibrationData

      if (calibrationData) {
        if (calibrationData[nodeName] && typeof calibrationData[nodeName] === 'object' && Object.keys(calibrationData[nodeName]).length) {
          const materialId = calibrationData[nodeName].materialId
          const materialData = materialList.filter(material => material.id === materialId)[0]
          updateRequiredMaterial(o,renderer, materialData, calibrationData[nodeName], nodeName)
        }
      }
    }

      if (meshName.includes('clip')) {
        o.visible = false
      }
  })
}

// function updateRequiredMaterial (object, materialData, calibratedData, givenNodeName) {
//   getUVCubeMapTexture(state.threejsRenderer).then(({
//     envMap
//   }) => {
//     let material
//     const MaterialPrototype = materialData.type
//     const nodeName = givenNodeName || state.current3DModel.activeNodeName
//     if (
//       givenNodeName === nodeName &&
//         state.current3DModel.assignedMaterials[givenNodeName] &&
//         state.current3DModel.assignedMaterials[givenNodeName].id === materialData.id
//     ) {
//       material = state.current3DModel.assignedMaterials[givenNodeName]
//     } else {
//       material = new MaterialPrototype({ object, envMap, renderer: state.threejsRenderer })
//     }

//     if (object.material && object.material.dispose) {
//       object.material.dispose()
//     }

//     material.attachMaterial(object)
//     if (calibratedData && typeof calibratedData === 'object' && Object.keys(calibratedData).length) {
//       material.setMaterialProperties(calibratedData)
//     }

//     state.current3DModel.assignedMaterials[nodeName] = material

//     // storing materials used for the nodes sharing the same name
//     if (state.current3DModel.activeNodeMaterialList[nodeName]) {
//       state.current3DModel.activeNodeMaterialList[nodeName].push(material)
//     } else {
//       state.current3DModel.activeNodeMaterialList[nodeName] = [material]
//     }

//     state.current3DModel.activeNodeMaterial = material
//     state.current3DModel.currentMaterialId = (calibratedData && calibratedData.materialId) || materialData.id
//     createPhysicalPropertiesMenu()
//   })
// }

function updateRequiredMaterial (object,renderer, materialData, calibratedData, givenNodeName) {
  getUVCubeMapTexture(renderer).then(({
    envMap
  }) => {
    let material
    const MaterialPrototype = materialData.type
    const nodeName = givenNodeName
    
      material = new MaterialPrototype({ object, envMap, renderer: renderer })


    if (object.material && object.material.dispose) {
      object.material.dispose()
    }

    material.attachMaterial(object)
    if (calibratedData && typeof calibratedData === 'object' && Object.keys(calibratedData).length) {
      material.setMaterialProperties(calibratedData)
    }

  })
}

export {
  setRequiredMaterial,
  updateRequiredMaterial
}
