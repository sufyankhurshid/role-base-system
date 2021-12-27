# Situations/Symptoms Data

## Mapping

We do not have every specific symptom or situation in our onboarding journey, because it would
be overvhelmingly many, but also because some of them are very specific diagnoses by a therapist
and we don't want people to self-diagnose.  
Therefore, we have three file types:

1. `de/en/fr.json` with the translated situations, symptoms and methods and numbered keys
2. `oa_find_a_counselor.json` with the data we get from the onboarding journey
3. `oa_to_db_mapping.json` which maps our oa\_ filters to the symptoms and situations we have indexed and that we can use as filters

Example:

```json
// oa_to_db_mapping.json

// EXAMPLE
{
    "situations": { ... },
    "symptoms": {
        ...,
        // The key is the index in the "oa_find_a_counselor" file.
        // It maps to the values in the array.
        // E.g. in this case, the symptom with the key "7" is "Tiredness"
        // in the "oa" file. It maps to "Burnout" in the "en.json" file.
        "7": ["6"],
        // A key in our oa-file can map to several entries in our en.json.
        // "Inability to focus" can be mapped to "AD(H)S", "Memory disorders"
        // and "Depression"
        "8": ["0", "15", "9"],
        ...,
    }
}
```
