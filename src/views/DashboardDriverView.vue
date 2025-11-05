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

import { useHomeBasesStore } from "@/stores/homebase.js";
const storeHomeBase = useHomeBasesStore();


import { useLandFillsStore } from "@/stores/landfills";
const storeLandFill = useLandFillsStore();



import { useTrucksStore } from "@/stores/trucks.js";
const storeTruck = useTrucksStore();

import { useTrailersStore } from "@/stores/trailers.js";
const storeTrailer = useTrailersStore();


const user = ref(null);



// General Info
const selectedRoute = ref(""); // Considerar su borrado
const timeLeaveYard = ref(""); // Considerar su borrado
const timeBackInYard = ref(""); // Considerar su borrado
const startMiles = ref(""); // Considerar su borrado
const endMiles = ref(""); // Considerar su borrado



const selectedHomeBase = ref("");
const selectedTruck = ref("");
const selectedTrailer = ref("");

const timeClockIn = ref("");
const timeClockOut = ref("");
const trainee = ref("");

const timePreTripStart = ref("");
const timePreTripEnd = ref("");
const timePostTripStart = ref("");
const timePostTripEnd = ref("");

const truckStartMiles = ref(""); 
const truckEndMiles = ref(""); 
const truckStartHours = ref("");
const truckEndHours = ref("");

const trailerStartMiles = ref("");
const trailerEndMiles = ref("");
const fuel = ref("");
const dieselExhaustFluid = ref("");

const notes = ref("");

const formSubmitted = ref(false);
const isVisibleAcordion = ref(false);

const errors = ref({
  route_er: "", // Considerar su borrado
  leaveYard_er: "",// Considerar su borrado
  backInYard_er: "",// Considerar su borrado
  startMiles_er: "",// Considerar su borrado
  endMiles_er: "",// Considerar su borrado


  homebase_er: "",
  truck_er: "",
  trailer_er: "",
  clockIn_er: "",
  clockOut_er: "",
  trainee_er: "",
  preTripStart_er: "",
  preTripEnd_er: "",
  postTripStart_er: "",
  postTripEnd_er: "",
  truckStartMiles_er: "",
  truckEndMiles_er: "",
  truckStartHours_er: "",
  truckEndHours_er: "",
  trailerStartMiles_er: "",
  trailerEndMiles_er: "",
  fuel_er: "",
  dieselExhaustFluid_er: "",
  
});

// Modo de edición de la informaciongeneral para el coversheet
const isEditModeCoverShet = ref(false);



// Spare Truck Info

const spareTruckList = ref([]);
const isEditingSpareTruckInfo = ref(false); // To track if we are editing a spare truck record
const selectedSpareTruckId = ref(null); // To store the ID of the spare truck being edited

const selectedHomeBaseSpareTruckInfo = ref("");
const selectedTruckSpareTruckInfo = ref("");
const selectedTrailerSpareTruckInfo = ref("");


const timeLeaveYardSpareTruckInfo = ref("");
const timeBackInYardSpareTruckInfo = ref("");
const fuelSpareTruckInfo= ref("");
const dieselExhaustFluidSpareTruckInfo= ref("");
    
const truckStartMilesSpareTruckInfo = ref("");
const truckEndMilesSpareTruckInfo= ref("");
const truckStartHoursSpareTruckInfo= ref("");
const truckEndHoursSpareTruckInfo= ref("");

const trailerStartMilesSpareTruckInfo= ref("");
const trailerEndMilesSpareTruckInfo= ref("");



const isLoadingSpareTruckInfo = ref(false); // To show loading spinner when fetching spare truck info

// Si quieres mostrar la hora actual en el input de Spare Truck Info
// const timeLeaveYardSpareTruckInfo = ref({
//   hours: new Date().getHours(),
//   minutes: new Date().getMinutes()
// });

// Si quieres mostrar una hora determinada en el input de Spare Truck Info
// const timeLeaveYardSpareTruckInfo = ref({hours: 15, minutes: 26});

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


onMounted(() => {
  if (!sessionStorage.getItem("page_reloaded2")) {
    sessionStorage.setItem("page_reloaded2", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("page_reloaded2");
  }

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

  if (user.value) {

    if (user.value.rol === "Admin") {
      router.push({ name: 'dashboard-admin' }); // Redirigir al dashboard de Admin
    }

  }



  let user_id = user.value.id;
  let coversheet_driver_id = JSON.parse(localStorage.getItem("COVERSHEET"))?.driver_id || null;

  if (user_id !== coversheet_driver_id) {
    localStorage.removeItem("COVERSHEET");
  } else {
    // Parse the date from localStorage (assumed to be in UTC)
    const dbDate = DateTime.fromISO(JSON.parse(localStorage.getItem("COVERSHEET")).date, { zone: 'utc' });
    const today = DateTime.now(); // Current time

    // Convert both dates to Denver timezone for comparison
    const dbDateDenver = dbDate.setZone('America/Denver');
    const todayDenver = today.setZone('America/Denver');

    // Compare year, month, and day
    if (
      dbDateDenver.year !== todayDenver.year ||
      dbDateDenver.month !== todayDenver.month ||
      dbDateDenver.day !== todayDenver.day
    ) {
      localStorage.removeItem("COVERSHEET");
    } else {
      // Aqui esta la logica si el driver intenta entrar a un coversheet que ya tiene creado el mismo dia

      isEditModeCoverShet.value = true;
      const coversheet = JSON.parse(localStorage.getItem("COVERSHEET")); // Cargamos los datos del coversheet previamente guardado

      // timeLeaveYard.value = setTimeFromDB(coversheet.leaveYard);
      // timeBackInYard.value = setTimeFromDB(coversheet.backInYard);
      // startMiles.value = coversheet.startMiles;
      // endMiles.value = coversheet.endMiles;
      // selectedRoute.value = coversheet.route_id;
      // selectedRouteSpareTruckInfo.value = coversheet.route_id;
      // selectedRouteLoad.value = coversheet.route_id;

      selectedHomeBase.value = coversheet.homebase_id;
      selectedTruck.value = coversheet.truck_id;
      selectedTrailer.value = coversheet.trailer_id;

      timeClockIn.value = setTimeFromDB(coversheet.clockIn);
      timeClockOut.value = setTimeFromDB(coversheet.clockOut);
      trainee.value = coversheet.trainee;
      timePreTripStart.value = setTimeFromDB(coversheet.timePreTripStart);
      timePreTripEnd.value = setTimeFromDB(coversheet.timePreTripEnd);
      timePostTripStart.value = setTimeFromDB(coversheet.timePostTripStart);
      timePostTripEnd.value = setTimeFromDB(coversheet.timePostTripEnd);
      truckStartMiles.value = coversheet.truckStartMiles;
      truckEndMiles.value = coversheet.truckEndMiles;
      truckStartHours.value = coversheet.truckStartHours;
      truckEndHours.value = coversheet.truckEndHours;
      trailerStartMiles.value = coversheet.trailerStartMiles;
      trailerEndMiles.value = coversheet.trailerEndMiles;
      fuel.value = coversheet.fuel;
      dieselExhaustFluid.value = coversheet.dieselExhaustFluid;
      notes.value = coversheet.notes;
      
      
      


      selectedTruckDowntime.value = coversheet.truck_id;
      

      handleVisibleAcordion();
      loadSpareTruckInfo();
      loadDowntime();
      loadLoad();
    }
  }

  // Si recuperamos el objeto que viene en un select , se lo pasamos directamente para que lo muestre en el input
  // selectedRoute.value = {
  //   id: "6802a8f922dd5e9980ae8c1f",
  //   routeName: "100",
  //   lob: "Front Load",
  //   active: true,
  //   createdAt: "2025-04-18T19:33:13.043000"
  // };
});

// Metodos

// Handle form submission General Info
const onSubmit = async (event) => {
  event.preventDefault();
  formSubmitted.value = true;

  // Limpiar errores anteriores
  // errors.value.route_er = "";
    // errors.value.leaveYard_er = "";
  // errors.value.backInYard_er = "";
  // errors.value.startMiles_er = "";
  // errors.value.endMiles_er = "";


  errors.value.homebase_er = "";
  errors.value.truck_er = "";
  errors.value.trailer_er = "";
  errors.value.clockIn_er = "";
  errors.value.clockOut_er = "";
  errors.value.trainee_er = "";
  errors.value.preTripStart_er = "";
  errors.value.preTripEnd_er = "";
  errors.value.postTripStart_er = "";
  errors.value.postTripEnd_er = "";
  errors.value.truckStartMiles_er = "";
  errors.value.truckEndMiles_er = "";
  errors.value.truckStartHours_er = "";
  errors.value.truckEndHours_er = "";
  errors.value.trailerStartMiles_er = "";
  errors.value.trailerEndMiles_er = "";
  errors.value.fuel_er = "";
  errors.value.dieselExhaustFluid_er = "";
  
  
 

  let hasError = false;

  // if (!selectedRoute.value) {
  //   errors.value.route_er = "Required field";
  //   hasError = true;
  // }

  if (!selectedHomeBase.value) {
    errors.value.homebase_er = "Required field";
    hasError = true;
  }

  if (!selectedTruck.value) {
    errors.value.truck_er = "Required field";
    hasError = true;
  }

  if (!selectedTrailer.value) {
    errors.value.trailer_er = "Required field";
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

    homebase_id: selectedHomeBase.value,
    truck_id: selectedTruck.value,
    trailer_id: selectedTrailer.value,
    clockIn: formatTime(timeClockIn.value),
    clockOut: formatTime(timeClockOut.value) || "",
    trainee: trainee.value.toString() || "",
    timePreTripStart: formatTime(timePreTripStart.value) || "",
    timePreTripEnd: formatTime(timePreTripEnd.value) || "",
    timePostTripStart: formatTime(timePostTripStart.value) || "",
    timePostTripEnd: formatTime(timePostTripEnd.value) || "",
    truckStartMiles: truckStartMiles.value.toString() || "",
    truckEndMiles: truckEndMiles.value.toString() || "",
    truckStartHours: truckStartHours.value.toString() || "",
    truckEndHours: truckEndHours.value.toString() || "",
    trailerStartMiles: trailerStartMiles.value.toString() || "",
    trailerEndMiles: trailerEndMiles.value.toString() || "",
    fuel: fuel.value.toString() || "",
    dieselExhaustFluid: dieselExhaustFluid.value.toString() || "",


    // leaveYard: formatTime(timeLeaveYard.value) || "",
    // backInYard: formatTime(timeBackInYard.value) || "",
    // startMiles: startMiles.value.toString() || "",
    // endMiles: endMiles.value.toString() || "",
    // route_id: selectedRoute.value,

    
    driver_id: user.value.id,
    notes: notes.value,
    date: getDenverTimeAsUTCISOString(),
  };

  try {
    if (!isEditModeCoverShet.value) {
      const response = await CoverSheetAPI.add(coverSheetData);

      if (response.data.ok) {
        localStorage.setItem("COVERSHEET", JSON.stringify(response.data.data));
        const coversheet = JSON.parse(localStorage.getItem("COVERSHEET"));

        // selectedRouteSpareTruckInfo.value = coversheet.route_id;
        selectedTruckDowntime.value = coversheet.truck_id;
        // selectedRouteLoad.value = coversheet.route_id;

        isEditModeCoverShet.value = true;

        showSweetAlert({
          title: "General information saved successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isVisibleAcordion.value = true;
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
    } else {
      let coversheet_id = JSON.parse(localStorage.getItem("COVERSHEET"))?.id || null;
      const response = await CoverSheetAPI.edit(coversheet_id, coverSheetData);

      if (response.data.ok) {
        localStorage.setItem("COVERSHEET", JSON.stringify(response.data.data));
        const coversheet = JSON.parse(localStorage.getItem("COVERSHEET"));

        // selectedRouteSpareTruckInfo.value = coversheet.route_id;
        selectedTruckDowntime.value = coversheet.truck_id;
        // selectedRouteLoad.value = coversheet.route_id;

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


// Reset form after successful submission
const resetForm = () => {

  selectedHomeBase.value = "";
  selectedTruck.value = "";
  selectedTrailer.value = "";
  timeClockIn.value = "";
  timeClockOut.value = "";
  trainee.value = "";
  timePreTripStart.value = "";
  timePreTripEnd.value = "";
  timePostTripStart.value = "";
  timePostTripEnd.value = "";
  truckStartMiles.value = "";
  truckEndMiles.value = "";
  truckStartHours.value = "";
  truckEndHours.value = "";
  trailerStartMiles.value = "";
  trailerEndMiles.value = "";
  fuel.value = "";
  dieselExhaustFluid.value = "";
  notes.value = "";


  // timeLeaveYard.value = "";
  // timeBackInYard.value = "";
  // startMiles.value = "";
  // endMiles.value = "";
  // selectedRoute.value = "";
  
  formSubmitted.value = false;
};

// Reset Spare Truck Info form
const resetSpareTruckInfo = () => {
  spareTruckSpareTruckInfo.value = "";

  selectedRouteSpareTruckInfo.value = "";

  timeLeaveYardSpareTruckInfo.value = "";
  timeBackInYardSpareTruckInfo.value = "";

  startMilesSpareTruckInfo.value = ""
  endMilesSpareTruckInfo.value = "";
  fuelSpareTruckInfo.value = "";
  selectedSpareTruckId.value = null;

  isEditingSpareTruckInfo.value = false;

};

const resetDowntime = () => {

  timeStartTimeDowntime.value = "";
  timeEndTimeDowntime.value = "";
  downtimeReasonDowntime.value = "";

  selectedDowntimeId.value = null;

  isEditingDowntime.value = false;

};

const resetLoad = () => {
  selectedRouteLoad.value = "";
  timeFirstStopTimeLoad.value = "";
  timeLastStopTimeLoad.value = "";
  timeLandtFillTimeInLoad.value = "";
  timeLandFillTimeOutLoad.value = "";
  grossWeightLoad.value = "";
  tareWeightLoad.value = "";
  tonsLoad.value = "";
  selectedLandFillLoad.value = "";
  ticketNumberLoad.value = "";
  noteLoad.value = "";
  selectedImages.value = [];
  selectedFiles.value = []; // Clear files as well
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  isEditingLoad.value = false;
  selectedLoadId.value = null;
};

// Handle form submission Spare Truck Info (Add or Edit)
const HandleSpareTruckInfo = async (event) => {
  event.preventDefault();

  // Limpiar errores anteriores
  errorsSpareTruckInfo.value.spareTruckSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.routeSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.leaveYardSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.backInYardSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.startMilesSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.endMilesSpareTruckInfo_er = "";
  errorsSpareTruckInfo.value.fuelSpareTruckInfo_er = "";

  let hasError = false;

  if (!spareTruckSpareTruckInfo.value) {
    errorsSpareTruckInfo.value.spareTruckSpareTruckInfo_er = "Required field";
    hasError = true;
  }

  if (!selectedRouteSpareTruckInfo.value) {
    errorsSpareTruckInfo.value.routeSpareTruckInfo_er = "Required field";
    hasError = true;
  }

  if (!startMilesSpareTruckInfo.value) {
    errorsSpareTruckInfo.value.startMilesSpareTruckInfo_er = "Required field";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  let coversheet_id =
    JSON.parse(localStorage.getItem("COVERSHEET"))?.id || null;

  const spareTruckInfo = {
    spareTruckNumber: spareTruckSpareTruckInfo.value,
    route_id: selectedRouteSpareTruckInfo.value,

    leaveYard: formatTime(timeLeaveYardSpareTruckInfo.value) || "",
    backInYard: formatTime(timeBackInYardSpareTruckInfo.value) || "",

    startMiles: startMilesSpareTruckInfo.value.toString() || "",
    endMiles: endMilesSpareTruckInfo.value.toString() || "",
    fuel: fuelSpareTruckInfo.value.toString() || "",
    coversheet_id: coversheet_id,
  };

  try {
    if (isEditingSpareTruckInfo.value) {
      // Edit existing Spare Truck Info
      isLoadingSpareTruckInfo.value = true; // Show loading spinner
      const response = await SpareTruckInfoAPI.edit(selectedSpareTruckId.value, spareTruckInfo);

      if (response.data.ok) {
        showSweetAlert({
          title: "Spare Truck Info updated successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingSpareTruckInfo.value = false; // Hide loading spinner
          loadSpareTruckInfo();
          resetSpareTruckInfo();
        });
      } else {
        showSweetAlert({
          title: "Error updating Spare Truck Info!",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingSpareTruckInfo.value = false; // Hide loading spinner
        });
      }
    } else {
      // Add new Spare Truck Info
      isLoadingSpareTruckInfo.value = true; // Show loading spinner
      const response = await SpareTruckInfoAPI.add(spareTruckInfo);

      if (response.data.ok) {
        showSweetAlert({
          title: "Spare Truck Info saved successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingSpareTruckInfo.value = false; // Hide loading spinner
          loadSpareTruckInfo();
          resetSpareTruckInfo();
        });
      } else {
        showSweetAlert({
          title: "Error saving Spare Truck Info!",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingSpareTruckInfo.value = false; // Hide loading spinner
        });
      }
    }
  } catch (error) {
    showSweetAlert({
      title: isEditingSpareTruckInfo.value
        ? "Error updating Spare Truck Info!"
        : "Error saving Spare Truck Info!",
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

// Handle form submission Downtime
const HandleDowntime = async (event) => {
  event.preventDefault();

  // Limpiar errores anteriores

  errorsDowntime.value.selectedTruckDowntime_er = "";
  errorsDowntime.value.timeStartTimeDowntime_er = "";
  errorsDowntime.value.timeEndTimeDowntime_er = "";
  errorsDowntime.value.downtimeReasonDowntime_er = "";


  let hasError = false;

  if (!selectedTruckDowntime.value) {
    errorsDowntime.value.selectedTruckDowntime_er = "Required field";
    hasError = true;
  }

  if (!timeStartTimeDowntime.value) {
    errorsDowntime.value.timeStartTimeDowntime_er = "Required field";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  let coversheet_id = JSON.parse(localStorage.getItem("COVERSHEET"))?.id || null;

  const downtime = {
    truck_id: selectedTruckDowntime.value,
    startTime: formatTime(timeStartTimeDowntime.value),
    endTime: formatTime(timeEndTimeDowntime.value) || "",
    downtimeReason: downtimeReasonDowntime.value || "",
    coversheet_id: coversheet_id,
  };

  try {
    if (isEditingDowntime.value) {
      isLoadingDowntime.value = true; // Show loading spinner
      const response = await DowntimeAPI.edit(selectedDowntimeId.value, downtime);

      if (response.data.ok) {
        showSweetAlert({
          title: "Downtime updated successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingDowntime.value = false; // Hide loading spinner
          loadDowntime();
          resetDowntime();
        });
      } else {
        showSweetAlert({
          title: "Error updating Downtime!",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingDowntime.value = false; // Hide loading spinner
        });
      }
    } else {
      // Add new Downtime
      isLoadingDowntime.value = true; // Show loading spinner
      const response = await DowntimeAPI.add(downtime);

      if (response.data.ok) {
        showSweetAlert({
          title: "Downtime saved successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingDowntime.value = false; // Hide loading spinner
          loadDowntime();
          resetDowntime();
        });
      } else {
        showSweetAlert({
          title: "Error saving Downtime!",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingDowntime.value = false; // Hide loading spinner
        });
      }
    }
  } catch (error) {
    showSweetAlert({
      title: isEditingDowntime.value ? "Error updating Downtime!" : "Error saving Downtime!",
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

  if (hasError) {
    return;
  }

  let coversheet_id = JSON.parse(localStorage.getItem("COVERSHEET"))?.id || null;

  // Create a new FormData object
  const formData = new FormData();

  // Add form fields to FormData
  formData.append("route_id", selectedRouteLoad.value);
  formData.append("firstStopTime", formatTime(timeFirstStopTimeLoad.value));
  if (timeLastStopTimeLoad.value) formData.append("lastStopTime", formatTime(timeLastStopTimeLoad.value));
  if (timeLandtFillTimeInLoad.value) formData.append("landFillTimeIn", formatTime(timeLandtFillTimeInLoad.value));
  if (timeLandFillTimeOutLoad.value) formData.append("landFillTimeOut", formatTime(timeLandFillTimeOutLoad.value));
  if (grossWeightLoad.value) formData.append("grossWeight", grossWeightLoad.value.toString());
  if (tareWeightLoad.value) formData.append("tareWeight", tareWeightLoad.value.toString());
  if (tonsLoad.value) formData.append("tons", tonsLoad.value.toString());
  if (selectedLandFillLoad.value) formData.append("landFill_id", selectedLandFillLoad.value);
  if (ticketNumberLoad.value) formData.append("ticketNumber", ticketNumberLoad.value);
  if (noteLoad.value) formData.append("note", noteLoad.value);
  formData.append("coversheet_id", coversheet_id);

  // Append all selected files to FormData
  selectedFiles.value.forEach((file, index) => {
    formData.append("images", file, file.name); // Use "images" as the key
  });

  try {
    if (isEditingLoad.value) {
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
          loadLoad();
          resetLoad();
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
    } else {
      isLoadingLoad.value = true;
      const response = await LoadAPI.add(formData);

      if (response.data.ok) {
        showSweetAlert({
          title: "Load saved successfully!",
          icon: "success",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingLoad.value = false;
          loadLoad();
          resetLoad();
        });
      } else {
        showSweetAlert({
          title: "Error saving Load!",
          text: response.data.msg,
          icon: "warning",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then(() => {
          isLoadingLoad.value = false;
        });
      }
    }
  } catch (error) {
    showSweetAlert({
      title: isEditingLoad.value ? "Error updating Load!" : "Error saving Load!",
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


const EditSpareTruckInfo = (item) => {
  // Populate the form with the selected Spare Truck Info
  spareTruckSpareTruckInfo.value = item.spareTruckNumber;
  selectedRouteSpareTruckInfo.value = item.route_id;

  timeLeaveYardSpareTruckInfo.value = setTimeFromDB(item.leaveYard);

  timeBackInYardSpareTruckInfo.value = setTimeFromDB(item.backInYard);

  startMilesSpareTruckInfo.value = item.startMiles;
  endMilesSpareTruckInfo.value = item.endMiles;
  fuelSpareTruckInfo.value = item.fuel;

  // Set editing mode
  isEditingSpareTruckInfo.value = true;
  selectedSpareTruckId.value = item.id || item._id; // Ensure the ID is captured
};

const EditDowntime = (item) => {

  selectedTruckDowntime.value = item.truck_id;
  timeStartTimeDowntime.value = setTimeFromDB(item.startTime);
  timeEndTimeDowntime.value = setTimeFromDB(item.endTime);
  downtimeReasonDowntime.value = item.downtimeReason;

  // Set editing mode
  isEditingDowntime.value = true;
  selectedDowntimeId.value = item.id || item._id; // Ensure the ID is captured
};

const EditLoad = (item) => {

  selectedRouteLoad.value = item.route_id;
  timeFirstStopTimeLoad.value = setTimeFromDB(item.firstStopTime);

  timeLastStopTimeLoad.value = item.lastStopTime ? setTimeFromDB(item.lastStopTime) : "";
  timeLandtFillTimeInLoad.value = item.landFillTimeIn ? setTimeFromDB(item.landFillTimeIn) : "";
  timeLandFillTimeOutLoad.value = item.landFillTimeOut ? setTimeFromDB(item.landFillTimeOut) : "";
  grossWeightLoad.value = item.grossWeight ? item.grossWeight.toString() : "";
  tareWeightLoad.value = item.tareWeight ? item.tareWeight.toString() : "";
  tonsLoad.value = item.tons ? item.tons.toString() : "";
  selectedLandFillLoad.value = item.landFill_id ? item.landFill_id : "";
  ticketNumberLoad.value = item.ticketNumber ? item.ticketNumber : "";
  noteLoad.value = item.note ? item.note : "";


  // Set editing mode
  isEditingLoad.value = true;
  selectedLoadId.value = item.id || item._id; // Ensure the ID is captured
};

const loadSpareTruckInfo = async () => {
  const rawCoverSheet = localStorage.getItem("COVERSHEET");
  if (!rawCoverSheet) return;

  const coverSheet = JSON.parse(rawCoverSheet);
  const coverSheetId = coverSheet?.id || coverSheet?._id;

  if (!coverSheetId) return;

  try {
    const response = await CoverSheetAPI.getSpareTruckInfo(coverSheetId);
    spareTruckList.value = response.data.data || [];
  } catch (error) {
    console.error("Error al obtener SpareTruckInfo:", error);
  }
};

const loadDowntime = async () => {
  const rawCoverSheet = localStorage.getItem("COVERSHEET");
  if (!rawCoverSheet) return;



  const coverSheet = JSON.parse(rawCoverSheet);
  const coverSheetId = coverSheet?.id || coverSheet?._id;

  if (!coverSheetId) return;

  try {
    // Llamamos al API para obtener la lista de Downtime
    const response = await CoverSheetAPI.getDowntime(coverSheetId);
    downtimeList.value = response.data.data || [];
  } catch (error) {
    console.error("Error al obtener Downtime:", error);
  }
};

const loadLoad = async () => {
  const rawCoverSheet = localStorage.getItem("COVERSHEET");
  if (!rawCoverSheet) return;



  const coverSheet = JSON.parse(rawCoverSheet);
  const coverSheetId = coverSheet?.id || coverSheet?._id;

  if (!coverSheetId) return;

  try {
    // Llamamos al API para obtener la lista de Downtime
    const response = await CoverSheetAPI.getLoad(coverSheetId);
    loadList.value = response.data.data || [];
  } catch (error) {
    console.error("Error al obtener Load:", error);
  }
};

const handleVisibleAcordion = async () => {
  const rawCoverSheet = localStorage.getItem("COVERSHEET");
  if (!rawCoverSheet) return;

  isVisibleAcordion.value = true
};

// Function to handle file change
const handleFileChange = (event) => {
  if (!event.target.files.length || event.target.files[0]?.type.indexOf("image/") !== 0) {
    showSweetAlert({
      title: "Camera Error",
      text: "Unable to access the camera. Please ensure permissions are granted or select an image from the gallery.",
      icon: "warning",
      allowOutsideClick: false,
    });
    return;
  }

  const files = Array.from(event.target.files); // Convert FileList to Array
  const newImages = [];

  for (let file of files) {
    if (file.size > 3145728) {
      showSweetAlert({
        title: "Image with excess size!",
        text: `You cannot upload the image ${file.name}, the maximum allowed is 3Mb`,
        icon: "warning",
        allowOutsideClick: false,
      }).then(() => {
        fileInput.value.value = "";
        selectedImages.value = [];
        selectedFiles.value = []; // Clear files as well
      });
      return;
    }
    newImages.push({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Create URL for preview
    });
  }

  if (newImages.length + selectedImages.value.length > 15) {
    showSweetAlert({
      title: "Upload not completed!",
      text: "At most you can add up to 15 images.",
      icon: "warning",
      allowOutsideClick: false,
    }).then(() => {
      fileInput.value.value = "";
    });
    return;
  }

  // Append new files and images
  selectedFiles.value = [...selectedFiles.value, ...files];
  selectedImages.value = [...selectedImages.value, ...newImages];

  // Clear the file input to allow new selections
  fileInput.value.value = "";
};

const removeImage = (index) => {
  selectedImages.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
};

// Metodos Utilitarios

const currentDate = ref(
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

// Edit Spare Truck Info
const formatTime = (controlTimeValue) => {
  if (!controlTimeValue) {
    return "";
  }

  const hours = String(controlTimeValue.hours).padStart(2, "0");
  const minutes = String(controlTimeValue.minutes).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Function to set time from a database string (e.g., "14:36")
const setTimeFromDB = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    return { hours, minutes };
  }
};

// Método para manejar el logout
const logout = () => {
  localStorage.removeItem('USER') // Eliminamos la variable USER del localStorage
  localStorage.removeItem('COVERSHEET2') // Eliminamos la variable COVERSHEET2 del localStorage
  router.push({ name: 'login' }) // Redirigimos al usuario a la página de login
}


const getDenverTimeAsUTCISOString = () => {
  const now = DateTime.now().setZone('America/Denver'); // Get current time in Denver
  return now.toUTC().toISO(); // Convert to UTC and return ISO string
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

    <Spinner v-if="storeHomeBase.loading || storeTruck.loading" />

    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="basic-form">

            <form @submit="onSubmit" autocomplete="off">

              <div class="row">


                <div class="mb-3 col-md-3">
                  <label class="form-label">HomeBase</label>
                  <v-select :options="storeHomeBase.homebases" v-model="selectedHomeBase"
                    placeholder="Choose your HomeBase" :reduce="(homebase) => homebase.id" label="homeBaseName"
                    class="form-control p-0" :class="{ 'is-invalid': formSubmitted && !selectedHomeBase }" />
                  <small v-if="errors.homebase_er" class="text-danger">{{
                    errors.homebase_er
                    }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck #</label>
                  <v-select :options="storeTruck.trucks" v-model="selectedTruck" placeholder="Choose your Truck"
                    :reduce="(truck) => truck.id" label="truckNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedTruck }" />
                  <small v-if="errors.truck_er" class="text-danger">{{
                    errors.truck_er
                    }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Trailer #</label>
                  <v-select :options="storeTrailer.trailers" v-model="selectedTrailer" placeholder="Choose your Trailer"
                    :reduce="(trailer) => trailer.id" label="trailerNumber" class="form-control p-0"
                    :class="{ 'is-invalid': formSubmitted && !selectedTrailer }" />
                  <small v-if="errors.trailer_er" class="text-danger">{{
                    errors.trailer_er
                    }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Current Date</label>
                  <div class="mt-2">
                    <label class="form-label" style="color: brown">
                      {{ currentDate }}
                    </label>
                  </div>
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

                       <div class="mb-3 col-md-6">
                  <label class="form-label">Trainee</label>
                  <input type="text" v-model="trainee" class="form-control form-control-lg border border-primary"
                    style="color: black;" />
                  <small v-if="errors.trainee_er" class="text-danger">{{ errors.trainee_er }}</small>
                </div>

          

             



                <!-- <div class="mb-3 col-md-3">
                  <label class="form-label">DEF</label>
                  <input type="number" step="any" v-model="dieselExhaustFluid"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.dieselExhaustFluid_er" class="text-danger">{{ errors.dieselExhaustFluid_er
                    }}</small>
                </div> -->


              </div>

                  <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Pre Trip Start</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timePreTripStart" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.preTripStart_er" class="text-danger">{{
                    errors.preTripStart_er
                    }}</small>
                </div>



                <div class="mb-3 col-md-3">
                  <label class="form-label">Pre Trip End</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timePreTripEnd" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.preTripEnd_er" class="text-danger">{{
                    errors.preTripEnd_er
                    }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Post Trip Start</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timePostTripStart" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.postTripStart_er" class="text-danger">{{
                    errors.postTripStart_er
                    }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Post Trip End</label>
                  <div class="mt-0">
                    <VueDatePicker v-model="timePostTripEnd" time-picker placeholder="Select Time">
                      <template #input-icon>
                        <img class="input-slot-image" src="../assets/icons/clock2.png" />
                      </template>
                    </VueDatePicker>
                  </div>
                  <small v-if="errors.postTripEnd_er" class="text-danger">{{
                    errors.postTripEnd_er
                    }}</small>
                </div>

          

         



              </div>



              <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck Start Miles</label>
                  <input type="number" step="any" v-model="truckStartMiles"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.truckStartMiles_er" class="text-danger">{{ errors.truckStartMiles_er }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck End Miles</label>
                  <input type="number" step="any" v-model="truckEndMiles"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.truckEndMiles_er" class="text-danger">{{ errors.truckEndMiles_er }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck Start Hours</label>
                  <input type="number" step="any" v-model="truckStartHours"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.truckStartHours_er" class="text-danger">{{ errors.truckStartHours_er }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Truck End Hours</label>
                  <input type="number" step="any" v-model="truckEndHours"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.truckEndHours_er" class="text-danger">{{ errors.truckEndHours_er }}</small>
                </div>



              </div>

               <div class="row">
                <div class="mb-3 col-md-3">
                  <label class="form-label">Trailer Start Miles</label>
                  <input type="number" step="any" v-model="trailerStartMiles"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.trailerStartMiles_er" class="text-danger">{{ errors.trailerStartMiles_er }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">Trailer End Miles</label>
                  <input type="number" step="any" v-model="trailerEndMiles"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.trailerEndMiles_er" class="text-danger">{{ errors.trailerEndMiles_er }}</small>
                </div>


                <div class="mb-3 col-md-3">
                  <label class="form-label">Fuel</label>
                  <input type="number" step="any" v-model="fuel"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.fuel_er" class="text-danger">{{ errors.fuel_er }}</small>
                </div>

                <div class="mb-3 col-md-3">
                  <label class="form-label">DEF</label>
                  <input type="number" step="any" v-model="dieselExhaustFluid"
                    class="form-control form-control-lg border border-primary" style="color: black;" />
                  <small v-if="errors.dieselExhaustFluid_er" class="text-danger">{{ errors.dieselExhaustFluid_er }}</small>
                </div>


              </div>

              <div class="row">
                <div class="mb-3 col-md-12">
                  <label class="form-label">Notes</label>
                  <textarea style="color: black;" v-model="notes" class="form-control border border-primary"></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">
                {{ isEditModeCoverShet ? "Update CoverSheet" : "Start CoverSheet" }}
              </button>

              <button style="margin-left: 20px;" class="btn btn-secondary" @click.prevent="logout">
                Finalize CoverSheet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isVisibleAcordion" class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="basic-form">
            <form autocomplete="off">





              <div class="row">

                <div class="accordion accordion-primary-solid" id="accordion-two">

                  <Spinner v-if="isLoadingSpareTruckInfo" />


                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#bordered_collapseOne">
                        Spare Truck Info
                      </button>
                    </h2>

                    <Spinner v-if="storeHomeBase.loading || storeTruck.loading" />


                    <div id="bordered_collapseOne" class="accordion-collapse collapse show"
                      data-bs-parent="#accordion-two">
                      <div class="accordion-body">

                        <div class="row">

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Spare # </label>
                            <input type="text" v-model="spareTruckSpareTruckInfo"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="
                              errorsSpareTruckInfo.spareTruckSpareTruckInfo_er
                            " class="text-danger">{{
                              errorsSpareTruckInfo.spareTruckSpareTruckInfo_er
                            }}</small>
                          </div>

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Route #</label>
                            <v-select :options="storeRoute.routes" v-model="selectedRouteSpareTruckInfo"
                              placeholder="Choose your Route" :reduce="(route) => route.id" label="routeName"
                              class="form-control p-0" :class="{
                                'is-invalid': formSubmitted && !selectedRoute,
                              }" />
                            <small v-if="errorsSpareTruckInfo.routeSpareTruckInfo_er" class="text-danger">{{
                              errorsSpareTruckInfo.routeSpareTruckInfo_er
                              }}</small>
                          </div>

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Start Miles</label>
                            <input type="number" step="any" v-model="startMilesSpareTruckInfo"
                              class="form-control form-control-lg border border-primary" style="color: black;" />
                            <small v-if="errorsSpareTruckInfo.startMilesSpareTruckInfo_er"
                              class="text-danger">{{ errorsSpareTruckInfo.startMilesSpareTruckInfo_er }}</small>
                          </div>



                          <div class="mb-3 col-md-3">
                            <label class="form-label">End Miles</label>
                            <input type="number" step="any" v-model="endMilesSpareTruckInfo"
                              class="form-control form-control-lg border border-primary" style="color: black;" />
                            <small v-if="errorsSpareTruckInfo.endMilesSpareTruckInfo_er"
                              class="text-danger">{{ errorsSpareTruckInfo.endMilesSpareTruckInfo_er }}</small>
                          </div>


                        </div>

                        <div class="row">

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Fuel</label>
                            <input type="number" step="any" v-model="fuelSpareTruckInfo"
                              class="form-control form-control-lg border border-primary" style="color: black;" />
                            <small v-if="errorsSpareTruckInfo.fuelSpareTruckInfo_er"
                              class="text-danger">{{ errorsSpareTruckInfo.fuelSpareTruckInfo_er }}</small>
                          </div>


                          <div class="mb-3 col-md-3">
                            <label class="form-label">Leave Yard</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeLeaveYardSpareTruckInfo" time-picker
                                placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="
                              errorsSpareTruckInfo.leaveYardSpareTruckInfo_er
                            " class="text-danger">{{
                              errorsSpareTruckInfo.leaveYardSpareTruckInfo_er
                            }}</small>
                          </div>

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Back In Yard</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeBackInYardSpareTruckInfo" time-picker
                                placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="
                              errorsSpareTruckInfo.backInYardSpareTruckInfo_er
                            " class="text-danger">{{
                              errorsSpareTruckInfo.backInYardSpareTruckInfo_er
                            }}</small>
                          </div>

                          <div class="mb-4 col-md-3 align-self-end">


                            <button :disabled="isLoadingSpareTruckInfo" style="margin-bottom: -5px !important;"
                              @click="HandleSpareTruckInfo" type="button" class="btn btn-info">
                              {{ isEditingSpareTruckInfo ? "Save" : "Add" }}
                              <span class="btn-icon-end">
                                <i :class="isEditingSpareTruckInfo ? 'fa fa-save' : 'fa fa-plus'"></i>
                              </span>
                            </button>



                          </div>
                        </div>

                        <div class="row">
                          <hr style="color: black" />
                          <div class="table-responsive">
                            <table
                              class="table table-bordered header-border table-striped table-hover table-responsive-md">
                              <thead class="thead-primary">
                                <tr>
                                  <!-- <th style="width:50px;"></th> -->
                                  <th>Spare #</th>
                                  <th>Route #</th>
                                  <th>Start Miles</th>
                                  <th>End Miles</th>
                                  <th>Fuel</th>
                                  <th>Leave Yard</th>
                                  <th>Back in Yard</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in spareTruckList" :key="index">
                                  <!-- <td></td> -->
                                  <td class="td">
                                    {{ item.spareTruckNumber }}
                                  </td>
                                  <td class="td">{{ item.routeName }}</td>
                                  <td class="td">{{ item.startMiles }}</td>
                                  <td class="td">{{ item.endMiles }}</td>
                                  <td class="td">{{ item.fuel }}</td>
                                  <td class="td">{{ item.leaveYard }}</td>
                                  <td class="td">{{ item.backInYard }}</td>
                                  <td>
                                    <div>
                                      <a @click="EditSpareTruckInfo(item)"
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

                  <Spinner v-if="isLoadingDowntime" />
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#bordered_collapseTwo">
                        Downtime
                      </button>
                    </h2>
                    <div id="bordered_collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordion-two">
                      <div class="accordion-body">


                        <div class="row">



                          <div class="mb-3 col-md-3">
                            <label class="form-label">Truck #</label>
                            <v-select :options="storeTruck.trucks" v-model="selectedTruckDowntime"
                              placeholder="Choose your Truck" :reduce="(truck) => truck.id" label="truckNumber"
                              class="form-control p-0"
                              :class="{ 'is-invalid': formSubmitted && !selectedTruckDowntime }" />
                            <small v-if="errorsDowntime.selectedTruckDowntime_er"
                              class="text-danger">{{ errorsDowntime.selectedTruckDowntime_er }}</small>
                          </div>

                          <div class="mb-3 col-md-3">
                            <label class="form-label">Start Time</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeStartTimeDowntime" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsDowntime.timeStartTimeDowntime_er"
                              class="text-danger">{{ errorsDowntime.timeStartTimeDowntime_er }}</small>
                          </div>

                          <div class="mb-3 col-md-3">
                            <label class="form-label">End Time</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeEndTimeDowntime" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsDowntime.timeEndTimeDowntime_er"
                              class="text-danger">{{ errorsDowntime.timeEndTimeDowntime_er }}</small>
                          </div>



                        </div>



                        <div class="row">







                          <div class="mb-3 col-md-9">
                            <label class="form-label">Downtime Reason</label>
                            <input type="text" v-model="downtimeReasonDowntime"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsDowntime.downtimeReasonDowntime_er"
                              class="text-danger">{{ errorsDowntime.downtimeReasonDowntime_er }}</small>
                          </div>

                          <div class="mb-4 col-md-3 align-self-end">



                            <button :disabled="isLoadingDowntime" style="margin-bottom: -7px !important;"
                              @click="HandleDowntime" type="button" class="btn btn-info">
                              {{ isEditingDowntime ? "Save" : "Add" }}
                              <span class="btn-icon-end">
                                <i :class="isEditingDowntime ? 'fa fa-save' : 'fa fa-plus'"></i>
                              </span>
                            </button>


                          </div>





                        </div>




                        <div class="row">
                          <hr style="color: black" />
                          <div class="table-responsive">
                            <table
                              class="table table-bordered header-border table-striped table-hover table-responsive-md">
                              <thead class="thead-primary">
                                <tr>
                                  <!-- <th style="width:50px;"></th> -->
                                  <th>Truck #</th>
                                  <th>Start Time #</th>
                                  <th>End Time</th>
                                  <th>Dowtime Reason</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in downtimeList" :key="index">
                                  <!-- <td></td> -->
                                  <td class="td">{{ item.truckNumber }}</td>
                                  <td class="td">{{ item.startTime }}</td>
                                  <td class="td">{{ item.endTime }}</td>
                                  <td class="td">{{ item.downtimeReason }}</td>
                                  <td>
                                    <div>
                                      <a @click="EditDowntime(item)" class="btn btn-primary shadow btn-xs sharp me-1"><i
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

                  <Spinner v-if="isLoadingLoad" />

                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#bordered_collapseThree">
                        Load
                      </button>
                    </h2>
                    <div id="bordered_collapseThree" class="accordion-collapse collapse"
                      data-bs-parent="#accordion-two">
                      <div class="accordion-body">
                        <div class="row">
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Route #</label>
                            <v-select :options="storeRoute.routes" v-model="selectedRouteLoad"
                              placeholder="Choose your Route" :reduce="(route) => route.id" label="routeName"
                              class="form-control p-0" :class="{ 'is-invalid': formSubmitted && !selectedRouteLoad }" />
                            <small v-if="errorsLoad.selectedRouteLoad_er"
                              class="text-danger">{{ errorsLoad.selectedRouteLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Ticket #</label>
                            <input type="text" v-model="ticketNumberLoad"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsLoad.ticketNumberLoad_er"
                              class="text-danger">{{ errorsLoad.ticketNumberLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">First Stop Time</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeFirstStopTimeLoad" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsLoad.timeFirstStopTimeLoad_er"
                              class="text-danger">{{ errorsLoad.timeFirstStopTimeLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Last Stop Time</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeLastStopTimeLoad" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsLoad.timeLastStopTimeLoad_er"
                              class="text-danger">{{ errorsLoad.timeLastStopTimeLoad_er }}</small>
                          </div>
                        </div>
                        <div class="row">
                          <div class="mb-3 col-md-6">
                            <label class="form-label">Landfill</label>
                            <v-select :options="storeLandFill.landfills" v-model="selectedLandFillLoad"
                              placeholder="Choose your Landfill" :reduce="(landfill) => landfill.id"
                              label="landfillName" class="form-control p-0"
                              :class="{ 'is-invalid': formSubmitted && !selectedLandFillLoad }" />
                            <small v-if="errorsLoad.selectedLandFillLoad_er"
                              class="text-danger">{{ errorsLoad.selectedLandFillLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Landfill Time In</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeLandtFillTimeInLoad" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsLoad.timeLandFillTimeInLoad_er"
                              class="text-danger">{{ errorsLoad.timeLandFillTimeInLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Landfill Time Out</label>
                            <div class="mt-0">
                              <VueDatePicker v-model="timeLandFillTimeOutLoad" time-picker placeholder="Select Time">
                                <template #input-icon>
                                  <img class="input-slot-image" src="../assets/icons/clock2.png" />
                                </template>
                              </VueDatePicker>
                            </div>
                            <small v-if="errorsLoad.timeLandFillTimeOutLoad_er"
                              class="text-danger">{{ errorsLoad.timeLandFillTimeOutLoad_er }}</small>
                          </div>
                        </div>
                        <div class="row">
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Gross Weight</label>
                            <input type="number" step="any" v-model="grossWeightLoad"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsLoad.grossWeightLoad_er"
                              class="text-danger">{{ errorsLoad.grossWeightLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Tare Weight</label>
                            <input type="number" step="any" v-model="tareWeightLoad"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsLoad.tareWeightLoad_er"
                              class="text-danger">{{ errorsLoad.tareWeightLoad_er }}</small>
                          </div>
                          <div class="mb-3 col-md-3">
                            <label class="form-label">Tons</label>
                            <input type="number" step="any" v-model="tonsLoad"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsLoad.tonsLoad_er" class="text-danger">{{ errorsLoad.tonsLoad_er }}</small>
                          </div>
                        </div>

                        <div class="row d-flex align-items-center">


                          <div class="mb-3 col-md-9">
                            <!-- <label class="form-label">Images</label> -->

                            <input v-show="false" type="file" ref="fileInput"
                              class="form-control form-control-sm border border-primary" multiple accept="image/*"
                              capture="environment" @change="handleFileChange"
                              style="height: 38px; padding: 0.375rem 0.75rem;" />

                            <button @click.prevent="fileInput.click()" style="height: 50px;" type="button"
                              class="btn btn-primary btn-rounded btn-sm">Add Photos<span class="btn-icon-end"><i
                                  class="fa fa-camera"></i></span>
                            </button>


                            <div v-if="selectedImages.length > 0" class="row mt-2">
                              <div v-for="(image, index) in selectedImages" :key="index" class="col-md-3">
                                <img :src="image.url" alt="Preview" style="max-width: 100px; margin-bottom: 10px;" />
                                <p>{{ image.name }} ({{ (image.size / 1024).toFixed(2) }} KB)</p>
                                <button @click.prevent="removeImage(index)"
                                  class="btn btn-danger btn-xs">Remove</button>
                              </div>
                            </div>
                            <!-- <button
            v-if="selectedImages.length > 0"
            @click.prevent="fileInput.click()"
            class="btn btn-secondary"
            style="height: 38px; margin-left: 10px;"
          >
            Capture Another
          </button> -->
                            <small v-if="errorsLoad.imageLoad_er"
                              class="text-danger">{{ errorsLoad.imageLoad_er }}</small>
                          </div>


                          <div style="margin-bottom: -10px !important;" class="mb-0 col-md-3 d-flex">
                            <button :disabled="isLoadingLoad" @click="HandleLoad" type="button" class="btn btn-info"
                              style="height: 38px; padding: 0.375rem 0.75rem;">
                              {{ isEditingLoad ? "Save" : "Add" }}
                              <span class="btn-icon-end">
                                <i :class="isEditingLoad ? 'fa fa-save' : 'fa fa-plus'"></i>
                              </span>
                            </button>
                          </div>
                        </div>

                        <div class="row">

                          <div class="mb-3 col-md-12">
                            <label class="form-label">Note</label>
                            <input type="text" v-model="noteLoad"
                              class="form-control form-control-sm border border-primary" />
                            <small v-if="errorsLoad.noteLoad_er" class="text-danger">{{ errorsLoad.noteLoad_er }}</small>
                          </div>


                        </div>

                        <div class="row">
                          <hr style="color: black" />
                          <div class="table-responsive">
                            <table
                              class="table table-bordered header-border table-striped table-hover table-responsive-md">
                              <thead class="thead-primary">
                                <tr>
                                  <th>Route #</th>
                                  <th>First Stop Time</th>
                                  <th>Last Stop Time</th>
                                  <th>Landfill Time In</th>
                                  <th>Landfill Time Out</th>
                                  <th>Gross Weight</th>
                                  <th>Tare Weight</th>
                                  <th>Tons</th>
                                  <th>Landfill</th>
                                  <th>Ticket #</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in loadList" :key="index">
                                  <td class="td">{{ item.routeName }}</td>
                                  <td class="td">{{ item.firstStopTime }}</td>
                                  <td class="td">{{ item.lastStopTime }}</td>
                                  <td class="td">{{ item.landFillTimeIn }}</td>
                                  <td class="td">{{ item.landFillTimeOut }}</td>
                                  <td class="td">{{ item.grossWeight }}</td>
                                  <td class="td">{{ item.tareWeight }}</td>
                                  <td class="td">{{ item.tons }}</td>
                                  <td class="td">{{ item.landfillName }}</td>
                                  <td class="td">{{ item.ticketNumber }}</td>
                                  <td>
                                    <div>
                                      <a @click="EditLoad(item)" class="btn btn-primary shadow btn-xs sharp me-1"><i
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