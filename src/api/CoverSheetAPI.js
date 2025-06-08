import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/coversheets/");
  },


 async allByDate(date) {
    return api.get('/coversheets/by-date/' + date, {});
  },
  
  
  async add(values) {


    const data = await api.post('/coversheets/', values);
    return data;

  },

  async edit(idCoverSheet, values) {

    const data = await api.put('/coversheets/' + idCoverSheet, values);
    return data;

  },

  async getSpareTruckInfo(idCoverSheet) {

    const data = await api.get('/coversheets/' + idCoverSheet + '/sparetruckinfo', {});
    return data;

  },

    async getDowntime(idCoverSheet) {

    const data = await api.get('/coversheets/' + idCoverSheet + '/downtime', {});
    return data;

  },

      async getLoad(idCoverSheet) {

    const data = await api.get('/coversheets/' + idCoverSheet + '/load', {});
    return data;

  },


  // async add(values) {

  //   const currentUser = localStorage.getItem('USER') || '';
  //   const token = JSON.parse(currentUser).token;

  //   const data = await api.post('/coversheets/', values, {
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
