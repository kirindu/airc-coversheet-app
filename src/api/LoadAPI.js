import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/load/");
  },

  // async getByID(id) {
  //   return api.get("/load/" + id);
  // },
  
  async add(values) {


    const data = await api.post('/load/', values);
    return data;

  },

  async edit(idCoverSheet, values) {

    const data = await api.put('/load/' + idCoverSheet, values);
    return data;

  },


};
