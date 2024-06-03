// "use client"
// import React, { useState, useEffect } from 'react';
// import { firestore } from '../../firebase';
// import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, or, query, setDoc, updateDoc, where } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { unsubscribe } from 'diagnostics_channel';

// const TableForHod = () => {
//     const [changeRequests, setChangeRequests] = useState<any[]>([]);
//     const [update, setUpdate] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState(false); // Add loading state indicator
//     const [error, setError] = useState(null); // Add error state for handling errors
//     const router = useRouter();
//     useEffect(() => {
//         const fetchChangeRequests = async () => {
//             try {
//                 const changeRequestsCollection = collection(firestore, "changeRequest");
//                 const q = query(changeRequestsCollection,
//                     where("isApprovedByHod", '==', "pending")
//                 )
//                 const snapshot = await getDocs(q);
//                 const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 console.log(requestsData);
//                 setChangeRequests(requestsData);
//             } catch (error) {
//                 console.error('Error fetching change requests:', error);
//                 setError(error.message || 'An error occurred.'); // Set an error state for handling (optional)
//             }
//         };

//         fetchChangeRequests();
//     }, []);
//     const updateApproval = async (approvalType: string, isApproved: string, requestId: string) => {
//         try {
//             const changeRequestRef = doc(firestore, "changeRequest", requestId);
//             await updateDoc(changeRequestRef, {
//                 [`isApprovedBy${approvalType}`]: isApproved,
//             });

//             // Get the approved request data corresponding to the requestId
//             const approvedRequestSnapshot = await getDoc(changeRequestRef);
//             const approvedRequestData = approvedRequestSnapshot.data();

//             if (approvedRequestData) {
//                 // Check if the other approval type is "approved"
//                 const otherApprovalType = approvalType === "Hod" ? "Principal" : "Hod";
//                 if (approvedRequestData[`isApprovedBy${otherApprovalType}`] === "approved") {
//                     // Add HoD to hod array if isHoD is true
//                     const departmentsRef = collection(firestore, "departments");
//                     const departmentsDocRef = doc(departmentsRef, "BmDLpzJc6Eg94jCnIDax");
//                     if (approvedRequestData.isHoD) {
//                         // Add details to the departments collection based on isHoD value

//                         // Update the document to add the HoD to hod array
//                         await updateDoc(departmentsDocRef, {
//                             hod: arrayUnion({
//                                 name: approvedRequestData.name,
//                                 designation: approvedRequestData.designation,
//                                 specialization: approvedRequestData.specialization,
//                                 imageUrl: approvedRequestData.imageUrl,
//                                 email: approvedRequestData.email,
//                                 isHoD: true
//                             }),
//                         });

//                         console.log(`Added HoD to hod array in departments collection for request ${requestId}`);
//                     } else {
//                         await updateDoc(departmentsDocRef, {
//                             professors: arrayUnion({
//                                 name: approvedRequestData.name,
//                                 designation: approvedRequestData.designation,
//                                 specialization: approvedRequestData.specialization,
//                                 imageUrl: approvedRequestData.imageUrl,
//                                 email: approvedRequestData.email,
//                             }),
//                         });
//                         console.log(`Added Professors to professors array in departments collection for request ${requestId}`);
//                     }
//                 } else {
//                     console.log(`Other approval type (${otherApprovalType}) is not yet approved for request ${requestId}`);
//                 }
//             } else {
//                 console.log(`No approved request data found for request ${requestId}`);
//             }

//             setUpdate(prevUpdate => !prevUpdate);
//             console.log(`Successfully updated ${approvalType} approval for request ${requestId}`);
//             // Optionally, refetch data to update the table
//         } catch (error) {
//             console.error('Error updating approval:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Change Requests</h2>
//             {isLoading ? (
//                 <p>Loading change requests...</p>
//             ) : error ? (
//                 <p className="error-message">Error: {error}</p> // Add error styling (optional)
//             ) : (
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Designation</th>
//                             <th>Specialization</th>
//                             <th>Email</th>
//                             <th>Image</th>
//                             <th>Approve</th>
//                             <th>Reject</th>
//                             {/* Add more table headers as needed */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {changeRequests.map(request => (
//                             <tr key={request.id}>
//                                 <td>{ }</td>
//                                 <td>{request.name}</td>
//                                 <td>{request.designation}</td>
//                                 <td>{request.specialization}</td>
//                                 <td>{request.email}</td>
//                                 <td>
//                                     <img src={request.imageUrl} alt="" />
//                                 </td>
//                                 <td>
//                                     <button onClick={() => updateApproval('Hod', "approved", request.id)}>Approve HoD</button>
//                                 </td>
//                                 <td>
//                                     <button onClick={() => updateApproval('Hod', "rejected", request.id)}>Reject HoD</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default TableForHod;
