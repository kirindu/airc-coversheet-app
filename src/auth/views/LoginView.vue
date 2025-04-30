<script setup>
//Importaciones de sistemas y librerias
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Importamos el api
import UserAPI from "@/api/UserAPI";

// Importamos componentes
import Spinner from "@/components/Spinner.vue";

// Import composables
import useToastNotification from "@/composables/useToast";
const { showToast } = useToastNotification();

// Reactividad
const loading = ref(false);
const rol = ref('Driver')  // valor por defecto

// Validaciones
import { useForm } from "vee-validate";
import * as yup from "yup";

const {
  defineField,
  errors,
  handleSubmit,
  resetForm,
  setFieldValue,
  setValues,
  meta,
} = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
});

const [email, emailAttrs] = defineField("email", {
  validateOnModelUpdate: false,
}); // Con validateOnModelUpdate validamos despues de hacerle click afuera al campo si queremos
const [password, passwordAttrs] = defineField("password", {
  validateOnModelUpdate: false,
});

// Metodos
const onSubmit = handleSubmit(async (values, { resetForm }) => {
  loading.value = true;
  try {

    if (rol.value === 'Driver') {
      const { data } = await UserAPI.loginDriver({
      email: values.email,
      password: values.password,
   });

   if(data.ok) {
     localStorage.setItem("USER", JSON.stringify(data));
     router.push({name: 'dashboard'});
  }

    } else if (rol.value === 'Admin') {
      const { data } = await UserAPI.loginAdmin({
        email: values.email,
        password: values.password,
      });

      if(data.ok) {
        localStorage.setItem("USER", JSON.stringify(data));
        router.push({name: 'dashboard-admin'});
     }
    } 


  } catch (error) {
    const data = error.response.data.msg;
    showToast({
      message: data,
      type: "error",
      position: "top",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }

  resetForm(); // Limpiamos el formulario una ves realizado el submit
});




</script>

<template>
  <div class="authincation d-flex flex-column flex-lg-row flex-column-fluid">
    <div
      class="login-aside text-center d-none d-sm-flex flex-column flex-row-auto"
    >
      <div class="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
        <div class="text-center mb-4 pt-5">
          <a href="index.html" class="brand-logo">
            <img
              fetchpriority="high"
              decoding="async"
              width="188"
              height="110"
              src="@/assets/logo/acedisposal-logo.png"
            />

            <div>
              <div class="brand-title">
                <span
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    margin-left: 10px;
                    color: black;
                  "
                  >CoverSheet</span
                >
              </div>
            </div>
          </a>
        </div>
        <h3 class="mb-2">Welcome back!</h3>
        <p>IT Department</p>
      </div>
      <div
        class="aside-image"
        style="background-image: url(images/pic1.svg)"
      ></div>
    </div>



    <div class="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
      <div class="d-flex justify-content-center h-100 align-items-center">
        <div class="authincation-content style-2">
          <div class="row no-gutters">
            <div class="col-xl-12">
              <div class="auth-form">
                <div class="text-center d-block d-lg-none mb-4 pt-5">

                  <a href="index.html" class="brand-logo">
                    <img
                      fetchpriority="high"
                      decoding="async"
                      width="188"
                      height="110"
                      src="@/assets/logo/acedisposal-logo.png"
                    />

                    <div>
                      <div class="brand-title">
                        <span
                          style="
                            font-size: 20px;
                            font-weight: bold;
                            margin-left: 10px;
                            color: black;
                          "
                          >CoverSheet</span
                        >
                      </div>
                    </div>
                  </a>
                </div>

                <h4 class="text-center mb-4">Sign into your account</h4>

                <!-- Empieza el formulario de login -->

                <form @submit="onSubmit" autocomplete="off">

                  <div class="mb-3">
                    <label class="mb-1 form-label" for="validationCustomEmail">Email<span class="text-danger">*</span></label>
                    <input v-model="email" v-bind="emailAttrs" type="email" class="form-control" id="validationCustomEmail" requiredautocomplete="off"/>
                    <div style="width: 100%; margin-top: 0.25rem; font-size: 0.875em; color: #e41a01;">{{ errors.email }}</div>
                   
                  </div>
                  
                  <div class="mb-3">
                    <label class="mb-1 form-label">Password<span class="text-danger">*</span></label>
                    <div class="position-relative">
                        <input type="password" v-model="password" v-bind="passwordAttrs" class="form-control" id="validationCustomPassword" required autocomplete="off"/>
                      <div style="width: 100%; margin-top: 0.25rem; font-size: 0.875em; color: #e41a01;">{{ errors.password }}</div>
                    </div>
                  </div>

                  <fieldset class="mb-3">
                    <div class="row">
                      <label class="col-form-label col-sm-3 pt-0">User Role</label>
                      <div class="col-sm-9">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" v-model="rol" name="gridRadios" value="Driver" checked />
                          <label class="form-check-label"> Driver </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" v-model="rol" name="gridRadios" value="Admin" />
                          <label class="form-check-label"> Admin </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                 
                  <div class="text-center">
                    <button :disabled="loading"  type="submit" class="btn btn-primary btn-block">Sign In</button>
                    <Spinner v-if="loading" />
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>