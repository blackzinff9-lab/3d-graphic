import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'

// ----- Componente do personagem -----
function Character({ bodyParams, hairStyle, outfit, colors }) {
  const group = useRef()

  // Ajuste de escala do corpo baseado nos sliders
  const bodyScale = [
    1 + bodyParams.weight * 0.3, // largura geral
    1 + bodyParams.height * 0.4, // altura
    1 + bodyParams.weight * 0.2, // profundidade
  ]

  const headScale = [
    1 + bodyParams.headSize * 0.2,
    1 + bodyParams.headSize * 0.2,
    1 + bodyParams.headSize * 0.2,
  ]

  const armScale = [
    1 + bodyParams.armThickness * 0.3,
    1 + bodyParams.armLength * 0.3,
    1 + bodyParams.armThickness * 0.3,
  ]

  const legScale = [
    1 + bodyParams.legThickness * 0.3,
    1 + bodyParams.legLength * 0.3,
    1 + bodyParams.legThickness * 0.3,
  ]

  return (
    <group ref={group} dispose={null}>
      {/* Corpo */}
      <mesh castShadow position={[0, 0.9, 0]} scale={bodyScale}>
        <boxGeometry args={[0.7, 1, 0.5]} />
        <meshStandardMaterial color={colors.skin} roughness={0.4} />
      </mesh>

      {/* Cabeça */}
      <mesh castShadow position={[0, 1.65, 0]} scale={headScale}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={colors.skin} roughness={0.3} />
      </mesh>

      {/* Olhos */}
      <mesh position={[-0.1, 1.75, 0.34]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 1.75, 0.34]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.1} />
      </mesh>
      <mesh position={[-0.1, 1.75, 0.41]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={colors.eyes} roughness={0.05} />
      </mesh>
      <mesh position={[0.1, 1.75, 0.41]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={colors.eyes} roughness={0.05} />
      </mesh>

      {/* Sobrancelhas (estilizadas como cilindros) */}
      <mesh position={[-0.1, 1.82, 0.33]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color={colors.hair} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 1.82, 0.33]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color={colors.hair} roughness={0.8} />
      </mesh>

      {/* Boca */}
      <mesh position={[0, 1.63, 0.32]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color={colors.lips} roughness={0.5} />
      </mesh>

      {/* Cabelo (dependendo do estilo) */}
      {hairStyle === 'curto' && (
        <mesh castShadow position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={colors.hair} roughness={0.6} />
        </mesh>
      )}
      {hairStyle === 'longo' && (
        <>
          <mesh castShadow position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={colors.hair} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 1.4, -0.15]} scale={[0.8, 0.6, 0.3]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={colors.hair} roughness={0.6} />
          </mesh>
        </>
      )}
      {hairStyle === 'rabo_cavalo' && (
        <>
          <mesh castShadow position={[0, 1.85, 0]}>
            <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={colors.hair} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 2.05, -0.2]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
            <meshStandardMaterial color={colors.hair} roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Braços */}
      <mesh castShadow position={[-0.6, 0.85, 0]} scale={armScale}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={colors.skin} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.6, 0.85, 0]} scale={armScale}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={colors.skin} roughness={0.4} />
      </mesh>

      {/* Pernas */}
      <mesh castShadow position={[-0.2, -0.25, 0]} scale={legScale}>
        <boxGeometry args={[0.25, 0.9, 0.25]} />
        <meshStandardMaterial color={outfit.pantsColor || colors.skin} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.2, -0.25, 0]} scale={legScale}>
        <boxGeometry args={[0.25, 0.9, 0.25]} />
        <meshStandardMaterial color={outfit.pantsColor || colors.skin} roughness={0.4} />
      </mesh>

      {/* Sapatos */}
      <mesh castShadow position={[-0.2, -0.75, 0.05]}>
        <boxGeometry args={[0.28, 0.15, 0.35]} />
        <meshStandardMaterial color={outfit.shoesColor || '#333'} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.2, -0.75, 0.05]}>
        <boxGeometry args={[0.28, 0.15, 0.35]} />
        <meshStandardMaterial color={outfit.shoesColor || '#333'} roughness={0.7} />
      </mesh>

      {/* Camisa (opcional) */}
      {outfit.shirt && (
        <mesh castShadow position={[0, 0.95, 0.05]} scale={bodyScale}>
          <boxGeometry args={[0.72, 0.5, 0.52]} />
          <meshStandardMaterial color={outfit.shirtColor || '#e94560'} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ----- App principal -----
export default function App() {
  const [activeTab, setActiveTab] = useState('corpo')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bodyParams, setBodyParams] = useState({
    height: 0,
    weight: 0,
    headSize: 0,
    armLength: 0,
    armThickness: 0,
    legLength: 0,
    legThickness: 0,
  })
  const [hairStyle, setHairStyle] = useState('curto')
  const [outfit, setOutfit] = useState({
    shirt: true,
    shirtColor: '#e94560',
    pantsColor: '#2c3e50',
    shoesColor: '#333333',
  })
  const [colors, setColors] = useState({
    skin: '#ffccaa',
    hair: '#4a3728',
    eyes: '#2c3e50',
    lips: '#cc6666',
  })
  const [pose, setPose] = useState('normal')

  const handleSlider = (name, value) => {
    setBodyParams(prev => ({ ...prev, [name]: parseFloat(value) }))
  }

  const handleColorChange = (category, value) => {
    setColors(prev => ({ ...prev, [category]: value }))
  }

  const handleExportGLB = () => {
    // Exportação simplificada: gera um GLB da cena (será implementada com GLTFExporter)
    alert('Exportação GLB será ativada na versão completa. Aguarde!')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="app">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="tab-buttons">
          {['corpo', 'rosto', 'cabelo', 'roupas'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'corpo' && (
          <>
            <div className="slider-group">
              <label>Altura <span>{bodyParams.height.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.height} onChange={e => handleSlider('height', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Peso <span>{bodyParams.weight.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.weight} onChange={e => handleSlider('weight', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Tamanho Cabeça <span>{bodyParams.headSize.toFixed(1)}</span></label>
              <input type="range" min="-0.5" max="1" step="0.01" value={bodyParams.headSize} onChange={e => handleSlider('headSize', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Comprimento Braços <span>{bodyParams.armLength.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.armLength} onChange={e => handleSlider('armLength', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Grossura Braços <span>{bodyParams.armThickness.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.armThickness} onChange={e => handleSlider('armThickness', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Comprimento Pernas <span>{bodyParams.legLength.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.legLength} onChange={e => handleSlider('legLength', e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Grossura Pernas <span>{bodyParams.legThickness.toFixed(1)}</span></label>
              <input type="range" min="-1" max="1" step="0.01" value={bodyParams.legThickness} onChange={e => handleSlider('legThickness', e.target.value)} />
            </div>
            <div className="color-row">
              <span>Cor Pele</span>
              <input type="color" value={colors.skin} onChange={e => handleColorChange('skin', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'rosto' && (
          <>
            <div className="slider-group">
              <label>Tamanho Cabeça <span>{bodyParams.headSize.toFixed(1)}</span></label>
              <input type="range" min="-0.5" max="1" step="0.01" value={bodyParams.headSize} onChange={e => handleSlider('headSize', e.target.value)} />
            </div>
            <div className="color-row">
              <span>Cor Olhos</span>
              <input type="color" value={colors.eyes} onChange={e => handleColorChange('eyes', e.target.value)} />
            </div>
            <div className="color-row">
              <span>Cor Lábios</span>
              <input type="color" value={colors.lips} onChange={e => handleColorChange('lips', e.target.value)} />
            </div>
            <p style={{color:'#aaa', fontSize:'13px', marginTop:'10px'}}>Mais opções faciais em breve...</p>
          </>
        )}

        {activeTab === 'cabelo' && (
          <>
            <div style={{marginBottom:'10px'}}>
              <span style={{color:'#ccc', fontSize:'13px'}}>Estilo:</span>
              <select value={hairStyle} onChange={e => setHairStyle(e.target.value)} style={{marginLeft:'10px', padding:'5px', borderRadius:'10px'}}>
                <option value="curto">Curto</option>
                <option value="longo">Longo</option>
                <option value="rabo_cavalo">Rabo de Cavalo</option>
              </select>
            </div>
            <div className="color-row">
              <span>Cor Cabelo</span>
              <input type="color" value={colors.hair} onChange={e => handleColorChange('hair', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'roupas' && (
          <>
            <div style={{marginBottom:'10px'}}>
              <label style={{color:'#ccc', fontSize:'13px', display:'flex', alignItems:'center'}}>
                <input type="checkbox" checked={outfit.shirt} onChange={e => setOutfit(prev => ({...prev, shirt: e.target.checked}))} />
                <span style={{marginLeft:'8px'}}>Camisa</span>
              </label>
            </div>
            {outfit.shirt && (
              <div className="color-row">
                <span>Cor Camisa</span>
                <input type="color" value={outfit.shirtColor} onChange={e => setOutfit(prev => ({...prev, shirtColor: e.target.value}))} />
              </div>
            )}
            <div className="color-row">
              <span>Cor Calça</span>
              <input type="color" value={outfit.pantsColor} onChange={e => setOutfit(prev => ({...prev, pantsColor: e.target.value}))} />
            </div>
            <div className="color-row">
              <span>Cor Sapato</span>
              <input type="color" value={outfit.shoesColor} onChange={e => setOutfit(prev => ({...prev, shoesColor: e.target.value}))} />
            </div>
          </>
        )}

        <button className="export-btn" onClick={handleExportGLB}>
          Exportar GLB
        </button>
      </div>

      {/* Cena 3D */}
      <Canvas
        shadows
        camera={{ position: [2.5, 1.8, 3.5], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <directionalLight position={[-3, 2, -5]} intensity={0.3} />
        <Character bodyParams={bodyParams} hairStyle={hairStyle} outfit={outfit} colors={colors} />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.5}
          scale={5}
          blur={2}
          far={2}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={1.5} maxDistance={8} target={[0, 0.8, 0]} />
        <gridHelper args={[10, 20, '#222244', '#111133']} position={[0, -1.2, 0]} />
      </Canvas>
    </div>
  )
          }
