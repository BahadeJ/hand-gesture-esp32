import React from 'react';
import NavBar from '../layouts/NavBar';
import Table from '../components/Table';
import { motion } from 'framer-motion';

function AnalyticsPage() {
    const datas = [
        {id: 0, name:'John Doe', gesture:'I need Help', date:"4/4/2025 - 5:58PM" },
        {id: 1, name:'Jomar', gesture:'I need Help', date:"4/4/2025 - 5:58PM" }
    ];

    return(
        <motion.div
            initial = {{opacity: 0, x: 20}}
            animate = {{opacity: 1, x: 0 }}
            exit={{opacity: 0, x: -20 }}
            transition={{duration: 1}}
        >
            <NavBar/>
            <div className='px-10 mt-5'>
                <h1 className='text-2xl text-[#336B81]'>Active Requests</h1>
                <Table data={datas}/>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;