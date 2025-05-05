<script setup>
import { ref, onMounted } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Imnportamos librerias
import VueTimepicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";

const user = ref(null)



const selectedRoute = ref("");
const selectedTruck = ref("");
const formSubmitted = ref(false);

const timeClockIn = ref("");
const timeLeaveYard = ref("");
const timeBackInYard = ref("");
const timeClockOut = ref("");
const startMiles = ref("");
const endMiles = ref("");
const fuel = ref("");
const notes = ref("");



// Revcu[eramos el usuario 
const storedUser = localStorage.getItem('USER');

if (storedUser) {
  try {
    const parsed = JSON.parse(storedUser)


    if(parsed.data.user) {
      user.value = parsed.data.user // ADMIN
    } else {
      user.value = parsed.data // DRIVER
    }

	console.log("USER desde localStorage:", user.value.id);

    
  } catch (e) {
    console.error('Error al parsear USER desde localStorage:', e)
  }

}

//


// Importamos el api
import CoverSheetAPI from '@/api/CoverSheetAPI.js'


// Import composables

import useSweetAlert2Notification from "@/composables/useSweetAlert2";
const { showSweetAlert, alertResult } = useSweetAlert2Notification();



// Importamos componentes
import Spinner from "@/components/Spinner.vue";

// Importamos Stores
import { useRoutesStore } from "@/stores/routes.js";
const storeRoute = useRoutesStore();

import { useTrucksStore } from "@/stores/trucks.js";
const storeTruck = useTrucksStore();

import { useDriversStore } from "@/stores/drivers.js";
const storeDriver = useDriversStore();



const currentDate = ref(
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

// Handle form submission
const handleSubmit = async() => {
 


const coverSheetData = ref({
    clockIn:"14:30:00" ,
    leaveYard: "15:30:00",
    backInYard: "19:30:00",
    clockOut:"20:30:00",
    startMiles:"23955",
    endMiles:"23990",
    fuel:"36.4",
    truck_id:"66fdb4372f47815048a3fc94",
    route_id:"6761d3599ca9ed59032e3888",
    driver_id:"6761d3989ca9ed59032e3889",
    date:"2025-05-11T21:00:00Z",
    notes:"Esta es una prueba"

})


  try {
	console.log("Coversheet data:", coverSheetData.value);
    // Call the API to save the coversheet
    const response = await CoverSheetAPI.add(coverSheetData.value);

	if(response.data.ok) {

			showSweetAlert({
        title: "General information saved successfully!",
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        return;
      });
	} else {	
		console.log("Ocurrio un error al guardar el coversheet");
	}


	// Handle the response as needed
	const object = {
	  clockIn: timeClockIn.value,
	  leaveYard: timeLeaveYard.value,
	  backInYard: timeBackInYard.value,
	  clockOut: timeClockOut.value,
	  startMiles: startMiles.value,
	  endMiles: endMiles.value,
	  fuel: fuel.value,
	  notes: notes.value,
	  route_id: selectedRoute.value,
	  truck_id: selectedTruck.value,
	  driver_id: user.value.id, // Assuming you have the driver ID from the user object
	}

    
    // Show success notification


    // Optionally reset the form
    resetForm();
  } catch (error) {
    // console.error("Error saving coversheet:", error);
 //   showToast("Failed to save CoverSheet. Please try again.", "error");
 console.log("Ocurrio un errro al guardar el coversheet", error);
  }
};

// Reset form after successful submission
const resetForm = () => {
  timeClockIn.value = "";
  timeLeaveYard.value = "";
  timeBackInYard.value = "";
  timeClockOut.value = "";
  startMiles.value = "";
  endMiles.value = "";
  fuel.value = "";
  notes.value = "";
  selectedRoute.value = "";
  selectedTruck.value = "";
  formSubmitted.value = false;
};



onMounted(() => {
  if (!sessionStorage.getItem('page_reloaded2')) {
    sessionStorage.setItem('page_reloaded2', 'true')
    window.location.reload()
  } else {
    sessionStorage.removeItem('page_reloaded2') // limpia para futuras visitas
  }

  const storedUser = localStorage.getItem('USER')

if (storedUser) {
  try {
    const parsed = JSON.parse(storedUser)


    if(parsed.data.user) {
      user.value = parsed.data.user // ADMIN
    } else {
      user.value = parsed.data // DRIVER
    }

    
  } catch (e) {
    console.error('Error al parsear USER desde localStorage:', e)
  }
}
})
</script>

<template>
  <div class="container-fluid">
    <div class="page-titles">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="javascript:void(0)">Bootstrap</a>
        </li>
        <li class="breadcrumb-item active">
          <a href="javascript:void(0)">Accordion</a>
        </li>
      </ol>
    </div>
    <!-- row -->
    <!-- Row starts -->

    <Spinner v-if="storeRoute.loading || storeTruck.loading" />

    <div class="col-lg-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">General Info</h4>
        </div>
        <div class="card-body">
          <div class="basic-form">

            <form @submit.prevent autocomplete="off">
              <div class="row">



                <div class="mb-3 col-md-4">
                  <label class="form-label">Current Date</label>
                  <div class="mt-2">
                    <label class="form-label" style="color:brown"> {{ currentDate }}</label>
                  </div>
                </div>
              </div>

			  <button type="button" @click="handleSubmit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Row ends -->
  </div>
</template>

