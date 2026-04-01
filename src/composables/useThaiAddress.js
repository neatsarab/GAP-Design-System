import { computed, watch } from 'vue'
import db from '../data/thaiAddress.js'

/**
 * Cascading Thai address selects
 * @param {Object} form - reactive form object
 * @param {string} prefix - field prefix, e.g. 'exporter' or 'consignee'
 *   expects: form[prefix + 'Province'], form[prefix + 'District'],
 *            form[prefix + 'Tambol'], form[prefix + 'Zip']
 */
export function useThaiAddress(form, prefix) {
  const f = (key) => prefix + key

  const provinces = computed(() =>
    [...new Set(db.map((r) => r[2]))].sort((a, b) => a.localeCompare(b, 'th'))
  )

  const districts = computed(() => {
    const pv = form[f('Province')]
    if (!pv) return []
    return [...new Set(db.filter((r) => r[2] === pv).map((r) => r[1]))].sort((a, b) =>
      a.localeCompare(b, 'th')
    )
  })

  const tambols = computed(() => {
    const pv = form[f('Province')]
    const dt = form[f('District')]
    if (!pv || !dt) return []
    return db.filter((r) => r[2] === pv && r[1] === dt).map((r) => r[0])
  })

  watch(
    () => form[f('Province')],
    () => {
      form[f('District')] = ''
      form[f('Tambol')] = ''
      form[f('Zip')] = ''
    }
  )

  watch(
    () => form[f('District')],
    () => {
      form[f('Tambol')] = ''
      form[f('Zip')] = ''
    }
  )

  watch(
    () => form[f('Tambol')],
    (val) => {
      if (!val) { form[f('Zip')] = ''; return }
      const entry = db.find(
        (r) => r[2] === form[f('Province')] && r[1] === form[f('District')] && r[0] === val
      )
      if (entry) form[f('Zip')] = entry[3]
    }
  )

  return { provinces, districts, tambols }
}
