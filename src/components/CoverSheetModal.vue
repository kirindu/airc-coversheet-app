<script setup>
//Importaciones de sistemas y librerias
import { ref, toRefs, computed, watch, onMounted } from "vue";
import { closeModal, confirmModal } from "@kolirt/vue-modal";
import { useRouter } from "vue-router";
const router = useRouter();

// Importamos componentes
import Spinner from "@/components/Spinner.vue";

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


// Importamos Stores
import { useRoutesStore } from "@/stores/routes.js";
const storeRoute = useRoutesStore();

import { useLandFillsStore } from "@/stores/landfills";
const storeLandFill = useLandFillsStore();



import { useTrucksStore } from "@/stores/trucks.js";
const storeTruck = useTrucksStore();

import { useDriversStore } from "@/stores/drivers.js";
import { is } from "@vee-validate/rules";

const user = ref(null);

// Props
const props = defineProps({
  item: {
    type: Object,
  },
});

// Con esto hacemos los props reactivos
const reactiveProps = toRefs(props);


// General Info
const selectedRoute = ref("");
const selectedTruck = ref("");

const date = ref(new Date());

const timeClockIn = ref("");
const timeLeaveYard = ref("");
const timeBackInYard = ref("");
const timeClockOut = ref("");

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

// Spare Truck Info

const spareTruckList = ref([]);
const isEditingSpareTruckInfo = ref(false); // To track if we are editing a spare truck record
const selectedSpareTruckId = ref(null); // To store the ID of the spare truck being edited

const spareTruckSpareTruckInfo = ref("");
const selectedRouteSpareTruckInfo = ref("");

const timeLeaveYardSpareTruckInfo = ref("");
const timeBackInYardSpareTruckInfo = ref("");

const startMilesSpareTruckInfo = ref("");
const endMilesSpareTruckInfo = ref("");
const fuelSpareTruckInfo = ref("");

const isLoadingSpareTruckInfo = ref(false); // To show loading spinner when fetching spare truck info

const errorsSpareTruckInfo = ref({
  spareTruckSpareTruckInfo_er: "",
  routeSpareTruckInfo_er: "",
  leaveYardSpareTruckInfo_er: "",
  backInYardSpareTruckInfo_er: "",
  startMilesSpareTruckInfo_er: "",
  endMilesSpareTruckInfo_er: "",
  fuelSpareTruckInfo_er: "",
});

// Downtime

const downtimeList = ref([]);
const isEditingDowntime = ref(false); // To track if we are editing a downtime record
const selectedDowntimeId = ref(null); // To store the ID of the downtime being edited

const selectedTruckDowntime = ref("");
const timeStartTimeDowntime = ref("");
const timeEndTimeDowntime = ref("");
const downtimeReasonDowntime = ref("");

const isLoadingDowntime = ref(false); // To show loading spinner when fetching downtime info

const errorsDowntime = ref({
  selectedTruckDowntime_er: "",
  timeStartTimeDowntime_er: "",
  timeEndTimeDowntime_er: "",
  downtimeReasonDowntime_er: "",
});


// Load

const formData = new FormData();
const selectedFiles = ref([]); // Store File objects for FormData
const selectedImages = ref([]);
const fileInput = ref(null);

const loadList = ref([]);
const isEditingLoad = ref(false); // To track if we are editing a load record
const selectedLoadId = ref(null); // To store the ID of the load being edited



const timeFirstStopTimeLoad = ref("");
const selectedRouteLoad = ref("");
const timeLastStopTimeLoad = ref("");
const timeLandtFillTimeInLoad = ref("");
const timeLandFillTimeOutLoad = ref("");
const grossWeightLoad = ref("");
const tareWeightLoad = ref("");
const tonsLoad = ref("");
const selectedLandFillLoad = ref("");
const ticketNumberLoad = ref("");
const noteLoad = ref("");
const imageLoad = ref([]);

const isLoadingLoad = ref(false); // To show loading spinner when fetching load info


const errorsLoad = ref({
selectedRouteLoad_er:"",
timeFirstStopTimeLoad_er:"",
timeLastStopTimeLoad_er:"", 
timeLandFillTimeInLoad_er:"",
timeLandFillTimeOutLoad_er:"",
grossWeightLoad_er:"",
tareWeightLoad_er:"",
tonsLoad_er:"",
selectedLandFillLoad_er:"",
ticketNumberLoad_er:"",
noteLoad_er:"",
imageLoad_er: "",
});

// Handle form submission General Info
const onSubmit = async (event) => {
  event.preventDefault();
  formSubmitted.value = true;

  // Limpiar errores anteriores
  errors.value.route_er = "";
  errors.value.truck_er = "";
  errors.value.clockIn_er = "";
  errors.value.leaveYard_er = "";
  errors.value.backInYard_er = "";
  errors.value.clockOut_er = "";
  errors.value.startMiles_er = "";
  errors.value.endMiles_er = "";
  errors.value.fuel_er = "";

  let hasError = false;

  if (!selectedRoute.value) {
    errors.value.route_er = "Required field";
    hasError = true;
  }

  if (!selectedTruck.value) {
    errors.value.truck_er = "Required field";
    hasError = true;
  }

  if (!timeClockIn.value) {
    errors.value.clockIn_er = "Required field";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const coverSheetData = {
    clockIn: formatTime(timeClockIn.value),
    leaveYard: formatTime(timeLeaveYard.value) || "",
    backInYard: formatTime(timeBackInYard.value) || "",
    clockOut: formatTime(timeClockOut.value) || "",

    startMiles: startMiles.value.toString() || "",
    endMiles: endMiles.value.toString() || "",
    fuel: fuel.value.toString() || "",
    truck_id: selectedTruck.value,
    route_id: selectedRoute.value,
    driver_id: user.value.id,
    notes: notes.value,
    date: getDenverTimeAsUTCISOString(),
  };

  try {

      let coversheet_id = JSON.parse(localStorage.getItem("COVERSHEET"))?.id || null;
      const response = await CoverSheetAPI.edit(coversheet_id, coverSheetData);

      if (response.data.ok) {
        localStorage.setItem("COVERSHEET", JSON.stringify(response.data.data));
        const coversheet = JSON.parse(localStorage.getItem("COVERSHEET"));

        selectedRouteSpareTruckInfo.value = coversheet.route_id;
        selectedTruckDowntime.value = coversheet.truck_id;
        selectedRouteLoad.value = coversheet.route_id;

        showSweetAlert({
          title: "General information edited successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          return;
        });
      } else {
        showSweetAlert({
          title: "Error editing General Information!",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          return;
        });
      }
    
  } catch (error) {
    showSweetAlert({
      title: "Error editing General Information!",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then(() => {
      return;
    });
  }
};



</script>


<template>


    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="basic-form">

            <form @submit="onSubmit" autocomplete="off">

              <div class="row">


                <div class="mb-3 col-md-4">
                  <label class="form-label">Route #</label>
                  <v-select :options="storeRoute.routes" v-model="selectedRoute" placeholder="Choose your Route"
                    :reduce="(route) => route.id" label="routeNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedRoute }" />
                  <small v-if="errors.route_er" class="text-danger">{{
                    errors.route_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-4">
                  <label class="form-label">Truck #</label>
                  <v-select :options="storeTruck.trucks" v-model="selectedTruck" placeholder="Choose your Truck"
                    :reduce="(truck) => truck.id" label="truckNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedTruck }" />
                  <small v-if="errors.truck_er" class="text-danger">{{
                    errors.truck_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-4">


                  <label class="form-label">Date</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="date" :enable-time-picker="false"  placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/calendar.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.date_er" class="text-danger">{{
                    errors.date_er
                  }}</small>

   
                </div>

              </div>

              <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Clock In</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timeClockIn" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.clockIn_er" class="text-danger">{{
                    errors.clockIn_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Leave Yard</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timeLeaveYard" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.leaveYard_er" class="text-danger">{{
                    errors.leaveYard_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Back In Yard</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timeBackInYard" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.backInYard_er" class="text-danger">{{
                    errors.backInYard_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Clock Out</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timeClockOut" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.clockOut_er" class="text-danger">{{
                    errors.clockOut_er
                  }}</small>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Start Miles</label>
                  <input type="number" v-model="startMiles"
                    class="form-control form-control-sm border border-primary" />
                  <small v-if="errors.startMiles_er" class="text-danger">{{
                    errors.startMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">End Miles</label>
                  <input type="number" v-model="endMiles" class="form-control form-control-sm border border-primary" />
                  <small v-if="errors.endMiles_er" class="text-danger">{{
                    errors.endMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Fuel</label>
                  <input type="number" v-model="fuel" class="form-control form-control-sm border border-primary" />
                  <small v-if="errors.fuel_er" class="text-danger">{{
                    errors.fuel_er
                  }}</small>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-12">
                  <label class="form-label">Notes</label>
                  <textarea v-model="notes" class="form-control border border-primary"></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">
                Update CoverSheet
              </button>

   
            </form>
          </div>
        </div>
      </div>
    </div>


</template>

<style scoped>
.input-slot-image {
  height: 20px;
  width: auto;
  margin-left: 5px;
}

.v-select {
  font-size: 1rem;
}

.v-select .vs__dropdown-toggle {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  min-height: 38px;
}

.v-select .vs__selected,
.v-select .vs__search {
  margin: 0;
  padding: 0;
}

.v-select .vs__search {
  line-height: 1.5;
  padding-left: 0.25rem;
}

.v-select .vs__dropdown-menu {
  border: 1px solid #ced4da;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
}

.v-select .vs__dropdown-option--highlight {
  background-color: #0d6efd;
  color: white;
}

.text-danger {
  color: red;
  font-size: 0.75rem;
}

.td {
  color: black;
}

/* Ajustes para alinear verticalmente */
.form-control-sm {
  min-height: 38px !important;
  padding: 0.375rem 0.75rem !important;
}

.btn-info {
  min-height: 38px !important;
  padding: 0.375rem 0.75rem !important;
}
</style>