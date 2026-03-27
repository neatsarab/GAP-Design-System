import { ref } from "vue";
import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", () => {
  const role = ref(sessionStorage.getItem("adminRole") || "sysadmin");
  const username = ref(sessionStorage.getItem("adminUsername") || "");

  function setRole(r) {
    role.value = r;
    sessionStorage.setItem("adminRole", r);
  }

  function setUsername(u) {
    username.value = u;
    sessionStorage.setItem("adminUsername", u);
  }

  function clear() {
    role.value = "sysadmin";
    username.value = "";
    sessionStorage.removeItem("adminRole");
    sessionStorage.removeItem("adminUsername");
  }

  return { role, username, setRole, setUsername, clear };
});
