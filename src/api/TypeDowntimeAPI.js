import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/typedowntimes/");
  },
  async add(values) {
    const data = await api.post('/typedowntimes/', values);
    return data;
  }
,
  async edit(idTypeDownTime, values) { 
    const data = await api.put('/typedowntimes/' + idTypeDownTime, values);
    return data;
  }
,
  async delete(idTypeDownTime) {
    const data = await api.delete('/typedowntimes/' + idTypeDownTime, {});
    return data;
  },
};
