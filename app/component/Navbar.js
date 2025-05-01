import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push('/profile');
  };


  return (
    <>
        <div className='bg-[#67AE6E] h-12 py-3 px-3'>
            <div className='flex items-center justify-between '>
                <div className="black">GreenWheel</div>
                <div className=' flex gap-2'>
                  <button onClick={handleSubmit} className='border px-2 rounded-4xl'>Account</button>
                  <button  className='border px-2 rounded-4xl'>Contact Us</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar
