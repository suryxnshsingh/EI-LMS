import React, { Suspense } from "react";
const Card = React.lazy(() => import("./facultyCard"));
import { motion } from "framer-motion"
export default function Faculty() {
    return (
        <section id="faculty">

        <div className="pt-16 flex flex-col" style={{ background: "linear-gradient(180deg, rgba(0,212,255,1) 0%, rgba(1,93,133,1) 0%, rgba(2,6,35,1) 78%)" }}
        >
            <div className="flex justify-center">
                <h1 className="mb-4 text-3xl chakra-petch-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl md:py-10  "><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Faculty Members</span></h1>

            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <motion.div className="grid md:grid-cols-3 gap-10 mb-10 place-items-center md:px-32" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card
                        name={"Dr. Rajesh Khatri"}
                        designation={"Associate Professor & Head"}
                        employeeId={"3300279"}
                        qualification={"M.E., Ph.D."}
                        joining={"24/12/2003"}
                        phone={"091-731-2582425"}
                        email={"rajeshkhatri1@rediffmail.com"}
                        imgsrc={"khatri.jpg"}
                    />
                    <Card
                        name={"P. P. Bansod"}
                        designation={"Professor"}
                        employeeId={"3300221"}
                        qualification={"Ph.D."}
                        joining={"02/04/1993"}
                        phone={"091-731-2582421"}
                        email={"pbansod@sgsits.ac.in"}
                        imgsrc={"bansod.jpg"}
                    />
                    <Card
                        name={"D. S. Ajnar"}
                        designation={"Associate Professor"}
                        employeeId={"3300244"}
                        qualification={"M.E."}
                        joining={"7/4/1995"}
                        phone={"091-731-2582422"}
                        email={"ajnards@gmail.com"}
                        imgsrc={"ajnar.jpg"}
                    />
                    <Card
                        name={"R. C. Gurjar"}
                        designation={"Associate Professor"}
                        employeeId={"3300307"}
                        qualification={"M.E., Ph.D."}
                        joining={"16/07/2007"}
                        phone={"091-731-2582424"}
                        email={"rcgurjar94@gmail.com"}
                        imgsrc={"gurjar.jpg"}
                    />
                    <Card
                        name={"Gireesh Gaurav Soni"}
                        designation={"Associate Professor"}
                        employeeId={"9404"}
                        qualification={"M.Tech., Ph.D."}
                        joining={"09/07/2007"}
                        phone={"0731-2582437"}
                        email={"gireeshsoni@gmail.com, gsoni@sgsits.ac.in"}
                        imgsrc={"gireesh.jpg"}
                    />
                    <Card
                        name={"R. S. Gamad"}
                        designation={"Professor"}
                        employeeId={"3300293"}
                        qualification={"Ph.D."}
                        joining={"30/01/2006"}
                        phone={"091-731-2582421, 091-731-2582423"}
                        email={"gs3300293@sgsitsindore.in"}
                        imgsrc={"gamad.jpg"}
                    />
                    <Card
                        name={"Sanchita Dass"}
                        designation={"Assistant Professor"}
                        employeeId={"3305233"}
                        qualification={"M. Tech"}
                        joining={"16/07/2024"}
                        phone={"0731-2582423"}
                        email={"mithi.sanchu@gmail.com"}
                        imgsrc={"sanchita.jpg"}
                    />
                    <Card
                        name={"Bindu Solanki"}
                        designation={"Assistant Professor"}
                        employeeId={"3305247"}
                        qualification={"M. Tech"}
                        joining={"15/07/2024"}
                        phone={"0731-2582423"}
                        email={"Bindu.solanki011@gmail.com"}
                        imgsrc={"bindu.jpg"}
                    />
                    <Card
                        name={"Kirti Bhargava"}
                        designation={"Assistant Professor"}
                        employeeId={"3305127"}
                        qualification={"M.E."}
                        joining={"24/08/2022"}
                        phone={"0731-2582429"}
                        email={"kirtirks@gmail.com"}
                        imgsrc={"kirti.jpg"}
                    />
                    <Card
                        name={"Anuj Rawat"}
                        designation={"Assistant Professor"}
                        employeeId={"3305114"}
                        qualification={"M. Tech, Ph.D."}
                        joining={"09/01/2021"}
                        phone={"091-731-2582429"}
                        email={"anujrawat92@gmail.com"}
                        imgsrc={"anuj.jpg"}
                    />
                    <Card
                        name={"Tarni Joshi"}
                        designation={"Assistant Professor"}
                        employeeId={"3303119"}
                        qualification={"M. Tech"}
                        joining={"18/10/2021"}
                        phone={"0731-2582424"}
                        email={"tarnijoshi88@gmail.com"}
                        imgsrc={"tarni.jpg"}
                    />
                    <Card
                        name={"Arpita Kadel"}
                        designation={"Assistant Professor"}
                        employeeId={"3305174"}
                        qualification={"M. Tech"}
                        joining={"01/08/2023"}
                        phone={"0731-2582423"}
                        email={"arpita.kadel88@gmail.com"}
                        imgsrc={"arpita.jpg"}
                    />
                    <Card
                        name={"Neha Jadon"}
                        designation={"Assistant Professor"}
                        employeeId={"3305216"}
                        qualification={"M. Tech"}
                        joining={"14/02/2024"}
                        phone={"0731-2582423"}
                        email={"nehajadon2345@gmail.com"}
                        imgsrc={"neha.jpg"}
                    />
                    <Card
                        name={"Neha Arya"}
                        designation={"Assistant Professor"}
                        employeeId={"3305231"}
                        qualification={"M. Tech"}
                        joining={"11/07/2024"}
                        phone={"0731-2582423"}
                        email={"nehaarya1988@gmail.com"}
                        imgsrc={"arya.jpg"}
                    />
                    <Card
                        name={"Ankita Pundlik"}
                        designation={"Assistant Professor"}
                        employeeId={"0050229"}
                        qualification={"M. Tech"}
                        joining={"11/07/2024"}
                        phone={"0731-2582423"}
                        email={"ankita.mangalmutri10@gmail.com"}
                        imgsrc={"ankita.jpg"}
                    />
                    <Card
                        name={"Ravi Pandit"}
                        designation={"Project Associate (C2S)"}
                        employeeId={"3305537"}
                        qualification={"M. Tech"}
                        joining={"11/07/2024"}
                        phone={"0731-2582423"}
                        email={"ravi.pandit85@gmail.com"}
                        imgsrc={"ravi.jpg"}
                    />
                    <Card
                        name={"Rashmi Shrivastava"}
                        designation={"Project Associate (C2S)"}
                        employeeId={"3305541"}
                        qualification={"M. Tech"}
                        joining={"02/08/2024"}
                        phone={"0731-2582423"}
                        email={"06shrivastavarashmi@gmail.com"}
                        imgsrc={"rashmi.jpg"}
                    />
                    <Card
                        name={"Disha Sharma"}
                        designation={"Assistant Professor"}
                        employeeId={"3305257"}
                        qualification={"M. Tech"}
                        joining={"27/09/2024"}
                        phone={"0731-2582423"}
                        email={"1998.dishasharma@gmail.com"}
                        imgsrc={"disha.jpg"}
                    />
                    <Card
                        name={"Mansi Jain"}
                        designation={"Project Associate (C2S)"}
                        employeeId={"3305537"}
                        qualification={"M. Tech"}
                        joining={"27/09/2023"}
                        phone={"0731-2582423"}
                        email={"jainmansi01@gmail.com"}
                        imgsrc={"mansi.jpg"}
                    />
                    <Card
                        name={"Deepali Choudhary"}
                        designation={"Assistant Professor"}
                        employeeId={"3305126"}
                        qualification={"M.E."}
                        joining={"24/08/2022"}
                        phone={"0731-2582423"}
                        email={"Choudharydeepali11@gmail.com"}
                        imgsrc={"deepali.jpg"}
                    />
                </motion.div>
            </Suspense>
        </div>
        </section>
    )
}