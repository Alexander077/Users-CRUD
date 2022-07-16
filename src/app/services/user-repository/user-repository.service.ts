import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, take } from 'rxjs';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root',
})
export class UserRepositoryService {
   constructor(private http: HttpClient) {}

   getUsers(): Observable<User[]> {
      let path = `${environment.apiBaseUrl}/users`;
      return this.http.get<User[]>(path);
   }

   updateUser(user: User): Observable<User> {
      console.log('Updating');
      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }

      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.put<User>(path, user);
   }

   createUser(user: User): Observable<User> {
      console.log("Creating");
      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }
      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.post<User>(path, user);
   }

   deleteUser(user: User): Observable<void> {
      console.log('Deleting');

      if (user.id == null || user.id == undefined) {
         return new Observable((s) => {
            s.error('User id is not provided');
         });
      }
      let path = `${environment.apiBaseUrl}/users/${user.id}`;
      return this.http.delete<void>(path);
   }
}
