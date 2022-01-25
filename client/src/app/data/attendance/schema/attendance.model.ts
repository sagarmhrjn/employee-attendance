export interface AttendanceWithAuth {
    id?: string;
    start_date: string;
    end_date: string;
    status: string;
    remarks: string;
}

export interface AttendanceWithAuthDTO {
    email: string;
    password: string;
    check_in_out: string;
    remarks: string;
}

export interface Attendance {
    _id: string;
    start_date: string;
    end_date: string;
    status: string;
    remarks: string;
    user:string;
}

export interface AttendanceDTO {
    start_date: string;
    end_date: string;
    status?: string;
    remarks: string;
}