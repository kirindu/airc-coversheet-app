import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/operators/");
  },
  async add(values) {
    const data = await api.post('/operators/', values);
    return data;
  }
,
  async edit(idOperator, values) { 
    const data = await api.put('/operators/' + idOperator, values);
    return data;
  }
,
  async delete(idOperator) {
    const data = await api.delete('/operators/' + idOperator, {});
    return data;
  },
};
