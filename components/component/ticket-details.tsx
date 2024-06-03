"use client"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { collection, getDocs, query, orderBy, Timestamp, where, updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { MouseEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function TicketDetails() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    getTicket();
  }, [])
  const getTicket = async () => {
    const ticketsRef = collection(firestore, "tickets");
    const q = query(ticketsRef, orderBy("createdAt", "desc"));
    const ticketSnapshots = await getDocs(q);
    const newTickets: Ticket[] = ticketSnapshots.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      deviceType: doc.data().deviceType,
      status: doc.data().status,
      createdAt: doc.data().createdAt.toDate().toLocaleString(),
    }));
    setTickets(newTickets);
  }
  const updateTicket = async (e: MouseEvent<HTMLButtonElement>, ticketId: string, newStatus: string) => {
    e.preventDefault();
    const ticketRef = doc(firestore, "tickets", ticketId);
    await updateDoc(ticketRef, { status: newStatus });
    getTicket();
  };
  return (
    <Table className="border border-gray-300 divide-y divide-gray-300">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px] border-r border-gray-300">S.No</TableHead>
          <TableHead className="border-r border-gray-300">Ticket Name</TableHead>
          <TableHead className="w-[150px] border-r border-gray-300">Device Type</TableHead>
          <TableHead className="w-[200px] border-r border-gray-300">Issue Description</TableHead>
          <TableHead className="w-[140px] border-r border-gray-300">Date Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets && tickets.map((ticket, index) => (
          <TableRow key={ticket.id} className="divide-x divide-gray-300">
            <TableCell className="font-medium border-r border-gray-300">{index + 1}.</TableCell>
            <TableCell className="border-r border-gray-300">{ticket.name}</TableCell>
            <TableCell className="border-r border-gray-300">{ticket.deviceType}</TableCell>
            <TableCell className="border-r border-gray-300">{ticket.description}</TableCell>
            <TableCell className="border-r border-gray-300">{ticket.createdAt.toString()}</TableCell>
            <TableCell>{ticket.status.toUpperCase()}</TableCell>
            <TableCell>
              {ticket.status === "open" ? (
                <Button variant="default" onClick={(e) => updateTicket(e, ticket.id, "pending")}>
                  Change to Pending
                </Button>
              ) : (
                ticket.status === "pending" ? (
                  <Button variant="default" onClick={(e) => updateTicket(e, ticket.id, "closed")}>
                    Change to Closed
                  </Button>
                ) : null // Added to handle other cases gracefully
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table >
  );
}
