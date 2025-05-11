import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
                .then((res) => res.json())
                .then((data) => {
                    alert(data.message);
                    navigate('/login');
                })
                .catch((error) => {
                    alert('Error verifying email');
                });
        }
    }, [location, navigate]);

    return <div>Verifying your email...</div>;
};

export default VerifyEmail;