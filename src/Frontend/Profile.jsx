import React, { useState } from 'react';
import ProfileModal from '../Components/ProfileModel'

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Profile;
