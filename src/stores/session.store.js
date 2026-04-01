import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

const STORAGE_KEY = "gap_session";

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

export const useSessionStore = defineStore("session", () => {
  const saved = loadFromStorage();

  const entityType = ref(saved?.entityType ?? "personal");
  const loginName = ref(saved?.loginName ?? "");
  const email = ref(saved?.email ?? "");
  const personalName = ref(saved?.personalName ?? "");
  const groupName = ref(saved?.groupName ?? "");
  const companyName = ref(saved?.companyName ?? "");
  const taxId = ref(saved?.taxId ?? "");
  const groupId = ref(saved?.groupId ?? "");
  const groupSystems = ref(saved?.groupSystems ?? []);

  const isGroupMode = computed(() => entityType.value === "group");

  const entityLabel = computed(() => {
    if (entityType.value === "group") return "กลุ่มเกษตรกร";
    if (entityType.value === "juristic") return "นิติบุคคล";
    return "บุคคลธรรมดา";
  });

  const entityIcon = computed(() => {
    if (entityType.value === "group") return "fas fa-people-group";
    if (entityType.value === "juristic") return "fas fa-building";
    return "fas fa-user";
  });

  const displayName = computed(() => {
    if (entityType.value === "group") return groupName.value;
    if (entityType.value === "juristic") return companyName.value;
    return personalName.value;
  });

  // persist to sessionStorage on every change
  watch(
    () => ({
      entityType: entityType.value,
      loginName: loginName.value,
      email: email.value,
      personalName: personalName.value,
      groupName: groupName.value,
      companyName: companyName.value,
      taxId: taxId.value,
      groupId: groupId.value,
      groupSystems: groupSystems.value,
    }),
    (val) => saveToStorage(val),
    { deep: true },
  );

  function setContext(
    type,
    name = "",
    id = "",
    systems = [],
    juristicTaxId = "",
    personName = "",
    personEmail = "",
  ) {
    entityType.value = type;
    if (personName) loginName.value = personName;
    if (personEmail) email.value = personEmail;
    if (type === "group") {
      groupName.value = name;
      companyName.value = "";
      personalName.value = personName || personalName.value;
      taxId.value = "";
    } else if (type === "juristic") {
      companyName.value = name;
      groupName.value = "";
      personalName.value = personName || personalName.value;
      taxId.value = juristicTaxId;
    } else {
      personalName.value = name;
      loginName.value = name;
      groupName.value = "";
      companyName.value = "";
      taxId.value = "";
    }
    groupId.value = id;
    groupSystems.value = systems;
  }

  function clearSession() {
    entityType.value = "personal";
    loginName.value = "";
    email.value = "";
    personalName.value = "";
    groupName.value = "";
    companyName.value = "";
    taxId.value = "";
    groupId.value = "";
    groupSystems.value = [];
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return {
    entityType,
    loginName,
    email,
    personalName,
    groupName,
    companyName,
    taxId,
    groupId,
    groupSystems,
    isGroupMode,
    entityLabel,
    entityIcon,
    displayName,
    setContext,
    clearSession,
  };
});
