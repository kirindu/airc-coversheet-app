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


const startMiles = ref("");
const endMiles = ref("");
const fuel = ref("");
const notes = ref("");

const formSubmitted = ref(false);
const isVisibleAcordion = ref(false);

const errors = ref({
  route_er: "",
  truck_er: "",
  clockIn_er: "",
  leaveYard_er: "",
  backInYard_er: "",
  clockOut_er: "",
  startMiles_er: "",
  endMiles_er: "",
  fuel_er: "",
});

// Modo de edición de la informaciongeneral para el coversheet
const isEditModeCoverShet = ref(false);


const SearchCoverSheet = async (event) => {
  event.preventDefault();


    try {
    const response = await CoverSheetAPI.all();
    coverSheetList.value = response.data.data || [];
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
                  <small v-if="errors.clockIn_er" class="text-danger">{{
                    errors.clockIn_er
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
                                  <th>Driver</th>
                                  <th>Truck #</th>
                                  <th>Route #</th>
                                  <th>Notes</th>
								   <th>Action</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in coverSheetList" :key="index">

                                  <td class="td">{{ item.driverName }}</td>
                                  <td class="td">{{ item.truckNumber }}</td>
                                  <td class="td">{{ item.routeNumber }}</td>
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