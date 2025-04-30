import api from "@/lib/axios.js";
import qs from "qs";

export default {

  async loginDriver(values) {
    const data = await api.post("/drivers/login", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async loginAdmin(values) {
    const form = qs.stringify({
      username: values.email, // 👈 el campo debe llamarse 'username'
      password: values.password
    });
  
    const data = await api.post("/users/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  
    return data;
  },

  async auth() {

    const currentUser = localStorage.getItem('USER') || '';
    const token = JSON.parse(currentUser).token;

    const data = await api.get('/auth/user', {
      headers: {
        'x-token' : token
      }
    });
    return data;

  },

  async all() {

    const currentUser = localStorage.getItem('USER') || '';
    const token = JSON.parse(currentUser).token;

    const data = await api.get('/users/', {
      headers: {
        'x-token' : token
      }
    });
    return data;

  },

  async add(values) {
    const currentUser = localStorage.getItem('USER') || '';
    const token = JSON.parse(currentUser).token;

    const data = await api.post('/users/', values, {
      headers: {
        'x-token' : token
      }
    });
    return data;
  },

  async delete(idUser) {

    const currentUser = localStorage.getItem('USER') || '';
    const token = JSON.parse(currentUser).token;

    const data = await api.delete('/users/' + idUser, {
      headers: {
        'x-token' : token
      }
    });
    return data;

  },

  async edit(idUser, values) {

    const currentUser = localStorage.getItem('USER') || '';
    const token = JSON.parse(currentUser).token;

    const data = await api.put('/users/' + idUser, values, {
      headers: {
        'x-token' : token
      }
    });
    return data;

  },
  




};