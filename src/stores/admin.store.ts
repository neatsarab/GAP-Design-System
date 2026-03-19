import { ref } from "vue";
import { defineStore } from "pinia";

export type AdminRole = "sysadmin" | "adminsso";

export const useAdminStore = defineStore("admin", () => {
  const role = ref<AdminRole>(
    (sessionStorage.getItem("adminRole") as AdminRole) || "sysadmin",
  );
  const username = ref<string>(sessionStorage.getItem("adminUsername") || "");

  function setRole(r: AdminRole) {
    role.value = r;
    sessionStorage.setItem("adminRole", r);
  }

  function setUsername(u: string) {
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
