<script setup>
//Importaciones de sistemas y librerias
import { ref, toRefs, computed, watch, onMounted, defineEmits } from "vue";
import { closeModal, confirmModal } from "@kolirt/vue-modal";
import { useRouter } from "vue-router";
const router = useRouter();

// Importamos componentes
import Spinner from "@/components/Spinner.vue";

// Importamos utilidades
import { DateTime } from "luxon";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Escuchamos eventos
// const emit = defineEmits(['update-success'])

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
import DriverAPI from "@/api/DriverAPI";

const user = ref(null);

// Props
const props = defineProps({
  item: {
    type: Object,
  }
});

// Con esto hacemos los props reactivos
const reactiveProps = toRefs(props);

// Driver
const driverName = ref("");
const driverEmail = ref("");
const driverPassword = ref("");

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

const errorsDriver = ref({
  name_er: "",
  email_er: "",
  password_er: "",
});

// Spare Truck Info

const spareTruckList = ref([]);
const selectedSpareTruckId = ref(null); // To store the ID of the spare truck being edited

const isVisibleSpareTruckInfo = ref(false);

const visibleDetailSpareTruckInfo = ref(false); // To control visibility of the Spare Truck Info section

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
const selectedDowntimeId = ref(null); // To store the ID of the downtime being edited

const isVisibleDowntime = ref(false);

const visibleDetailDowntime = ref(false); // To control visibility of the Downtime section

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
const selectedLoadData = ref(null);
const fileInput = ref(null);

const visibleDetailLoad = ref(false); // To control visibility of the Load section

const loadList = ref([]);
const selectedLoadId = ref(null); // To store the ID of the load being edited

const isVisibleLoad = ref(false);

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
  selectedRouteLoad_er: "",
  timeFirstStopTimeLoad_er: "",
  timeLastStopTimeLoad_er: "",
  timeLandFillTimeInLoad_er: "",
  timeLandFillTimeOutLoad_er: "",
  grossWeightLoad_er: "",
  tareWeightLoad_er: "",
  tonsLoad_er: "",
  selectedLandFillLoad_er: "",
  ticketNumberLoad_er: "",
  noteLoad_er: "",
  imageLoad_er: "",
});

// Handle form for adding a new driver
const onSubmit = async (event) => {
  event.preventDefault();
  formSubmitted.value = true;

  // Limpiar errores anteriores

  errorsDriver.value.name_er = "";
  errorsDriver.value.email_er = ""; 
  errorsDriver.value.password_er = "";

  let hasError = false;

  if (!driverName.value) {
    errorsDriver.value.name_er = "Required field";
    hasError = true;
  }
  if (!driverEmail.value) {
    errorsDriver.value.email_er = "Required field";
    hasError = true;
  }
  if (!driverPassword.value) {
    errorsDriver.value.password_er = "Required field";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const driverData = {
    name: driverName.value,
    email: driverEmail.value,
    password: driverPassword.value,
  };


  try {

    const response = await DriverAPI.add(driverData);

    if (response.data.ok) {
      showSweetAlert({
        title: "Driver added successfully!",
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        closeModal(); // Close the modal after successful addition
      });
    } else {
      showSweetAlert({
        title: "Error adding Driver!",
        icon: "warning",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        return;
      });
    }

   // let coversheet_id = reactiveProps.item.value.id;
    // const response = await CoverSheetAPI.edit(coversheet_id, coverSheetData);

    // if (response.data.ok) {
    //   localStorage.setItem("COVERSHEET", JSON.stringify(response.data.data));
    //   const coversheet = JSON.parse(localStorage.getItem("COVERSHEET"));

    //   selectedRouteSpareTruckInfo.value = coversheet.route_id;
    //   selectedTruckDowntime.value = coversheet.truck_id;
    //   selectedRouteLoad.value = coversheet.route_id;

    //   showSweetAlert({
    //     title: "General information edited successfully!",
    //     icon: "success",
    //     showDenyButton: false,
    //     showCancelButton: false,
    //     confirmButtonText: "Ok",
    //     allowOutsideClick: false,
    //   })
      // .then(() => {
      //   props.onUpdateSuccess();
      //   return;
      // })
      ;
    // } else {
    //   showSweetAlert({
    //     title: "Error editing General Information!",
    //     icon: "warning",
    //     showDenyButton: false,
    //     showCancelButton: false,
    //     confirmButtonText: "Ok",
    //     allowOutsideClick: false,
    //   }).then(() => {
    //     return;
    //   });
    // }
  } catch (error) {
    showSweetAlert({
      title: "Error adding Driver!",
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

// Una vez que se complete el mounted pintamos los campos con su informacion
onMounted(async () => {
  // Cargamos el CoverSheet

  selectedRoute.value = reactiveProps.item.value.route_id;
  selectedTruck.value = reactiveProps.item.value.truck_id;
  date.value = DateTime.fromISO(reactiveProps.item.value.date).toJSDate();

  timeClockIn.value = setTimeFromDB(reactiveProps.item.value.clockIn);

  timeLeaveYard.value = setTimeFromDB(reactiveProps.item.value.leaveYard);
  timeBackInYard.value = setTimeFromDB(reactiveProps.item.value.backInYard);
  timeClockOut.value = setTimeFromDB(reactiveProps.item.value.clockOut);

  startMiles.value = reactiveProps.item.value.startMiles;
  endMiles.value = reactiveProps.item.value.endMiles;
  fuel.value = reactiveProps.item.value.fuel;
  notes.value = reactiveProps.item.value.notes;

  // Cargando Spare Truck Info si existe

  await CargamosSpareTruckInfo(); // Invoke the function
  // Cargando Downtime si existe
  await CargamosDowntime(); // Invoke the function
  // Cargando Load si existe
  await CargamosLoad(); // Invoke the function
});

const CargamosSpareTruckInfo = async (event = null) => {
  // Default event to null
  if (event) {
    event.preventDefault(); // Only call preventDefault if event exists
  }

  try {
    if (reactiveProps.item.value.spareTruckInfo_id?.length) {
      isLoadingSpareTruckInfo.value = true;
      isVisibleSpareTruckInfo.value = true; // Show the Spare Truck Info section
      const response = await CoverSheetAPI.getSpareTruckInfo(
        reactiveProps.item.value.id
      );

      spareTruckList.value = response.data.data; // Update the spare truck list with the fetched data

      if (response.data.ok) {
        isLoadingSpareTruckInfo.value = false; // Hide loading spinner
      } else {
        isLoadingSpareTruckInfo.value = false; // Hide loading spinner
      }
    } else {
      isLoadingSpareTruckInfo.value = false;
      isVisibleSpareTruckInfo.value = false;
    }
  } catch (error) {
    showSweetAlert({
      title: "Error getting Spare Truck Info!",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then(() => {
      isLoadingSpareTruckInfo.value = false; // Hide loading spinner
    });
  }
};

const CargamosDowntime = async (event = null) => {
  // Default event to null
  if (event) {
    event.preventDefault(); // Only call preventDefault if event exists
  }

  try {
    if (reactiveProps.item.value.downtime_id?.length) {
      isLoadingDowntime.value = true;
      isVisibleDowntime.value = true; // Show the Downtime section
      const response = await CoverSheetAPI.getDowntime(
        reactiveProps.item.value.id
      );
      downtimeList.value = response.data.data; // Update the downtime list with the fetched data

      if (response.data.ok) {
        isLoadingDowntime.value = false; // Hide loading spinner
      } else {
        isLoadingDowntime.value = false; // Hide loading spinner
      }
    } else {
      isLoadingDowntime.value = false;
      isVisibleDowntime.value = false;
    }
  } catch (error) {
    showSweetAlert({
      title: "Error getting Downtime!",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then(() => {
      isLoadingDowntime.value = false; // Hide loading spinner
    });
  }
};

const CargamosLoad = async () => {
  try {
    // Llamamos al API para obtener la lista de Downtime
    const response = await CoverSheetAPI.getLoad(reactiveProps.item.value.id);
    loadList.value = response.data.data || [];

    if (response.data.data.length > 0) {
      isVisibleLoad.value = true; // Show the Load section
    } else {
      isVisibleLoad.value = false; // Hide the Load section if no data
    }
  } catch (error) {
    console.error("Error al obtener Load:", error);
  }
};



// Handle form submission for Load
const HandleLoad = async (event) => {
  event.preventDefault();

  // Clear previous errors
  errorsLoad.value.selectedRouteLoad_er = "";
  errorsLoad.value.timeFirstStopTimeLoad_er = "";
  errorsLoad.value.timeLastStopTimeLoad_er = "";
  errorsLoad.value.timeLandFillTimeInLoad_er = "";
  errorsLoad.value.timeLandFillTimeOutLoad_er = "";
  errorsLoad.value.grossWeightLoad_er = "";
  errorsLoad.value.tareWeightLoad_er = "";
  errorsLoad.value.tonsLoad_er = "";
  errorsLoad.value.selectedLandFillLoad_er = "";
  errorsLoad.value.ticketNumberLoad_er = "";
  errorsLoad.value.noteLoad_er = "";
  errorsLoad.value.imageLoad_er = "";

  let hasError = false;

  if (!selectedRouteLoad.value) {
    errorsLoad.value.selectedRouteLoad_er = "Required field";
    hasError = true;
  }

  if (!timeFirstStopTimeLoad.value) {
    errorsLoad.value.timeFirstStopTimeLoad_er = "Required field";
    hasError = true;
  }

  // if (hasError) {
  //   return;
  // }

      if (hasError) {
          showSweetAlert({
        title: "Select a record from the table to edit it!",
        icon: "warning",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        return;
      });
      return
  }

  // Create a new FormData object
  const formData = new FormData();

  // Add form fields to FormData
  formData.append("route_id", selectedRouteLoad.value);
  formData.append("firstStopTime", formatTime(timeFirstStopTimeLoad.value));
  if (timeLastStopTimeLoad.value)
    formData.append("lastStopTime", formatTime(timeLastStopTimeLoad.value));
  if (timeLandtFillTimeInLoad.value)
    formData.append(
      "landFillTimeIn",
      formatTime(timeLandtFillTimeInLoad.value)
    );
  if (timeLandFillTimeOutLoad.value)
    formData.append(
      "landFillTimeOut",
      formatTime(timeLandFillTimeOutLoad.value)
    );
  if (grossWeightLoad.value)
    formData.append("grossWeight", grossWeightLoad.value.toString());
  if (tareWeightLoad.value)
    formData.append("tareWeight", tareWeightLoad.value.toString());
  if (tonsLoad.value) formData.append("tons", tonsLoad.value.toString());
  if (selectedLandFillLoad.value)
    formData.append("landFill_id", selectedLandFillLoad.value);
  if (ticketNumberLoad.value)
    formData.append("ticketNumber", ticketNumberLoad.value);
  if (noteLoad.value) formData.append("note", noteLoad.value);
  // formData.append("coversheet_id", coversheet_id);

  // Append all selected files to FormData
  selectedFiles.value.forEach((file, index) => {
    formData.append("images", file, file.name); // Use "images" as the key
  });

  try {
    isLoadingLoad.value = true;
    const response = await LoadAPI.edit(selectedLoadId.value, formData);

    if (response.data.ok) {
      showSweetAlert({
        title: "Load updated successfully!",
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        isLoadingLoad.value = false;
        CargamosLoad(); // Refresh the Load list
      });
    } else {
      showSweetAlert({
        title: "Error updating Load!",
        icon: "warning",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        isLoadingLoad.value = false;
      });
    }
  } catch (error) {
    showSweetAlert({
      title: isEditingLoad.value
        ? "Error updating Load!"
        : "Error saving Load!",
      text: error.response?.data?.msg || "An error occurred",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then(() => {
      isLoadingLoad.value = false;
    });
    console.error("Error al enviar Load:", error);
  }
};

// Utility functions

// Function to set time from a database string (e.g., "14:36")
const setTimeFromDB = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    return { hours, minutes };
  }
};

const formatTime = (controlTimeValue) => {
  if (!controlTimeValue) {
    return "";
  }

  const hours = String(controlTimeValue.hours).padStart(2, "0");
  const minutes = String(controlTimeValue.minutes).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getDenverTimeAsUTCISOString = () => {
  const now = DateTime.now().setZone("America/Denver"); // Get current time in Denver
  return now.toUTC().toISO(); // Convert to UTC and return ISO string
};

const logout = () => {
  localStorage.removeItem("USER"); // Eliminamos la variable USER del localStorage
  localStorage.removeItem('COVERSHEET2') // Eliminamos la variable COVERSHEET2 del localStorage
  router.push({ name: "login" }); // Redirigimos al usuario a la página de login
};

const downloadImage = (imageUrl) => {
  const link = document.createElement("a");
  link.href = "https://backend-fastapi-coversheet.onrender.com/" + imageUrl;
  link.target = "_blank"; // Open in new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="container-fluid">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-header">
        Add Driver
          <button
            @click.prevent="closeModal"
            type="submit"
            class="btn-close"
            aria-label="Close"
          ></button>
        </div>
        <div class="card-body">
          <div class="basic-form">
            <form @submit="onSubmit" autocomplete="off">

         

         

              <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Name</label>
                  <input
                    type="text"
                    v-model="startMiles"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.startMiles_er" class="text-danger">{{
                    errors.startMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Email</label>
                  <input
                    type="text"
                    v-model="endMiles"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.endMiles_er" class="text-danger">{{
                    errors.endMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    v-model="fuel"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.fuel_er" class="text-danger">{{
                    errors.fuel_er
                  }}</small>
                </div>
              </div>


              <button type="submit" class="btn btn-primary">
                Add Driver
              </button>

              <button
                @click.prevent="closeModal"
                style="margin-left: 20px"
                type="submit"
                class="btn btn-danger"
              >
                Close
              </button>
            </form>
          </div>
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
