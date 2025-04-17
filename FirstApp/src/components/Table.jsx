import React, {useState, useEffect}from "react";

function Table({data}) {
    const [acknowledged, setAcknowledged] = useState({});
    const [resolved, setResolved] = useState({});
    

    const handleAcknowledge = (id) => {
        setAcknowledged((prevAcknowledge) => ({
            ...prevAcknowledge,
            [id]: !prevAcknowledge[id]
        }));
    };

    useEffect(() => {
        console.log("Updated acknowledged", acknowledged);
    }, [acknowledged]);

    const handleResolve = (id) =>{
        setResolved((prevResolved) => ({
            ...prevResolved,
            [id]: !prevResolved[id]
        }));
    };

    useEffect(() => {
        console.log("Updated resolved", resolved);
    }, [resolved]);

    return(
        <table className="border-2 w-full">
            <thead className="border-b-2">
                <tr className="p-2">
                    <th className="p-2 text-center">ID</th>
                    <th className="p-2 text-center">Patient Name</th>
                    <th className="p-2 text-center">Gesture Message</th>
                    <th className="p-2 text-center">Date & Time</th>
                    <th className="p-2 text-center">Request Action</th>
                </tr>
            </thead>
            <tbody>
               {data.map(patient => (
                    <tr key={patient.id} className="p-2">
                        <td className="p-2 text-center">{patient.id}</td>
                        <td className="p-2 text-center">{patient.name}</td>
                        <td className="p-2 text-center">{patient.gesture}</td>
                        <td className="p-2 text-center">{patient.date}</td>
                        <td className="p-2 text-center">
                            <div className="flex justify-evenly text-[#336B81]">
                                <button  className={`border-1 text-center px-2 w-[130px] rounded-2xl border-[#336B81] hover:cursor-pointer active:scale-110 duration-100 transform-all ${acknowledged[patient.id] ? "bg-green-200" : ""}`}
                                onClick={() => handleAcknowledge(patient.id)}>
                                    {acknowledged[patient.id] ? "Acknowledged": "Acknowledge"}
                                    </button>
                                <button className={`border-1 text-center px-2 w-[130px] rounded-2xl border-[#336B81] hover:cursor-pointer active:scale-110 duration-100 transform-all ${resolved[patient.id] ? "bg-yellow-200" : ""}`} 
                                onClick={() => handleResolve(patient.id)}>
                                    {resolved[patient.id] ? "Resolved" : "Resolve"}
                                    </button>
                            </div>
                        </td>
                    </tr>
               ))}
            </tbody>
        </table>
    );  
};

export default Table;