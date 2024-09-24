import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Prevents the default action (which may include the default refresh)
      event.preventDefault();
      // Navigate to a desired route or reload the current route
      navigate(0); // Replace with your actual route
    };

    // Add event listener for page reload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>This is your profile page.</p>
    </div>
  );
};

export default Profile;

  