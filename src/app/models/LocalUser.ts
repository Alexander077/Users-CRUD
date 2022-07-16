import { ModelState } from "./ModelState";
import { User } from "./User";

export class LocalUser extends User {
   state: ModelState = ModelState.Unmodified;

   constructor(init?: Partial<User>) {
      super();
      Object.assign(this, init);
   }
}