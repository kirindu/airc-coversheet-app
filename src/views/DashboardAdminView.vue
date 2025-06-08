<script setup>
import { ref, onMounted } from "vue";

import { useRouter } from 'vue-router' // Importamos useRouter para manejar la redirección
const router = useRouter() // Instanciamos el router

// Importamos utilidades
import { DateTime } from "luxon";

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

// Importamos Stores
import { useRoutesStore } from "@/stores/routes.js";
const storeRoute = useRoutesStore();

import { useLandFillsStore } from "@/stores/landfills";
const storeLandFill = useLandFillsStore();

import { useTrucksStore } from "@/stores/trucks.js";
const storeTruck = useTrucksStore();

import { useDriversStore } from "@/stores/drivers.js";
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


const formSubmitted = ref(false);

const errors = ref({
  date_er: "",

});

// Modo de edición de la informaciongeneral para el coversheet
const isEditModeCoverShet = ref(false);


const SearchCoverSheet = async (event) => {
  event.preventDefault();

    // Limpiar errores anteriores
  errors.value.date_er = "";
  let hasError = false;

    if (!date.value) {
    errors.value.date_er = "Required field";
    hasError = true;
  }
  
    if (hasError) {
    return;
  }


    try {
      
    const response = await CoverSheetAPI.allByDate(formatToYYYYMMDD(date.value));

    const allCoversheets = response.data.data || [];


    const filters = {
  route_id: selectedRoute.value || null,
  truck_id: selectedTruck.value || null,
  driver_id: selectedDriver.value || null
};



    // coverSheetList.value = response.data.data || [];

    coverSheetList.value = filterCoversheets(allCoversheets, filters);





  } catch (error) {
    console.error("Error al obtener CoverSheet:", error);
  }

}



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

const filterCoversheets = (coversheets, filters) =>{
  return coversheets.filter(c => {
    const matchRoute = !filters.route_id || c.route_id === filters.route_id;
    const matchTruck = !filters.truck_id || c.truck_id === filters.truck_id;
    const matchDriver = !filters.driver_id || c.driver_id === filters.driver_id;
    return matchRoute && matchTruck && matchDriver;
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

    <Spinner v-if="storeRoute.loading || storeTruck.loading" />

<!--
    <div class="col-lg-12">

              

              <nav class="navbar navbar-expand-lg navbar-light" style="background-color:peru;">
              
  <div class="container-fluid">

  <div class="row">
    
    <div class="collapse navbar-collapse" id="navbarScroll">
      <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Link
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Link</a>
        </li>
      </ul>
     
    </div>
  </div>
  </div>
</nav>

       







			

    </div>

<br>
-->
    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="basic-form">
          
            <!-- <form @submit="onSubmit" autocomplete="off"> -->

              <div class="row">

			                  <div class="mb-3 col-md-3">
                  <label class="form-label">Date</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="date" :enable-time-picker="false" :max-date="new Date()" placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/calendar.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.date_er" class="text-danger">{{
                    errors.date_er
                  }}</small>
                </div>


                <div class="mb-3 col-md-3">
                  <label class="form-label">Route #</label>
                  <v-select :options="storeRoute.routes" v-model="selectedRoute" placeholder="Choose Route"
                    :reduce="(route) => route.id" label="routeNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedRoute }" />
                  <small v-if="errors.route_er" class="text-danger">{{
                    errors.route_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck #</label>
                  <v-select :options="storeTruck.trucks" v-model="selectedTruck" placeholder="Choose Truck"
                    :reduce="(truck) => truck.id" label="truckNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedTruck }" />
                  <small v-if="errors.truck_er" class="text-danger">{{
                    errors.truck_er
                  }}</small>
                </div>

				          <div class="mb-3 col-md-3">
                  <label class="form-label">Driver</label>
                  <v-select :options="storeDriver.drivers" v-model="selectedDriver" placeholder="Choose Driver"
                    :reduce="(driver) => driver.id" label="name" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedDriver }" />
                  
                </div>

       

              </div>



										  
                            <button style="margin-bottom: -5px !important;" @click="SearchCoverSheet" type="button" class="btn btn-info">
                              Search CoverSheet
                              <span class="btn-icon-end">
                                <i class= 'fa fa-save'></i>
                              </span>
                            </button>


              <!-- <button type="submit" class="btn btn-primary">
                Search
              </button> -->

            <!-- </form> -->

			
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
                                  <th>Route #</th>         
                                  <th>Truck #</th>
                                  <th>Driver</th>
                                  
                                  <th>Notes</th>
								   <th>Action</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in coverSheetList" :key="index">

                                  <td class="td">{{ item.routeNumber }}</td>
                                  <td class="td">{{ item.truckNumber }}</td>
                                  <td class="td">{{ item.driverName }}</td>
                          
                                  <td class="td">{{ item.notes }}</td>
                        
                                  <td>
								  
                                    <div>
									        <a @click="EditCoverSheet(item)"
                                        class="btn btn-primary shadow btn-xs sharp me-1"><i
                                          class="fa fa-eye"></i></a>
                                      <a @click="EditCoverSheet(item)"
                                        class="btn btn-primary shadow btn-xs sharp me-1"><i
                                          class="fa fa-pencil"></i></a>
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
 
</template>