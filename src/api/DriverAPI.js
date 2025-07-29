import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/drivers/");
  },

    async add(values) {


    const data = await api.post('/drivers/', values);
    return data;

  },
  
  async edit(idDriver, values) {    
    const data = await api.put('/drivers/' + idDriver, values);
    return data;

  },

  async delete(idDriver) {
    const data = await api.delete('/drivers/' + idDriver, {});
    return data;
  },
};
