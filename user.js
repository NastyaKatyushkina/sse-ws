const { v4: uuidv4 } = require("uuid");

const users = [];

class User {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
    }
   
    save() {
        const users = User.getAll();
        users.push(this.toJSON());
        return users;
       }

    toJSON() {
         
        return {
            name: this.name,
            id: this.id,
        }
    }

    static getAll() {
        return users;
       }

   static getByName(name) {
        const users = User.getAll();
        return users.find(elem => elem.name.toLowerCase() === name.toLowerCase())
    }

    static deleteUser(name){
        let users = User.getAll();
        const index = users.findIndex(elem => elem.name === name);
        
            if (index !== -1) {
                users.splice(index, 1);
            }
            
        return users; 
    }
}

module.exports = User;