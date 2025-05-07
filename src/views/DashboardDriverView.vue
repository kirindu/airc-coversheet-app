<script setup>
import { ref, onMounted } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Imnportamos librerias
import VueTimepicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";

const user = ref(null);

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

//

// Importamos el api
import CoverSheetAPI from "@/api/CoverSheetAPI.js";

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

  if (!timeClockIn.value || timeClockIn.value.endsWith("A")) {
    errors.value.clockIn_er = "Required field";
    hasError = true;
  }
  if (!timeLeaveYard.value || timeLeaveYard.value.endsWith("A")) {
    errors.value.leaveYard_er = "Required field";
    hasError = true;
  }
  if (!timeBackInYard.value || timeBackInYard.value.endsWith("A")) {
    errors.value.backInYard_er = "Required field";
    hasError = true;
  }
  if (!timeClockOut.value || timeClockOut.value.endsWith("A")) {
    errors.value.clockOut_er = "Required field";
    hasError = true;
  }
  if (!startMiles.value) {
    errors.value.startMiles_er = "Required field";
    hasError = true;
  }
  if (!endMiles.value) {
    errors.value.endMiles_er = "Required field";
    hasError = true;
  }
  if (!fuel.value) {
    errors.value.fuel_er = "Required field";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const coverSheetData = {
    clockIn: timeClockIn.value,
    leaveYard: timeLeaveYard.value,
    backInYard: timeBackInYard.value,
    clockOut: timeClockOut.value,
    startMiles: startMiles.value,
    endMiles: endMiles.value,
    fuel: fuel.value,
    truck_id: selectedTruck.value,
    route_id: selectedRoute.value,
    driver_id: user.value.id,
    // date:"2025-05-11T21:00:00Z",
    notes: notes.value,
  };

  try {
    // Call the API to save the coversheet
    const response = await CoverSheetAPI.add(coverSheetData);

    if (response.data.ok) {
      localStorage.setItem("COVERSHEET", JSON.stringify(response.data.data));

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
      showSweetAlert({
        title: "Error saving General Information!",
        icon: "warning",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        return;
      });
    }

    // Optionally reset the form
    //  resetForm();
  } catch (error) {
    showSweetAlert({
      title: "Error saving General Information!",
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
  if (!sessionStorage.getItem("page_reloaded2")) {
    sessionStorage.setItem("page_reloaded2", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("page_reloaded2"); // limpia para futuras visitas
  }

  // Cargamos los datos si el usuario es el mismo que el id del coversheet y si se encuentra en el mismo dia, sino
  //borramos todos los datos del localstorage

  let udser_id = user.value.id;
  let coversheet_id =
    JSON.parse(localStorage.getItem("COVERSHEET"))?.driver_id || null;

  if (udser_id !== coversheet_id) {
    localStorage.removeItem("COVERSHEET");
  } else {
    const date = new Date(JSON.parse(localStorage.getItem("COVERSHEET")).date);
    const today = new Date();
    if (
      date.getDate() !== today.getDate() ||
      date.getMonth() !== today.getMonth() ||
      date.getFullYear() !== today.getFullYear()
    ) {
      localStorage.removeItem("COVERSHEET");
    } else {
      const coversheet = JSON.parse(localStorage.getItem("COVERSHEET"));
      timeClockIn.value = coversheet.clockIn;
      timeLeaveYard.value = coversheet.leaveYard;
      timeBackInYard.value = coversheet.backInYard;
      timeClockOut.value = coversheet.clockOut;
      startMiles.value = coversheet.startMiles;
      endMiles.value = coversheet.endMiles;
      fuel.value = coversheet.fuel;
      notes.value = coversheet.notes;
      selectedRoute.value = coversheet.route_id;
      selectedTruck.value = coversheet.truck_id;
    }
  }

  // Si quieres mostrar una hora específica:
  //timeClockIn.value = convertToDate("05:02 PM")

  // Si quieres mostrar la hora actual:
  //   const now = new Date()
  //   const formattedTime = now.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   })
  //  timeClockIn.value = formattedTime

  // Si recuperamos el objeto que viene en un select , se lo pasamos directamente para que lo muestre en el input
  // selectedRoute.value = {
  //   id: "6802a8f922dd5e9980ae8c1f",
  //   routeNumber: "100",
  //   lob: "Front Load",
  //   active: true,
  //   createdAt: "2025-04-18T19:33:13.043000"
  // };
});

const convertToDate = (timeString) => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  // Construct the time string in "hh:mm A" format
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  return `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};
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
        <!-- <div class="card-header">
          <h4 class="card-title">General Info</h4>
        </div> -->
        <div class="card-body">
          <div class="basic-form">
            <form @submit="onSubmit" autocomplete="off">
              <div class="row">
                <div class="mb-3 col-md-4">
                  <label class="form-label">Route #</label>
                  <v-select
                    :options="storeRoute.routes"
                    v-model="selectedRoute"
                    placeholder="Choose your Route"
                    :reduce="(route) => route.id"
                    label="routeNumber"
                    class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedRoute }"
                  />
                  <small v-if="errors.route_er" class="text-danger">{{
                    errors.route_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-4">
                  <label class="form-label">Truck #</label>
                  <v-select
                    :options="storeTruck.trucks"
                    v-model="selectedTruck"
                    placeholder="Choose your Truck"
                    :reduce="(truck) => truck.id"
                    label="truckNumber"
                    class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedRoute }"
                  />
                  <small v-if="errors.truck_er" class="text-danger">{{
                    errors.truck_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-4">
                  <label class="form-label">Current Date</label>
                  <div class="mt-2">
                    <label class="form-label" style="color: brown">
                      {{ currentDate }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-2">
                  <label class="form-label" for="time-picker-clock-in"
                    >Clock In</label
                  >
                  <div class="mt-0">
                    <VueTimepicker
                      id="time-picker-clock-in"
                      v-model="timeClockIn"
                      format="hh:mm A"
                    />
                  </div>
                  <small v-if="errors.clockIn_er" class="text-danger">{{
                    errors.clockIn_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-2">
                  <label class="form-label" for="time-picker-leave-yard"
                    >Leave Yard</label
                  >
                  <div class="mt-0">
                    <VueTimepicker
                      id="time-picker-leave-yard"
                      v-model="timeLeaveYard"
                      format="hh:mm A"
                    />
                  </div>
                  <small v-if="errors.leaveYard_er" class="text-danger">{{
                    errors.leaveYard_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-2">
                  <label class="form-label" for="time-picker-back-in-yard"
                    >Back In Yard</label
                  >
                  <div class="mt-0">
                    <VueTimepicker
                      id="time-picker-back-in-yard"
                      v-model="timeBackInYard"
                      format="hh:mm A"
                    />
                  </div>
                  <small v-if="errors.backInYard_er" class="text-danger">{{
                    errors.backInYard_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-2">
                  <label class="form-label" for="time-picker-clock-out"
                    >Clock Out</label
                  >
                  <div class="mt-0">
                    <VueTimepicker
                      id="time-picker-clock-out"
                      v-model="timeClockOut"
                      format="hh:mm A"
                    />
                  </div>
                  <small v-if="errors.clockOut_er" class="text-danger">{{
                    errors.clockOut_er
                  }}</small>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-2">
                  <label class="form-label">Start Miles</label>
                  <input
                    type="number"
                    v-model="startMiles"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.startMiles_er" class="text-danger">{{
                    errors.startMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-2">
                  <label class="form-label">End Miles</label>
                  <input
                    type="number"
                    v-model="endMiles"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.endMiles_er" class="text-danger">{{
                    errors.endMiles_er
                  }}</small>
                </div>

                <div class="mb-3 col-md-2">
                  <label class="form-label">Fuel (cng)</label>
                  <input
                    type="number"
                    v-model="fuel"
                    class="form-control form-control-sm border border-primary"
                  />
                  <small v-if="errors.fuel_er" class="text-danger">{{
                    errors.fuel_er
                  }}</small>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-12">
                  <label class="form-label">Notes</label>
                  <textarea
                    v-model="notes"
                    class="form-control border border-primary"
                  ></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">
                Save CoverSheet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Row ends -->
    <!-- Formulario Spare Truck Info -->

    <div class="col-lg-12">
      <div class="card">

        <div class="card-body">
          <div class="basic-form">

            <form @submit="onSubmit2" autocomplete="off">
              <div class="row">

                <div class="accordion accordion-primary-solid" id="accordion-two">
								  <div class="accordion-item">
									<h2 class="accordion-header">
									  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#bordered_collapseOne">
										Spare Truck Info
									  </button>
									</h2>
									<div id="bordered_collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordion-two">
									  <div class="accordion-body">
										Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
									  </div>
									</div>
								  </div>
								  <div class="accordion-item">
									<h2 class="accordion-header">
									  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bordered_collapseTwo">
										Downtime
									  </button>
									</h2>
									<div id="bordered_collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordion-two">
									  <div class="accordion-body">
										 Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
									  </div>
									</div>
								  </div>
								  <div class="accordion-item">
									<h2 class="accordion-header">
									  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bordered_collapseThree">
										Load
									  </button>
									</h2>
									<div id="bordered_collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordion-two">
									  <div class="accordion-body">
											Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
										
									  </div>
									</div>
								  </div>
								</div>
    
              </div>


              <button type="submit" class="btn btn-primary">
                Save CoverSheet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
/* Bootstrap 5 integration for vue-select */
.v-select {
  font-size: 1rem;
}

.v-select .vs__dropdown-toggle {
  border: 1px solid #ced4da;
  border-radius: 0.375rem; /* Bootstrap rounded-md */
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
  font-size: 0.75rem; /* letras pequeñas */
}
</style>
