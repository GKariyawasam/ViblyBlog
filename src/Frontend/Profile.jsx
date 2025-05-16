// pages/Profile.jsx
import React, { useState } from 'react';
import ProfileModal from '../Components/ProfileModel'

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Open by default or trigger via a button

  return (
    <div>
      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Profile;
