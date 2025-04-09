import React from "react";
import { FaHand } from "react-icons/fa6";
import {useNavigate} from 'react-router-dom';

function NavBar() {

    const navigate = useNavigate();

    const handleGoToMonitoring = () =>{
        navigate('/monitor');
    };

    return(
    <div className="shadow h-13">
        <nav className="flex flex-row justify-between m-6">
            <h1 className="text-3xl text-[#336B81] font-bold flex gap-2"> <FaHand color="black" className="text-black"/>GestureCare</h1>
            <ul className="flex flex-row gap-4 text-2xl text-[#336B81]">
                <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">Home</li>
                <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50" onClick={handleGoToMonitoring}>Analytics</li>
                <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">About Us</li>
            </ul>
        </nav>
    </div>
    );
};

export default NavBar;