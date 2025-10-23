import api from "@/lib/axios.js";

export default {

 async all() {
    return api.get("/trailers/");
  },
  async add(values) {
    const data = await api.post('/trailers/', values);
    return data;
  }
,
  async edit(idTrailer, values) { 
    const data = await api.put('/trailers/' + idTrailer, values);
    return data;
  }
,
  async delete(idTrailer) {
    const data = await api.delete('/trailers/' + idTrailer, {});
    return data;
  },
};
