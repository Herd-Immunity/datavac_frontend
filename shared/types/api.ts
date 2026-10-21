export interface VaccineInfection {
  id: number
  name: string
}

export interface VaccineListItem {
  id: number
  name: string
  official_name: string | null
  is_available_in_rf: boolean
  popularity: number | null
  infections: VaccineInfection[]
  age_allowed: string | null
  pregnancy_usage_status: boolean
  administration_methods: { code: string | null; age_group: string | null; note: string | null; list_icon_url: string | null; detail_image_url: string | null }[]
  contraindications: { id: number; name: string; type: string }[]
}

export interface Vaccine {
  id: number
  name: string
  official_name: string | null
  is_available_in_rf: boolean
  popularity: number
  infections: VaccineInfection[]
  revision_date: string | null
  nonspec_url: string | null
  instruction_url: string | null
  age_allowed: string | null
  pregnancy_usage_status: boolean
  pregnancy_usage_text: string | null
  administration_methods: { code: string | null; age_group: string | null; note: string | null; list_icon_url: string | null; detail_image_url: string | null }[]
  contraindications: { id: number; name: string; type: string }[]
  ingredients: { id: number; name: string; role: string }[]
  comment: { source: string | null; text: string | null } | null
  manufacturer: string | null
  storage_conditions: string | null
  schedule_info: string | null
  side_effects: string | null
  indications: string | null
  interaction_info: string | null
  compatibility_info: string | null
}

export interface Infection {
  id: number;
  name: string;
  category: 'national_calendar' | 'extended' | 'other';
  popularity: number;
}

export interface Ingredient {
  id: number;
  name: string;
  type: string;
  popularity: number;
}

export interface ContraindicationCategory {
  id: number;
  name: string;
}

export interface Contraindication {
  id: number;
  name: string;
  category: ContraindicationCategory | null;
  /** Подкатегория для группировки внутри одной карточки (например, «Хронические заболевания сердца» внутри «Хронические заболевания») */
  subcategory: string | null;
  /** Сквозные метки для фильтра (например, «Почки», «Сердце») */
  tags?: string[];
  popularity: number;
}

export interface SearchSuggestion {
  id: number;
  name: string;
  type: 'vaccine' | 'infection' | 'ingredient' | 'contraindication' | 'instruction';
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}
