<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)


onMounted(() => {

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

});


</script>

<template>
  <div class="header">
    <div class="header-content">
      <nav class="navbar navbar-expand">
        <div class="collapse navbar-collapse justify-content-between">
          <div class="header-left">
            <div class="dashboard_bar">Dashboard</div>

          </div>
          <ul class="navbar-nav header-right">
            <li class="nav-item dropdown header-profile ps30">
              <a
                class="nav-link"
                href="javascript:void(0);"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img src="/src/assets/images/avatar/avatar.jpg" width="20" alt="" />
                <div class="header-info ms-2 me-3">
                  <span class="fs-13 font-w500 mb-0">{{ user?.name || 'Usuario desconocido' }}</span>
                  <small class="fs-12">{{ user?.rol || 'Rol no definido' }}</small>
                </div>
                <div class="ms-auto me-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.2803 2.8447L5.99998 7.56435L10.7197 2.8447C10.8606 2.70545 11.0509 2.62764 11.249 2.62824C11.4472 2.62884 11.637 2.70781 11.7771 2.8479C11.9172 2.988 11.9962 3.17784 11.9968 3.37596C11.9974 3.57408 11.9195 3.76439 11.7803 3.90534L6.5303 9.15534C6.38965 9.29599 6.19889 9.375 5.99998 9.375C5.80108 9.375 5.61031 9.29599 5.46966 9.15534L0.219662 3.90534C0.0804205 3.76439 0.00260448 3.57408 0.0032053 3.37596C0.00380707 3.17784 0.082778 2.988 0.222872 2.8479C0.362967 2.70781 0.552803 2.62884 0.750925 2.62824C0.949048 2.62764 1.13936 2.70545 1.2803 2.8447Z"
                      fill="#ADADAD"
                    />
                  </svg>
                </div>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <div class="card shadow-none border-0 mb-0">
                  <div class="card-footer px-0 py-2" style="background-color:bisque;">
                    <a href="page-login.html" class="dropdown-item ai-icon">
                      <i class="flaticon-logout-1 fs-18 text-danger"></i>
                      <span class="ms-2 text-danger">Logout </span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>
