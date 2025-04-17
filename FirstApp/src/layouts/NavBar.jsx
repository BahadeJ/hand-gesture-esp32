import React from "react";
import { FaHand } from "react-icons/fa6";
import {useNavigate, useLocation} from 'react-router-dom';


function NavBar() {

    const navigate = useNavigate();
    const location = useLocation();

    const renderContent = () =>{
        switch(location.pathname){
            case '/':
                return(
                <div className="shadow h-13">
                    <nav className="flex flex-row justify-between m-6">
                        <h1 className="text-3xl text-[#336B81] font-bold flex gap-2"> <FaHand color="black" className="text-black"/>GestureCare</h1>
                        <ul className="flex flex-row gap-4 text-2xl text-[#336B81]">
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">Home</li>
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50" onClick={() => navigate('/analytics')}>Analytics</li>
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">About Us</li>
                        </ul>
                    </nav>
                </div>
                );
            
            case '/analytics':
                return(
                <div className="h-13 border-b-1 drop-shadow-sm mx-2">
                    <nav className="flex flex-row justify-between m-6">
                        <h1 className="text-3xl text-[#336B81] font-bold flex gap-2"> <FaHand color="black" className="text-black"/>GestureCare</h1>
                        <ul className="flex flex-row gap-4 text-2xl text-[#336B81]">
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50" onClick={() => navigate('/')}>Home</li>
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">Active Requests</li>
                            <li className="hover:underline cursor-pointer hover:decoration-5 hover:decoration-[#336B81]/50">Gesture Logs</li>
                        </ul>
                    </nav>
                </div>
                );

            default:
                return null;
        };
    };

    return <>{renderContent()}</>;
};

export default NavBar;