import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type EntityType = 'personal' | 'juristic' | 'group'

export const useSessionStore = defineStore('session', () => {
  const entityType = ref<EntityType>('personal')
  const personalName = ref('')
  const groupName = ref('')
  const companyName = ref('')
  const taxId = ref('')
  const groupId = ref('')
  const groupSystems = ref<string[]>([])

  const isGroupMode = computed(() => entityType.value === 'group')

  const entityLabel = computed(() => {
    if (entityType.value === 'group') return 'กลุ่มเกษตรกร'
    if (entityType.value === 'juristic') return 'นิติบุคคล'
    return 'บุคคลธรรมดา'
  })

  const entityIcon = computed(() => {
    if (entityType.value === 'group') return 'fas fa-people-group'
    if (entityType.value === 'juristic') return 'fas fa-building'
    return 'fas fa-user'
  })

  const displayName = computed(() => {
    if (entityType.value === 'group') return groupName.value
    if (entityType.value === 'juristic') return companyName.value
    return personalName.value
  })

  function setContext(type: EntityType, name = '', id = '', systems: string[] = [], juristicTaxId = '') {
    entityType.value = type
    if (type === 'group') {
      groupName.value = name
      companyName.value = ''
      personalName.value = ''
      taxId.value = ''
    } else if (type === 'juristic') {
      companyName.value = name
      groupName.value = ''
      personalName.value = ''
      taxId.value = juristicTaxId
    } else {
      personalName.value = name
      groupName.value = ''
      companyName.value = ''
      taxId.value = ''
    }
    groupId.value = id
    groupSystems.value = systems
  }

  return { entityType, personalName, groupName, companyName, taxId, groupId, groupSystems, isGroupMode, entityLabel, entityIcon, displayName, setContext }
})
