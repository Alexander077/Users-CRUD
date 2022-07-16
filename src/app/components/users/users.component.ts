import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';
import { filter, map, Observable, take } from 'rxjs';
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

   constructor(
      public userService: UserService,
      private communicationService: CommunicationService,
      private router: Router,
      public dialog: MatDialog,
   ) {
      communicationService.appTitle$.next('Users');
      this.users$ = userService.users$.pipe(
         map((users) => users.filter((u) => u.state != ModelState.Deleted))
      );
   }

   ngOnInit(): void {}

   editUser(userId: number) {
      this.router.navigate(['edit-user', userId]);
   }

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
         .subscribe((v) => {
            if (v) {
               this.userService.deleteUser(user.id!).subscribe({
                  next: () => {},
                  error: (e) => {
                     console.log(e);
                  },
               });
            }
         });
   }
}
