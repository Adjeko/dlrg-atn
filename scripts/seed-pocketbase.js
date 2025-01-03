// script.js
import PocketBase from "pocketbase";

var pb = new PocketBase("http://127.0.0.1:8090");

async function createUser(name, email, password, role) {
    const data = {
        "password": password,
        "passwordConfirm": password,
        "email": email,
        "emailVisibility": true,
        "role": role,
        // "verified": true,
        "name": name
    };

    await pb.collection('users').create(data);
}

async function createCourse(title, desc, shortDesc, category, creator) {
    const data = {
        "title": title,
        "description": desc,
        "shortdescription": shortDesc,
        "category": category,
        "creator": creator,
    };

    await pb.collection('courses').create(data);
}

async function createAppointment(title, desc, shortDesc, category, creator) {
    const data = {
        "location": title,
        "points": desc,
        "shortdescription": shortDesc,
        "category": category,
        "creator": creator,
    };

    await pb.collection('appointment').create(data);
}

async function createDay() {

}

async 

createUser("test", "test@example.com", "12345678");
