import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { ModelState } from 'src/app/models/ModelState';
import { LocalUser } from 'src/app/models/LocalUser';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
   selector: 'app-users',
   templateUrl: './users.component.html',
   styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
   users$: Observable<LocalUser[]>;
   public isLoadingUsers: boolean = false;

   constructor(
      public userService: UserService,
      public communicationService: CommunicationService,
      public dialog: MatDialog,
      private snackBar: MatSnackBar
   ) {
      communicationService.appTitle$.next('Users');
      this.users$ = userService.getUsers().pipe(map((users) =>
               users.filter((u) => u.state != ModelState.ForDelete && u.state != ModelState.Deleted)
            ));

      this.isLoadingUsers = true;
      this.users$.pipe(take(1)).subscribe({
         next: () => {
            this.isLoadingUsers = false;
         },
         error: () => {
            this.isLoadingUsers = false;
            this.snackBar.open('Failed to load users. Please check your internet connection', '', {
               duration: 3000,
               panelClass: 'snakbar-error',
            });
         },
      });
   }

   ngOnInit(): void {}

   deleteUser(user: User) {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
         data: {
            title: 'Confirm user delete',
            text: `Delete user ${user.name} ?`,
         } as ConfirmationDialogData,
      });

      dialogRef
         .afterClosed()
         .pipe(take(1))
         .subscribe((dialogResult) => {
            if (dialogResult) {
               this.userService.deleteUser(user.id!).subscribe({
                  error: (err) => {
                      this.snackBar.open(`Failed to delete user: ${err}`, '', {
                         duration: 3000,
                         panelClass: 'snakbar-error',
                      });
                  },
               });
            }
         });
   }
}
