
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  id?: number;
  memberNo: string;
  name: string;
  fhName: string;
  dateOfBirth?: Date;
  mobile?: string;
  email?: string;
  designation?: string;
  dojJob?: Date;
  doRetirement?: Date;
  branch?: string;
  dojSociety?: Date;
  officeAddress?: string;
  residenceAddress?: string;
  city?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  nominee?: string;
  nomineeRelation?: string;
  shareAmount: number;
  cdAmount: number;
  bankName?: string;
  payableAt?: string;
  accountNo?: string;
  status?: string;
  date?: Date;
  photoPath?: string;
  signaturePath?: string;
  shareDeduction?: number;
  withdrawal?: number;
  gLoanInstalment?: number;
  eLoanInstalment?: number;
  createdDate?: Date;
  updatedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://0.0.0.0:5000/api/members';

  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  getMemberByNumber(memberNo: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/by-number/${memberNo}`);
  }

  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(id: number, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
