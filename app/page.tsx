'use client'
import Link from 'next/link';
import LightPillar from '../components/LightPillar.jsx'
export default function Home() {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />

       {/* Top Bar */}
       <section className="text-white flex items-center justify-center">
        <div className='bg-white/20 backdrop-blur-md rounded-full w-[50%] flex justify-around px-12 py-6 mt-5 border border-gray-300' >
          <h1>Logo</h1>
          <ul className='flex gap-4'>
            <Link href=''>Home</Link>
            <Link href='/auth/login'>Login</Link>
          </ul>

        </div>
       </section>

        <section className="text-white h-[80vh] w-screen flex flex-col items-center justify-center">
          <p>Success Start with Self Belief</p>
          <h1 className='text-[60px] font-bold'>Vairaa Coders</h1>
          <p>Vairaa Coders is a Student Community for Learn New Technologies</p>
        </section>
      </div>
    </>
  );
}
