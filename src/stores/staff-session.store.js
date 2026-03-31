import { defineStore } from "pinia";
import { ref } from "vue";

const STORAGE_KEY = "gap_staff_session";

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useStaffSessionStore = defineStore("staffSession", () => {
  const saved = loadFromStorage();

  const loginName = ref(saved?.loginName ?? "");
  const displayName = ref(saved?.displayName ?? "");
  const role = ref(saved?.role ?? "");
  const department = ref(saved?.department ?? "");

  function setStaff(data) {
    loginName.value = data.loginName ?? "";
    displayName.value = data.displayName ?? "";
    role.value = data.role ?? "";
    department.value = data.department ?? "";
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          loginName: loginName.value,
          displayName: displayName.value,
          role: role.value,
          department: department.value,
        }),
      );
    } catch {
      // sessionStorage unavailable
    }
  }

  function clearSession() {
    loginName.value = "";
    displayName.value = "";
    role.value = "";
    department.value = "";
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return { loginName, displayName, role, department, setStaff, clearSession };
});
