import api from "@/lib/axios.js";

export default {
  async all() {
    return api.get("/routes/");
  },
  
  // async add(values) {

  //   const currentUser = localStorage.getItem('USER') || '';
  //   const token = JSON.parse(currentUser).token;

  //   const data = await api.post('/categories/', values, {
  //     headers: {
  //       'x-token' : token
  //     }
  //   });
  //   return data;

  // },

  // async edit(idCategory, values) {

  //   const currentUser = localStorage.getItem('USER') || '';
  //   const token = JSON.parse(currentUser).token;

  //   const data = await api.put('/categories/' + idCategory, values, {
  //     headers: {
  //       'x-token' : token
  //     }
  //   });
  //   return data;

  // },

  // async delete(idCategory) {

  //   const currentUser = localStorage.getItem('USER') || '';
  //   const token = JSON.parse(currentUser).token;

  //   const data = await api.delete('/categories/' + idCategory, {
  //     headers: {
  //       'x-token' : token
  //     }
  //   });
  //   return data;

  // },
};
