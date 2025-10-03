<script setup>
import { ref, onMounted } from "vue";
import { defineAsyncComponent } from "vue";

import { useRouter } from "vue-router"; // Importamos useRouter para manejar la redirección
const router = useRouter(); // Instanciamos el router

// Importamos utilidades
import { DateTime } from "luxon";
import { openModal } from "@kolirt/vue-modal";
import { ModalTarget } from "@kolirt/vue-modal";
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
const storeDriver = useDriversStore();

// Nuevo Composable para manejar la ordenación
const sortKey = ref(null);
const sortOrder = ref("asc");

const sortCoverSheetList = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }

  coverSheetList.value.sort((a, b) => {
    let valueA = a[key] || "";
    let valueB = b[key] || "";

    // Convert to number for truckNumber, otherwise treat as string
    if (key === "truckNumber") {
      valueA = parseInt(valueA, 10) || 0;
      valueB = parseInt(valueB, 10) || 0;
    } else if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (sortOrder.value === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

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
  if (event) {
    event.preventDefault();
  }

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
    const response = await CoverSheetAPI.allByDate(
      formatToYYYYMMDD(date.value)
    );

    const allCoversheets = response.data.data || [];

    const filters = {
      truck_id: selectedTruck.value || null,
      driver_id: selectedDriver.value || null,
    };

    if (selectedRoute.value) {
      const selectedRouteObj = storeRoute.routes.find(r => r.id === selectedRoute.value);
      if (selectedRouteObj) {
        const base = selectedRouteObj.routeNumber;
        const matchingRoutes = storeRoute.routes.filter(r => r.routeNumber.startsWith(base));
        filters.route_ids = matchingRoutes.map(r => r.id);
      } else {
        filters.route_ids = null;
      }
    } else {
      filters.route_ids = null;
    }

    coverSheetList.value = filterCoversheets(allCoversheets, filters);
  } catch (error) {
    console.error("Error al obtener CoverSheet:", error);
  }
};
// Abrir modal para ver el CoverSheet

const openCoverSheetModal = async (item) => {
  await openModal(
    defineAsyncComponent(() => import("@/components/CoverSheetModal.vue")),
    {
      item: item,
      onUpdateSuccess: SearchCoverSheet, // Pass the function
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

const EditCoverSheet = (item) => {};
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
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

const filterCoversheets = (coversheets, filters) => {
  return coversheets.filter((c) => {
    const matchRoute = !filters.route_ids || filters.route_ids.includes(c.route_id);
    const matchTruck = !filters.truck_id || c.truck_id === filters.truck_id;
    const matchDriver = !filters.driver_id || c.driver_id === filters.driver_id;
    return matchRoute && matchTruck && matchDriver;
  });
};

onMounted(() => {
  if (!sessionStorage.getItem("page_reloaded")) {
    sessionStorage.setItem("page_reloaded", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("page_reloaded"); // limpia para futuras visitas
  }

  SearchCoverSheet();
});
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
                  <VueDatePicker
                    v-model="date"
                    week-start="0"
                    :enable-time-picker="false"
                    :max-date="new Date()"
                    placeholder="Select Time"
                  >
                    <template #input-icon>
                      <img
                        class="input-slot-image"
                        src="../assets/icons/calendar.png"
                      />
                    </template>
                  </VueDatePicker>
                </div>
                <small v-if="errors.date_er" class="text-danger">{{
                  errors.date_er
                }}</small>
              </div>

              <div class="mb-3 col-md-3">
                <label class="form-label">Route #</label>
                <v-select
                  :options="storeRoute.routes"
                  v-model="selectedRoute"
                  placeholder="Choose Route"
                  :reduce="(route) => route.id"
                  label="routeNumber"
                  class="form-control p-0"
                  :class="{ 'is-invalid': formSubmitted && !selectedRoute }"
                />
                <small v-if="errors.route_er" class="text-danger">{{
                  errors.route_er
                }}</small>
              </div>

              <div class="mb-3 col-md-3">
                <label class="form-label">Truck #</label>
                <v-select
                  :options="storeTruck.trucks"
                  v-model="selectedTruck"
                  placeholder="Choose Truck"
                  :reduce="(truck) => truck.id"
                  label="truckNumber"
                  class="form-control p-0"
                  :class="{ 'is-invalid': formSubmitted && !selectedTruck }"
                />
                <small v-if="errors.truck_er" class="text-danger">{{
                  errors.truck_er
                }}</small>
              </div>

              <div class="mb-3 col-md-3">
                <label class="form-label">Driver</label>
                <v-select
                  :options="storeDriver.drivers"
                  v-model="selectedDriver"
                  placeholder="Choose Driver"
                  :reduce="(driver) => driver.id"
                  label="name"
                  class="form-control p-0"
                  :class="{ 'is-invalid': formSubmitted && !selectedDriver }"
                />
              </div>
            </div>

            <button
              style="margin-bottom: -5px !important"
              @click="SearchCoverSheet"
              type="button"
              class="btn btn-info"
            >
              Search CoverSheet
              <span class="btn-icon-end">
                <i class="fa fa-search"></i>
              </span>
            </button>

            <button
              style="margin-bottom: -5px !important; margin-left: 15px"
              @click="openNewCoverSheetModal"
              type="button"
              class="btn btn-primary"
            >
              New CoverSheet
              <span class="btn-icon-end">
                <i class="fa fa-table"></i>
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
            <div style="text-align: end; color:blueviolet">{{ coverSheetList.length}} rows</div>
              <hr style="color: black" />
              <div class="table-responsive">
                <table class="table table-bordered header-border table-striped table-hover table-responsive-md">
                  <thead class="thead-primary">
                    <tr>
                      <th>
                        <a
                          @click="sortCoverSheetList('driverName')"
                          style="
                            cursor: pointer;
                            text-decoration: none;
                            color: inherit;
                          "
                        >
                          Driver
                          <span v-if="sortKey === 'driverName'">
                            <i
                              v-if="sortOrder === 'asc'"
                              class="fa fa-sort-asc"
                            ></i>
                            <i v-else class="fa fa-sort-desc"></i>
                          </span>
                        </a>
                      </th>
                      <th>
                        <a
                          @click="sortCoverSheetList('routeNumber')"
                          style="
                            cursor: pointer;
                            text-decoration: none;
                            color: inherit;
                          "
                        >
                          Route #
                          <span v-if="sortKey === 'routeNumber'">
                            <i
                              v-if="sortOrder === 'asc'"
                              class="fa fa-sort-asc"
                            ></i>
                            <i v-else class="fa fa-sort-desc"></i>
                          </span>
                        </a>
                      </th>
                      <th>
                        <a
                          @click="sortCoverSheetList('truckNumber')"
                          style="
                            cursor: pointer;
                            text-decoration: none;
                            color: inherit;
                          "
                        >
                          Truck #
                          <span v-if="sortKey === 'truckNumber'">
                            <i
                              v-if="sortOrder === 'asc'"
                              class="fa fa-sort-asc"
                            ></i>
                            <i v-else class="fa fa-sort-desc"></i>
                          </span>
                        </a>
                      </th>
                      <th>Clock In</th>
                      <th>Leave Yard</th>
                      <th>Start Miles</th>
                      <th>Back In Yard</th>
                      <th>Clock Out</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in coverSheetList" :key="index">
                      <td class="td">{{ item.driverName }}</td>
                      <td class="td">{{ item.routeNumber }}</td>
                      <td class="td">{{ item.truckNumber }}</td>
                      <td class="td">{{ item.clockIn }}</td>
                      <td class="td">{{ item.leaveYard }}</td>
                      <td class="td">{{ item.startMiles }}</td>
                      <td class="td">{{ item.backInYard }}</td>
                      <td class="td">{{ item.clockOut }}</td>
                      <td class="td">{{ item.notes }}</td>
                      <td>
                        <div>
                          <a
                            @click="openCoverSheetModal(item)"
                            class="btn btn-primary shadow btn-xs sharp me-1"
                            ><i class="fa fa-eye"></i
                          ></a>
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
  <ModalTarget />
</template>

<style scoped>
.table-responsive {
  max-height: 600px;
  overflow-y: auto;
  display: block; /* Ensures the container behaves as a block */
}

.table-responsive thead th {
  position: sticky;
  top: 0;
  background-color: #6f42c1; /* Matches your purple header */
  color: white;
  z-index: 1; /* Ensures header stays above content */
}
</style>