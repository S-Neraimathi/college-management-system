import { FormEvent, useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { firestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export function TicketAdd() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deviceType, setDeviceType] = useState('');
  async function createTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!name || !description || !deviceType) {
        alert("Enter all the fields");
        return;
      }
      const ticketRef = await collection(firestore, "tickets");
      const newTicket = {
        name,
        description,
        deviceType,
        createdAt: serverTimestamp(),
        status: "open",
      }
      const docRef = await addDoc(ticketRef, newTicket);
      alert("Ticket added successfully!")
      console.log('Ticket created with ID:', ticketRef.id);
      setName("");
      setDescription("");
      setDeviceType("");
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error; // Re-throw the error for handling in the calling code
    }
  }
  return (
    <form className="max-w-lg mx-auto" onSubmit={createTicket}>
      <CardHeader>
        <CardTitle className="text-2xl">Create a ticket</CardTitle>
        <CardDescription>Fill out the form below to create a new ticket.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ticket-name">Ticket name</Label>
          <Input id="ticket-name" placeholder="Enter the ticket name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea className="min-h-[100px]" id="description" placeholder="Enter the description for the ticket" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Device Type</Label>
          <RadioGroup value={deviceType} >
            <Label htmlFor='Computer' className="cursor-pointer flex items-center gap-2">
              <RadioGroupItem id='Computer' value="Computer" checked={deviceType === "Computer"} onClick={() => setDeviceType("Computer")} />
              Computer
            </Label>
            <Label htmlFor='Camera' className="cursor-pointer flex items-center gap-2">
              <RadioGroupItem id='Camera' value="Camera" checked={deviceType === "Camera"} onClick={() => setDeviceType("Camera")} />
              Camera
            </Label>
          </RadioGroup>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" type='submit'>Create ticket</Button>
      </CardContent>
    </form>
  )
}
