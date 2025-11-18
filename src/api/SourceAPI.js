import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/sources/");
  },
  async add(values) {
    const data = await api.post('/sources/', values);
    return data;
  }
,
  async edit(idSource, values) { 
    const data = await api.put('/sources/' + idSource, values);
    return data;
  }
,
  async delete(idSource) {
    const data = await api.delete('/sources/' + idSource, {});
    return data;
  },
};
