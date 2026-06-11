import React, { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ----- Estilos de cabelo (componentes separados) -----
function HairShort({ color }) {
  const hair = new THREE.MeshToonMaterial({ color })
  return (
    <group>
      {/* topo */}
      <mesh material={hair} castShadow position={[0, 1.42, 0.1]} scale={[0.85, 0.2, 0.85]}>
        <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* laterais */}
      <mesh material={hair} castShadow position={[0.4, 1.15, 0]} rotation={[0, 0, -0.2]} scale={[0.15, 0.35, 0.3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      <mesh material={hair} castShadow position={[-0.4, 1.15, 0]} rotation={[0, 0, 0.2]} scale={[0.15, 0.35, 0.3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
    </group>
  )
}

function HairLong({ color }) {
  const hair = new THREE.MeshToonMaterial({ color })
  return (
    <group>
      {/* topo */}
      <mesh material={hair} castShadow position={[0, 1.42, 0.05]} scale={[0.85, 0.2, 0.85]}>
        <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* laterais longas */}
      <mesh material={hair} castShadow position={[0.35, 1.0, -0.2]} rotation={[0.3, 0, -0.2]} scale={[0.18, 0.6, 0.25]}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      <mesh material={hair} castShadow position={[-0.35, 1.0, -0.2]} rotation={[0.3, 0, 0.2]} scale={[0.18, 0.6, 0.25]}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      {/* traseira */}
      <mesh material={hair} castShadow position={[0, 0.95, -0.35]} rotation={[0.8, 0, 0]} scale={[0.6, 0.7, 0.3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
    </group>
  )
}

function HairPonytail({ color }) {
  const hair = new THREE.MeshToonMaterial({ color })
  return (
    <group>
      {/* topo */}
      <mesh material={hair} castShadow position={[0, 1.42, 0.05]} scale={[0.85, 0.2, 0.85]}>
        <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* rabo de cavalo traseiro */}
      <mesh material={hair} castShadow position={[0, 1.4, -0.45]} rotation={[0.8, 0, 0]} scale={[0.25, 0.7, 0.25]}>
        <cylinderGeometry args={[0.1, 0.25, 0.8, 8]} />
      </mesh>
      {/* ponta */}
      <mesh material={hair} castShadow position={[0, 1.05, -0.55]} scale={[0.2, 0.25, 0.2]}>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>
    </group>
  )
}

// ----- Personagem procedural -----
function ProceduralCharacter({ body, colors, hairStyle, outfit }) {
  const skinMat = useMemo(() => new THREE.MeshToonMaterial({ color: colors.skin, gradientMap: createGradientMap() }), [colors.skin])
  const eyeWhite = useMemo(() => new THREE.MeshToonMaterial({ color: 'white' }), [])
  const eyePupil = useMemo(() => new THREE.MeshToonMaterial({ color: colors.eyes }), [colors.eyes])
  const mouthMat = useMemo(() => new THREE.MeshToonMaterial({ color: colors.lips }), [colors.lips])
  const hairColor = colors.hair
  const shirtMat = useMemo(() => outfit.shirt ? new THREE.MeshToonMaterial({ color: outfit.shirtColor }) : null, [outfit])
  const pantsMat = useMemo(() => new THREE.MeshToonMaterial({ color: outfit.pantsColor }), [outfit.pantsColor])
  const shoesMat = useMemo(() => new THREE.MeshToonMaterial({ color: outfit.shoesColor }), [outfit.shoesColor])

  const scaleX = 1 + body.weight * 0.3
  const scaleY = 1 + body.height * 0.4
  const scaleZ = 1 + body.weight * 0.2

  const headScale = 1 + body.headSize * 0.25

  const armScaleY = 1 + body.armLength * 0.3
  const armScaleXZ = 1 + body.armThickness * 0.3

  const legScaleY = 1 + body.legLength * 0.3
  const legScaleXZ = 1 + body.legThickness * 0.3

  const HairComponent = hairStyle === 'longo' ? HairLong : hairStyle === 'rabo_cavalo' ? HairPonytail : HairShort

  return (
    <group dispose={null}>
      {/* Grupo do corpo com escala geral */}
      <group scale={[scaleX, scaleY, scaleZ]}>
        {/* Cabeça */}
        <group scale={[headScale, headScale, headScale]}>
          <mesh material={skinMat} castShadow position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI]} />
          </mesh>
          {/* Olhos */}
          <mesh material={eyeWhite} position={[-0.11, 1.67, 0.31]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh material={eyeWhite} position={[0.11, 1.67, 0.31]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh material={eyePupil} position={[-0.11, 1.67, 0.37]}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
          <mesh material={eyePupil} position={[0.11, 1.67, 0.37]}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
          {/* Sobrancelhas */}
          <mesh material={new THREE.MeshToonMaterial({ color: hairColor })} position={[-0.11, 1.74, 0.29]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.13, 0.02, 0.02]} />
          </mesh>
          <mesh material={new THREE.MeshToonMaterial({ color: hairColor })} position={[0.11, 1.74, 0.29]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.13, 0.02, 0.02]} />
          </mesh>
          {/* Boca */}
          <mesh material={mouthMat} position={[0, 1.59, 0.33]}>
            <boxGeometry args={[0.12, 0.015, 0.015]} />
          </mesh>
          {/* Nariz (pequeno triângulo) */}
          <mesh material={skinMat} position={[0, 1.63, 0.38]}>
            <coneGeometry args={[0.04, 0.08, 8]} />
          </mesh>
          {/* Cabelo */}
          <HairComponent color={hairColor} />
        </group>

        {/* Torso */}
        <mesh material={skinMat} castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.35, 0.28, 0.8, 16]} />
        </mesh>
        {/* Camisa (por cima do torso) */}
        {outfit.shirt && (
          <mesh material={shirtMat} castShadow position={[0, 0.8, 0.01]} scale={[1.02, 0.85, 1.02]}>
            <cylinderGeometry args={[0.35, 0.28, 0.8, 16]} />
          </mesh>
        )}

        {/* Braços */}
        <group scale={[armScaleXZ, armScaleY, armScaleXZ]}>
          {/* Braço esquerdo */}
          <mesh material={skinMat} castShadow position={[-0.58, 0.75, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.09, 0.11, 0.7, 12]} />
          </mesh>
          {/* Mão esquerda */}
          <mesh material={skinMat} castShadow position={[-0.6, 0.28, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          {/* Braço direito */}
          <mesh material={skinMat} castShadow position={[0.58, 0.75, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.09, 0.11, 0.7, 12]} />
          </mesh>
          {/* Mão direita */}
          <mesh material={skinMat} castShadow position={[0.6, 0.28, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
        </group>

        {/* Pernas */}
        <group scale={[legScaleXZ, legScaleY, legScaleXZ]}>
          {/* Perna esquerda */}
          <mesh material={pantsMat} castShadow position={[-0.18, -0.3, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.8, 12]} />
          </mesh>
          {/* Pé esquerdo */}
          <mesh material={shoesMat} castShadow position={[-0.18, -0.8, 0.05]}>
            <boxGeometry args={[0.18, 0.1, 0.28]} />
          </mesh>
          {/* Perna direita */}
          <mesh material={pantsMat} castShadow position={[0.18, -0.3, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.8, 12]} />
          </mesh>
          {/* Pé direito */}
          <mesh material={shoesMat} castShadow position={[0.18, -0.8, 0.05]}>
            <boxGeometry args={[0.18, 0.1, 0.28]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// Pequena textura gradiente para o toon shading (3 tons)
function createGradientMap() {
  const canvas = document.createElement('canvas')
  canvas.width = 3
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 3, 0)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.5, '#aaaaaa')
  gradient.addColorStop(1, '#444444')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 3, 1)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  return texture
}

// ----- Aplicativo principal -----
export default function App() {
  const [activeTab, setActiveTab] = useState('corpo')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [body, setBody] = useState({
    height: 0,
    weight: 0,
    headSize: 0,
    armLength: 0,
    armThickness: 0,
    legLength: 0,
    legThickness: 0,
  })
  const [colors, setColors] = useState({
    skin: '#f5d0b0',
    eyes: '#3a6073',
    hair: '#3a2a1a',
    lips: '#d47a6e',
  })
  const [hairStyle, setHairStyle] = useState('curto')
  const [outfit, setOutfit] = useState({
    shirt: true,
    shirtColor: '#4a6c8f',
    pantsColor: '#2c3e50',
    shoesColor: '#333333',
  })

  const handleSlider = (name, value) => setBody(prev => ({ ...prev, [name]: parseFloat(value) }))
  const handleColor = (cat, val) => setColors(prev => ({ ...prev, [cat]: val }))

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1a1a2e', fontFamily: 'sans-serif' }}>
      {/* Botão menu */}
      <button onClick={toggleSidebar} style={{
        position: 'absolute', top: 10, left: 10, zIndex: 30,
        background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
        borderRadius: '50%', width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>☰</button>

      {/* Sidebar */}
      <div style={{
        position: 'absolute', top: 0, left: sidebarOpen ? 0 : -270, width: 260, height: '100%',
        background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(10px)', zIndex: 20, padding: 15,
        transition: 'left 0.3s', overflowY: 'auto', color: 'white', fontSize: 14
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 15, flexWrap: 'wrap' }}>
          {['corpo', 'rosto', 'cabelo', 'roupas'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, minWidth: 55, padding: 8, borderRadius: 20, border: 'none',
              background: activeTab === tab ? '#e94560' : '#333',
              color: 'white', fontWeight: 'bold', fontSize: 12, cursor: 'pointer'
            }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {activeTab === 'corpo' && (
          <>
            <Slider label="Altura" value={body.height} onChange={v => handleSlider('height', v)} min={-1} max={1} />
            <Slider label="Peso" value={body.weight} onChange={v => handleSlider('weight', v)} min={-1} max={1} />
            <Slider label="Cabeça" value={body.headSize} onChange={v => handleSlider('headSize', v)} min={-0.5} max={1} />
            <Slider label="Braços (comp)" value={body.armLength} onChange={v => handleSlider('armLength', v)} min={-1} max={1} />
            <Slider label="Braços (gross)" value={body.armThickness} onChange={v => handleSlider('armThickness', v)} min={-0.5} max={1} />
            <Slider label="Pernas (comp)" value={body.legLength} onChange={v => handleSlider('legLength', v)} min={-1} max={1} />
            <Slider label="Pernas (gross)" value={body.legThickness} onChange={v => handleSlider('legThickness', v)} min={-0.5} max={1} />
            <ColorRow label="Pele" color={colors.skin} onChange={v => handleColor('skin', v)} />
          </>
        )}

        {activeTab === 'rosto' && (
          <>
            <ColorRow label="Olhos" color={colors.eyes} onChange={v => handleColor('eyes', v)} />
            <ColorRow label="Lábios" color={colors.lips} onChange={v => handleColor('lips', v)} />
            <Slider label="Tamanho Cabeça" value={body.headSize} onChange={v => handleSlider('headSize', v)} min={-0.5} max={1} />
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 10 }}>Expansões faciais em breve.</p>
          </>
        )}

        {activeTab === 'cabelo' && (
          <>
            <div style={{ marginBottom: 10 }}>
              <span>Estilo</span>
              <select value={hairStyle} onChange={e => setHairStyle(e.target.value)} style={{ marginLeft: 10, padding: 5, borderRadius: 10, background: '#333', color: 'white', border: 'none' }}>
                <option value="curto">Curto</option>
                <option value="longo">Longo</option>
                <option value="rabo_cavalo">Rabo de Cavalo</option>
              </select>
            </div>
            <ColorRow label="Cor" color={colors.hair} onChange={v => handleColor('hair', v)} />
          </>
        )}

        {activeTab === 'roupas' && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <input type="checkbox" checked={outfit.shirt} onChange={e => setOutfit(prev => ({ ...prev, shirt: e.target.checked }))} />
              <span style={{ marginLeft: 8 }}>Camisa</span>
            </label>
            {outfit.shirt && <ColorRow label="Cor Camisa" color={outfit.shirtColor} onChange={v => setOutfit(prev => ({ ...prev, shirtColor: v }))} />}
            <ColorRow label="Cor Calça" color={outfit.pantsColor} onChange={v => setOutfit(prev => ({ ...prev, pantsColor: v }))} />
            <ColorRow label="Cor Sapato" color={outfit.shoesColor} onChange={v => setOutfit(prev => ({ ...prev, shoesColor: v }))} />
          </>
        )}

        <button style={{
          background: '#e94560', border: 'none', color: 'white', padding: 12,
          borderRadius: 30, fontWeight: 'bold', marginTop: 20, width: '100%', cursor: 'pointer', fontSize: 14
        }} onClick={() => alert('Exportação em breve!')}>
          Exportar Personagem
        </button>
      </div>

      {/* Cena 3D */}
      <Canvas shadows camera={{ position: [2.5, 1.8, 3.5], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow shadow-mapSize={[512, 512]} />
        <ProceduralCharacter body={body} colors={colors} hairStyle={hairStyle} outfit={outfit} />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={6} blur={2} far={2} />
        <OrbitControls enablePan={true} enableZoom={true} minDistance={1.5} maxDistance={8} target={[0, 0.6, 0]} />
        <gridHelper args={[10, 20, '#222244', '#111133']} position={[0, -1.21, 0]} />
      </Canvas>
    </div>
  )
}

// Componentes auxiliares da UI
function Slider({ label, value, onChange, min, max }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={0.01} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', accentColor: '#e94560' }} />
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
