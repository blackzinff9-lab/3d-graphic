import React, { useState, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// Modelo Raven: personagem feminina realista, texturizada, com esqueleto
function RavenCharacter({ bodyScale, hairColor, skinColor, outfitColor }) {
  const { scene, materials } = useGLTF(
    'https://threejs.org/examples/models/gltf/Raven/Raven.gltf'
  )

  // Ajusta cores nos materiais (alguns usam textura, outros cor sólida)
  useEffect(() => {
    if (!materials) return
    // Mapeia nomes conhecidos do modelo Raven
    const skinNames = ['Raven_Body', 'Raven_Head', 'Raven_Arms', 'Raven_Legs']
    const hairNames = ['Raven_Hair', 'Raven_Hair_2']
    const outfitNames = ['Raven_Outfit', 'Raven_Shirt', 'Raven_Pants']

    Object.entries(materials).forEach(([name, mat]) => {
      if (skinNames.some(n => name.includes(n))) {
        mat.color?.set(skinColor)
      }
      if (hairNames.some(n => name.includes(n))) {
        mat.color?.set(hairColor)
      }
      if (outfitNames.some(n => name.includes(n))) {
        mat.color?.set(outfitColor)
      }
    })
  }, [materials, hairColor, skinColor, outfitColor])

  return (
    <group dispose={null} scale={[bodyScale, bodyScale, bodyScale]} position={[0, -0.9, 0]}>
      <primitive object={scene} />
    </group>
  )
}

// ----- App principal com UI completa (mantida do anterior) -----
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('corpo')
  const [bodyScale, setBodyScale] = useState(1.0)
  const [hairColor, setHairColor] = useState('#3a2a1a')
  const [skinColor, setSkinColor] = useState('#f5d0b0')
  const [outfitColor, setOutfitColor] = useState('#4a6c8f')

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1a1a2e' }}>
      <button onClick={toggleSidebar} style={{
        position: 'absolute', top: 10, left: 10, zIndex: 30,
        background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
        borderRadius: '50%', width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>☰</button>

      <div style={{
        position: 'absolute', top: 0, left: sidebarOpen ? 0 : -270, width: 260, height: '100%',
        background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(10px)', zIndex: 20, padding: 15,
        transition: 'left 0.3s', overflowY: 'auto', color: 'white', fontSize: 14
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 15, flexWrap: 'wrap' }}>
          {['corpo', 'rosto', 'cabelo', 'roupas'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, minWidth: 55, padding: 8, borderRadius: 20, border: 'none',
              background: activeTab === tab ? '#e94560' : '#333', color: 'white', fontWeight: 'bold', fontSize: 12
            }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {activeTab === 'corpo' && (
          <>
            <Slider label="Escala Geral" value={bodyScale} onChange={setBodyScale} min={0.7} max={1.5} />
            <ColorRow label="Tom de Pele" color={skinColor} onChange={setSkinColor} />
          </>
        )}

        {activeTab === 'rosto' && (
          <p style={{ color: '#aaa', fontSize: 12 }}>Ajustes faciais disponíveis em breve com morph targets.</p>
        )}

        {activeTab === 'cabelo' && (
          <ColorRow label="Cor do Cabelo" color={hairColor} onChange={setHairColor} />
        )}

        {activeTab === 'roupas' && (
          <ColorRow label="Cor da Roupa" color={outfitColor} onChange={setOutfitColor} />
        )}

        <button style={{
          background: '#e94560', border: 'none', color: 'white', padding: 12, borderRadius: 30,
          fontWeight: 'bold', marginTop: 20, width: '100%', cursor: 'pointer'
        }} onClick={() => alert('Exportação em breve!')}>
          Exportar GLB
        </button>
      </div>

      <Canvas shadows camera={{ position: [2, 1.5, 3], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow shadow-mapSize={[512, 512]} />
        <RavenCharacter bodyScale={bodyScale} hairColor={hairColor} skinColor={skinColor} outfitColor={outfitColor} />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={6} blur={2} far={2} />
        <OrbitControls enablePan={true} enableZoom={true} minDistance={1.5} maxDistance={6} target={[0, 0.6, 0]} />
        <gridHelper args={[10, 20, '#222244', '#111133']} position={[0, -1.21, 0]} />
      </Canvas>
    </div>
  )
}

// Componentes auxiliares da UI (iguais aos anteriores)
function Slider({ label, value, onChange, min, max }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span>{label}</span><span>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={0.01} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#e94560' }} />
    </div>
  )
}

function ColorRow({ label, color, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <input type="color" value={color} onChange={e => onChange(e.target.value)} style={{ width: 35, height: 35, borderRadius: '50%', border: '2px solid white', padding: 0, background: 'transparent' }} />
    </div>
  )
                                                                                                     }
