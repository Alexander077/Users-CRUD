import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root',
})
export class UserRepositoryService {
   constructor(private http: HttpClient) {}

   getUsers(): Observable<User[]> {
      let path = `${environment.apiBaseUrl}/users`;
      return this.http.get<User[]>(path).pipe(
         /* Fix for API GET and POST/PUT object scheme inconsistency */
         map((users: any[]) =>
            users.map((u: any) => {
               return {
                  id: u.id,
                  name: `${u.firstName} ${u.lastName}`,
                  email: u.email,
                  dateOfBirth: u.dateOfBirth,
                  emailVerified: u.emailVerified,
                  createDate: u.createDate,
               } as User;
            })
         )
      );
   }

   updateUser(user: User): Observable<User> {
      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }

      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.put<User>(path, user);
   }

   createUser(user: User): Observable<User> {
      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }
      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.post<User>(path, user);
   }

   deleteUser(user: User): Observable<void> {
      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }
      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.delete<void>(path);
   }
}
