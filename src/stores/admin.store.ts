import { ref } from "vue";
import { defineStore } from "pinia";

export type AdminRole = "sysadmin" | "adminsso";

export const useAdminStore = defineStore("admin", () => {
  const role = ref<AdminRole>(
    (sessionStorage.getItem("adminRole") as AdminRole) || "sysadmin",
  );

  function setRole(r: AdminRole) {
    role.value = r;
    sessionStorage.setItem("adminRole", r);
  }

  function clear() {
    role.value = "sysadmin";
    sessionStorage.removeItem("adminRole");
  }

  return { role, setRole, clear };
});
