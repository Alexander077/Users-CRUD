import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, ReplaySubject, switchMap, take, zip } from 'rxjs';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import { UserRepositoryService } from '../user-repository/user-repository.service';
import * as localforage from 'localforage';
import { LocalUser } from 'src/app/models/LocalUser';
import { ModelState } from 'src/app/models/ModelState';

@Injectable({
   providedIn: 'root',
})
export class UserService {
   private readonly dbNameKey = 'users';
   private users$: ReplaySubject<LocalUser[]> = new ReplaySubject<LocalUser[]>(1);

   constructor(private userRepository: UserRepositoryService) {}

   public getUsers(): Observable<LocalUser[]> {
      localforage.getItem<LocalUser[]>(this.dbNameKey).then((users) => {
         if (users) {
            this.users$.next(users);
         } else {
            this.userRepository
               .getUsers()
               .pipe(
                  take(1),
                  map((users) => users.map((u) => new LocalUser(u)))
               )
               .subscribe({
                  next: (v) => {
                     localforage.setItem<LocalUser[]>(this.dbNameKey, v);
                     this.users$.next(v);
                  },
                  error: (e) => {
                     this.users$.error(e);
                  },
               });
         }
      });

      return this.users$;
   }

   getUser(id: number): Observable<LocalUser> {
      return new Observable((s) => {
         localforage.getItem<LocalUser[]>(this.dbNameKey).then(
            (users) => {
               if (users) {
                  s.next(users.find((u) => u.id == id));
               } else {
                  s.error('Failed to get users');
               }
            },
            (err) => {
               s.error('Failed to get users');
            }
         );
      });
   }

   saveUser(user: LocalUser): Observable<LocalUser> {
      return new Observable((s) => {
         localforage.getItem<LocalUser[]>(this.dbNameKey).then(
            (users) => {
               if (users) {
                  if (user.id == undefined || user.id == null) {
                     let nextInd = Math.max(...users.map((u) => u.id!)) + 1;
                     user.id = nextInd;
                     users.push(user);
                     user.state = ModelState.Created;
                     localforage.setItem(this.dbNameKey, users);
                     s.next(user);
                  } else {
                     let userToUpdateInd = users.findIndex((u) => u.id == user.id);

                     if (userToUpdateInd > -1) {
                        users[userToUpdateInd] = user;
                        user.state = ModelState.Modified;
                        localforage.setItem(this.dbNameKey, users);
                        s.next(user);
                     } else {
                        s.error('User with specified id is not found');
                     }
                  }
                  this.users$.next(users);
               } else {
                  s.error('Failed to get users');
               }
            },
            (err) => {
               s.error('Failed to get users');
            }
         );
      });
   }

   deleteUser(userId: number): Observable<void> {
      return new Observable((s) => {
         localforage.getItem<LocalUser[]>(this.dbNameKey).then(
            (users) => {
               if (users) {
                  let userToDeleteInd = users.findIndex((u) => u.id == userId);

                  if (userToDeleteInd > -1) {
                     users[userToDeleteInd].state = ModelState.ForDelete;
                     localforage.setItem(this.dbNameKey, users);
                     this.users$.next(users);
                     s.next();
                  } else {
                     s.error('User with specified id is not found');
                  }
               } else {
                  s.error('Failed to get users');
               }
            },
            (err) => {
               s.error('Failed to get users');
            }
         );
      });
   }

   saveChanges(): Observable<any> {
      return new Observable((subscription) => {
         this.users$.pipe(take(1)).subscribe((users) => {
            let observables$: Observable<any>[] = [];
            let usersToUpdate = users.filter(
               (u) => u.state != ModelState.Unmodified && u.state != ModelState.Deleted
            );

            usersToUpdate.forEach((user) => {
               let model = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  createDate: user.createDate,
                  dateOfBirth: user.dateOfBirth,
               } as User;

               switch (user.state) {
                  case ModelState.Created:
                     {
                        let obs$ = this.userRepository.createUser(model);
                        observables$.push(obs$);
                        obs$.subscribe({
                           complete: () => {
                              user.state = ModelState.Unmodified;
                              this.users$
                                 .pipe(take(1))
                                 .subscribe((v) => localforage.setItem<LocalUser[]>(this.dbNameKey, v));
                           },
                        });
                     }
                     break;

                  case ModelState.Modified:
                     {
                        let obs$ = this.userRepository.updateUser(model);
                        observables$.push(obs$);
                        obs$.subscribe({
                           complete: () => {
                              user.state = ModelState.Unmodified;
                              this.users$
                                 .pipe(take(1))
                                 .subscribe((v) => localforage.setItem<LocalUser[]>(this.dbNameKey, v));
                           },
                        });
                     }

                     break;
                  case ModelState.ForDelete: {
                     let obs$ = this.userRepository.deleteUser(model);
                     observables$.push(obs$);
                     obs$.subscribe({
                        complete: () => {
                           user.state = ModelState.Deleted;
                           this.users$
                              .pipe(take(1))
                              .subscribe((v) => localforage.setItem<LocalUser[]>(this.dbNameKey, v));
                        },
                     });
                     break;
                  }

                  default:
                     subscription.error(`Invalid model state: ${user.state}`);
                     break;
               }
            });

            zip(observables$).subscribe(subscription);
         });
      });
   }
}
