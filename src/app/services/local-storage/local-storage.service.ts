import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly dbNameKey = "users";

  constructor() {}

  store(users: User[]) {
    localforage.setItem(this.dbNameKey, users);
  }
}
