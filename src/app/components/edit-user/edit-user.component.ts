import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { UserService } from 'src/app/services/user/user.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalUser } from 'src/app/models/LocalUser';
import { ModelState } from 'src/app/models/ModelState';

const userBirthDateFormat = {
   parse: {
      dateInput: 'YYYY-MM-DD',
   },
   display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'YYYY-MM-DD',
      monthYearA11yLabel: 'MMMM YYYY',
   },
};

@Component({
   selector: 'app-edit-user',
   templateUrl: './edit-user.component.html',
   styleUrls: ['./edit-user.component.scss'],
   providers: [
      {
         provide: DateAdapter,
         useClass: MomentDateAdapter,
         deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },

      { provide: MAT_DATE_FORMATS, useValue: userBirthDateFormat },
   ],
})
export class EditUserComponent implements OnInit {
   user: LocalUser | undefined;
   userForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userBirthDate: new FormControl(moment()),
   });

   constructor(
      private communicationService: CommunicationService,
      private route: ActivatedRoute,
      private userService: UserService,
      private snackBar: MatSnackBar,
      private router: Router
   ) {
      communicationService.appTitle$.next('Add User');
   }

   ngOnInit(): void {
      this.route.params.subscribe((params) => {
         let userId = params['id'];

         if (userId) {
            this.userService
               .getUser(userId)
               .pipe(take(1))
               .subscribe({
                  next: (user) => {
                     if (user) {
                        this.user = user;
                        this.communicationService.appTitle$.next(`Edit User: ${this.user.name}`);
                     } else {
                        this.user = {
                           name: '',
                           email: '',
                           createDate: moment().format('YYYY-MM-DD'),
                           state: ModelState.Created,
                        };
                     }
                  },
                  error: (err) => {
                     this.snackBar.open(`Failed to get user:  ${err}`, '', {
                        duration: 3000,
                        panelClass: 'snakbar-error',
                     });
                  },
               });
         }
      });
   }

   saveUser() {
      if (this.userForm.invalid) {
         this.snackBar.open('Please fix form errors', '', {
            duration: 3000,
            panelClass: 'snakbar-error',
         });
         return;
      }

      if (moment.isMoment(this.user!.dateOfBirth)) {
         this.user!.dateOfBirth = (this.userForm.controls['userBirthDate'].value as moment.Moment).format(
            'YYYY-MM-DD'
         );
      }
      this.userService
         .saveUser(this.user!)
         .pipe(take(1))
         .subscribe({
            next: () => this.router.navigate(['/users']),
            error: (err) => {
               this.snackBar.open(`Failed to save user:  ${err}`, '', {
                  duration: 3000,
                  panelClass: 'snakbar-error',
               });
            },
         });
   }
}
