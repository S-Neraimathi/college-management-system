interface EyeIconProps {
    className?: string;
}
interface Ticket {
    id: QueryDocumentSnapshot<DocumentData, DocumentData>,
    name: string,
    description: string,
    deviceType: string,
    createdAt: timestamp,
    status: string
}

interface ChangeRequest {
    id?: string,
    removeId?: string,
    type: string,
    name: string,
    requestTime: timestamp,
    approvedTime: timestamp,
    designation: string,
    description: string,
    specialization: string,
    email: string,
    isHoD: boolean,
    isApproved: string,
    imageUrl: string,
}

interface ChangeRequestWithId {
    id: string,
    type: string,
    name: string,
    designation: string,
    specialization: string,
    email: string,
    isHoD: boolean,
    isApprovedByHod: string,
    isApprovedByPrincipal: string,
    imageUrl: string,
}

interface Professor {
    name: string;
    designation: string;
    specialization: string;
    imageUrl: string;
    email: string;
    description?: string,
    id: string,
    isHoD: boolean
}

interface Department {
    name: string;
    hod: Professor[];
    professors: Professor[];
}

interface StaffDetail {
    name: string,
    designation: string,
    imageUrl: string,
    description: string
}
interface PopOverProps {
    name: string,
    designation: string,
    imageUrl: string,
    email: string,
    specialization: string,
    description?: string
}
interface AddChangeRequest {
    id?: string
    name: string;
    designation: string;
    specialization: string;
    imageUrl: string;
    email: string;
    description?: string,
    isHoD: boolean
    approvedTime: timestamp,
    isApproved: string,
    requestedTime: timestamp,
    type: string,
}
interface RemoveChangeRequest {
    approvedTime: timestamp,
    id?: string
    isApproved: boolean,
    name: string,
    removeId: string,
    requestedTime: timestamp,
    type: string,
    isHoD: boolean,
}
interface UpdateChangeRequest {
    approvedTime: timestamp,
    id?: string
    isApproved: boolean,
    name: string,
    updateId: string,
    requestedTime: timestamp,
    type: string,
    description: string,
    isHoD: boolean,
}

interface PartialDepartment {
    hod: Professor[],
    professors: Professor[],
}

interface timestamp {
    seconds: number,
    nanoseconds: number,
}

interface Camera {
    id: string,
    cameraId: string
}

interface Computer {
    id: string,
    computerId: string
}

interface TicketDetail {
    docId?: string,
    type: string,
    id: string,
    deviceId: string,
    description: string,
    status: string,
    initiatedTime: timestamp,
    startTime: timestamp,
    completedTime: timestamp,
    vendor: string,
    price: number,
}