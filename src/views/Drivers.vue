<script setup>
import { ref, onMounted } from "vue";
import { defineAsyncComponent } from "vue";

import { useRouter } from 'vue-router' // Importamos useRouter para manejar la redirección
const router = useRouter() // Instanciamos el router

// Importamos utilidades
import { DateTime } from "luxon";
import { openModal } from "@kolirt/vue-modal";
import { ModalTarget } from '@kolirt/vue-modal'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";


// Importamos el api
import CoverSheetAPI from "@/api/CoverSheetAPI.js";
import SpareTruckInfoAPI from "@/api/SpareTruckInfoAPI";
import DowntimeAPI from "@/api/DowntimeAPI";
import LoadAPI from "@/api/LoadAPI";

// Import composables
import useSweetAlert2Notification from "@/composables/useSweetAlert2";
const { showSweetAlert, alertResult } = useSweetAlert2Notification();

// Importamos componentes
import Spinner from "@/components/Spinner.vue";
import CoverSheetModal from "@/components/CoverSheetModal.vue";

// Importamos Stores
import { useRoutesStore } from "@/stores/routes.js";
const storeRoute = useRoutesStore();

import { useLandFillsStore } from "@/stores/landfills";
const storeLandFill = useLandFillsStore();

import { useTrucksStore } from "@/stores/trucks.js";
const storeTruck = useTrucksStore();

import { useDriversStore } from "@/stores/drivers.js";
import DriverAPI from "@/api/DriverAPI";
const storeDriver = useDriversStore();		


const user = ref(null);

// Recuperamos el usuario
const storedUser = localStorage.getItem("USER");

if (storedUser) {
  try {
    const parsed = JSON.parse(storedUser);

    if (parsed.data.user) {
      user.value = parsed.data.user; // ADMIN
    } else {
      user.value = parsed.data; // DRIVER
    }
  } catch (e) {
    console.error("Error al parsear USER desde localStorage:", e);
  }
}

// General Info
const selectedRoute = ref("");
const selectedTruck = ref("");
const selectedDriver = ref("");

const date = ref(new Date());


const coverSheetList = ref([]);

const driverList = ref([]);


const formSubmitted = ref(false);

const errors = ref({
  date_er: "",

});

// Modo de edición de la informaciongeneral para el coversheet
const isEditModeCoverShet = ref(false);


const SearchDriver = async (event) => {

  if(event){
      event.preventDefault();
  }

    try {
  

    if(selectedDriver.value){


      driverList.value = storeDriver.drivers.filter(c => c.id === selectedDriver.value);


    } else {
      driverList.value = storeDriver.drivers;
    }

    

  } catch (error) {
    console.error("Error al obtener CoverSheet:", error);
  }

}
// Abrir modal para ver el CoverSheet

const openCoverSheetModal = async (item) => {

  await openModal(
    defineAsyncComponent(() => import("@/components/AddDriverModal.vue")),
    {
      item: item,
    //  onUpdateSuccess: SearchCoverSheet, // Pass the function
    }
  )
    // runs when modal is closed via confirmModal
    .then((data) => {
      console.log("success", data);
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      console.log("catch");
    });

};


const openNewCoverSheetModal = async () => {

  await openModal(
    defineAsyncComponent(() => import("@/components/NewCoverSheetModal.vue")),
    {
      // item: item,
    }
  )
    // runs when modal is closed via confirmModal
    .then((data) => {
      console.log("success", data);
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      console.log("catch");
    });

};





const EditCoverSheet = (item) => {


}
// Metodos Utilitarios

const currentDate = ref(
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

const formatToYYYYMMDD = (inputDate) => {
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) {
    console.warn("Fecha inválida:", inputDate);
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

const filterDrivers = (filters) =>{
  return storeDriver.drivers.filter(c => {
    const matchDriver = !filters.driver_id || c.driver_id === filters.driver_id;
    return matchDriver;
  });
}


onMounted(() => {
  if (!sessionStorage.getItem('page_reloaded')) {
    sessionStorage.setItem('page_reloaded', 'true')
    window.location.reload()
  } else {
    sessionStorage.removeItem('page_reloaded') // limpia para futuras visitas
  }
})
</script>

<template>

            <!-- row -->
			<div class="container-fluid">

			   <div class="page-titles">
      <ol class="breadcrumb">
    
        <li class="breadcrumb-item active">
          <a href="javascript:void(0)">Search Coversheet</a>
        </li>
      </ol>
    </div>

    <Spinner v-if=" storeDriver.loading" />


    <div class="col-lg-12">
      <div class="card">

      
        <div class="card-body">
          <div class="basic-form">
          
   
              <div class="row">

				          <div class="mb-3 col-md-3">
                  <label class="form-label">Driver</label>
                  <v-select :options="storeDriver.drivers" v-model="selectedDriver" placeholder="Choose Driver"
                    :reduce="(driver) => driver.id" label="name" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedDriver }" />
                  
                </div>

       

              </div>



										  
                            <button style="margin-bottom: -5px !important;" @click="SearchDriver" type="button" class="btn btn-info">
                              Search Driver
                              <span class="btn-icon-end">
                                <i class= 'fa fa-search'></i>
                              </span>
                            </button>

			
          </div>
        </div>
      </div>
    </div>

	    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="basic-form">
          
         
               <div class="row">
                          <hr style="color: black" />
                          <div class="table-responsive">
                            <table
                              class="table table-bordered header-border table-striped table-hover table-responsive-md">
                              <thead class="thead-primary">
                                <tr>
                                  <th style="text-align: center;">Name</th>
                                  <th style="text-align: center;">Email</th>         
								                  <th style="text-align: center !important;">Action</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in driverList" :key="index">

                                  <td class="td">{{ item.name }}</td>
                                  <td class="td">{{ item.email }}</td>
                              <td>
                                <div class="d-flex gap-1">
                                  <a @click="addDriver" class="btn btn-primary shadow btn-xs sharp"><i class="fa fa-plus"></i></a>
                                  <a @click="editDriver(item)" class="btn btn-warning shadow btn-xs sharp"><i class="fa fa-edit"></i></a>
                                  <a @click="deleteDriver(item)" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
                                </div>
                              </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>



										  
        

			
          </div>
        </div>
      </div>
    </div>
				
			</div>
 <ModalTarget/>
</template>

