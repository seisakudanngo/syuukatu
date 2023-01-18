<script lang="ts" setup>
// loginはGoogleButtonに書き込んだ
</script>

<template>
  <div>
    <div 
      class="card mx-auto my-5"
    >
      <div class="card-body my-2 mx-4">
        <div class="card-title text-center mb-2">
          <!-- KDHub -->
          <img class="img-fluid w-75" src="../assets/KDHub.png">
        </div>
        <!-- <div class="my-3">
          <input 
            type="email" 
            class="form-control p-2" 
            placeholder="メールアドレス"
          >
        </div>
        <div class="my-3">
          <input 
            type="password" 
            class="form-control p-2" 
            placeholder="パスワード"
          >
        </div>
        <div class="text-center">
          <button 
            type="button"
            class="btn btn-lg w-100 text-white btn-login"
          >
            LOGIN
          </button>
        </div> -->
        <!-- <hr class="login-hr"> -->
        <div class="text-center pb-2">
          <GoogleButton />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card{
  width: 42vh;
  box-shadow: 0 0 1rem lightgray;
  .form-control{
    background-color: whitesmoke;
    &:focus {
      border-color: none;
      box-shadow: none;
    }
  }
  .btn-login {
    background-color: #6770ee;
    &:hover {
      filter: brightness(1.2);
    }
  }
  .login-hr{
    border-top: 3px dotted black;
  }
}
</style>