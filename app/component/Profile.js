import React from 'react';

const Profile = () => {
  return (
    <div className="flex">
      {/* Profile Content */}
      <div className="bg-white w-3/4 p-8">
        <h1 className="text-2xl font-bold mb-6">MY PROFILE </h1>
        <div className="space-y-4">
          {/* Profile Fields */}
          <div className="flex justify-between items-center border p-1 ">
            <span>Name</span>
            <p>{}</p>
          </div>
          <div className="flex justify-between items-center border p-1 ">
            <span>Phone Number</span>
           
          </div>
          <div className="flex justify-between items-center border p-1 ">
            <span>E-Mail ID</span>
          
          </div>
          <div className="flex justify-between items-center border p-1 ">
            <span>Home Address</span>
         
          </div>
          <div className="flex justify-between items-center border p-1 ">
            <span>Office Address</span>
        
          </div>
        </div>
      </div>
      <div className='w-1/4 border m-5 rounded-xl  justify-center p-2'>
        <div className='flex justify-center'>
          <p className='bold text-5xl'>Wallet</p>
        </div>
        <div className='flex justify-center m-2'>
          <span>Coin</span> 
        </div>
        <div className='flex justify-center m-3'>
          <p>Amount</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;