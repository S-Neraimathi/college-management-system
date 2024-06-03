"use client"
import { firestore } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Popover from "../project-files/Popover";

export default function DepartmentDetails() {
    const id = "BmDLpzJc6Eg94jCnIDax";
    const [data, setData] = useState<Department>();
    const fetchDetails = async () => {
        const departmentsRef = collection(firestore, "departments");
        const snapshot = await getDocs(departmentsRef);
        const requestsData = snapshot.docs.map(doc => (doc.data() as Department));

        if (requestsData) {
            setData(requestsData[0]);
        }

    }
    useEffect(() => {
        fetchDetails();
    }, [])
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-5 p-6">
            {data?.hod?.map((detail, index) => (
                <Popover key={`hod-${index}`} name={detail.name} designation={detail.designation} imageUrl={detail.imageUrl} email={detail.email} specialization={detail.specialization} description={detail.description} />
            ))}
            {data?.professors?.map((detail, index) => (
                <Popover key={`prof-${index}`} name={detail.name} designation={detail.designation} imageUrl={detail.imageUrl} email={detail.email} specialization={detail.specialization} description={detail.description} />
            ))}
        </div>
    );
}
