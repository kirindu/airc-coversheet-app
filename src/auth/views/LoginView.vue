<script setup>  

//Importaciones de sistemas y librerias
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Importamos el api
import UserAPI from "@/api/UserAPI";


</script>


<template>
        <div class="authincation d-flex flex-column flex-lg-row flex-column-fluid">
		<div class="login-aside text-center d-none d-sm-flex flex-column flex-row-auto">
			<div class="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
				<div class="text-center mb-4 pt-5">
					<!-- <a href="index.html"><img src="@/assets/images/logo-full.png" class="dark-login"  alt=""></a>
					<a href="index.html"><img src="@/assets/images/logo-full-white.png" class="light-login" alt=""></a> -->

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
			<div class="aside-image" style="background-image:url(images/pic1.svg);"></div>
		</div>
		<div class="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
			<div class="d-flex justify-content-center h-100 align-items-center">
				<div class="authincation-content style-2">
					<div class="row no-gutters">
						<div class="col-xl-12">
							<div class="auth-form">
								<div class="text-center d-block d-lg-none mb-4 pt-5">


									<!-- <a href="index.html"><img src="@/assets/images/logo-full.png" class="dark-login"  alt=""></a>
									<a href="index.html"><img src="@/assets/images/logo-full-white.png" class="light-login" alt=""></a>-->

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
								
								<h4 class="text-center mb-4">Sign in your account</h4>
								<form action="index.html">
									<div class="mb-3">
										<label class="mb-1 form-label">Email</label>
										<input type="email" class="form-control" value="hello@example.com">
									</div>
									<div class="mb-3">
										<label class="mb-1 form-label">Password</label>
										<div class="position-relative">
											<input type="password" id="dz-password" class="form-control" value="Password">
											<span class="show-pass eye">
												<i class="fa fa-eye-slash"></i>
												<i class="fa fa-eye"></i>
											</span>
										</div>
									</div>

                                    <fieldset class="mb-3">
                                            <div class="row">
                                                <label class="col-form-label col-sm-3 pt-0">User Rol</label>
                                                <div class="col-sm-9">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="gridRadios" value="option1" checked>
                                                        <label class="form-check-label">
                                                            Driver
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="gridRadios" value="option2">
                                                        <label class="form-check-label">
                                                            Admin
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    
									<!-- <div class="form-row d-flex justify-content-between mt-4 mb-2">
										<div class="mb-3">
										   <div class="form-check custom-checkbox ms-1">
												<input type="checkbox" class="form-check-input" id="basic_checkbox_1">
												<label class="form-check-label" for="basic_checkbox_1">Remember my preference</label>
											</div>
										</div>
										<div class="mb-3">
											<a href="page-forgot-password.html">Forgot Password?</a>
										</div>
									</div> -->
									<div class="text-center">
										<button type="submit" class="btn btn-primary btn-block">Sign Me In</button>
									</div>
								</form>
								<!-- <div class="new-account mt-3">
									<p>Don't have an account? <a class="text-primary" href="./page-register.html">Sign up</a></p>
								</div> -->
                            </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

