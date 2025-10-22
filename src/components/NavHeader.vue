<template>
  <div class="nav-header" @click="handleRedirect">
    <a class="brand-logo">
      <img
        fetchpriority="high"
        decoding="async"
        width="188"
        height="56"
        src="@/assets/logo/AIRC-logo.png"
      />

      <div>
        <div class="brand-title">
          <span
            style="
              font-size: 18px;
              font-weight: bold;
              margin-left: 5px;
              color: black;
            "
            >AIRC CoverSheet</span
          >
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    handleRedirect() {
      const userRaw = localStorage.getItem('USER');
      if (userRaw) {
        let user;
        try {
          user = JSON.parse(userRaw);
          let role = user?.data?.rol || user?.data?.user?.rol;
          if (role === 'Driver') {
            window.location.href = '/';
          } else {
            window.location.href = '/admin/dashboard';
          }
        } catch (e) {
          console.warn('Error parsing user data:', e);
          window.location.href = '/auth/login';
        }
      } else {
        window.location.href = '/auth/login';
      }
    }
  }
}
</script>

<style scoped>
.nav-header {
  cursor: pointer;
}
</style>