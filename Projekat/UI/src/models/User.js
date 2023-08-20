export class User  {
    constructor(user) {
     this.id = user.id;
     this.name = user.name;
     this.username = user.username;
     this.email = user.email;
     this.dateOfBirth = user.dateOfBirth;
     this.address = user.address;
     this.userStatus = user.userStatus;
    }
 }
export default User;