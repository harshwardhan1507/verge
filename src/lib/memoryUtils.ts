const COMMON_WORDS = new Set([
  'the','this','that','what','have','when','how','for','but','and',
  'was','just','been','with','from','they','them','their','then',
  'than','into','over','after','before','today','yesterday','person',
  'met','saw','talked','called','told','said','went','came','got',
  'had','has','will','would','could','should','also','about','some',
  'tell','feel','felt','think','know','want','need','like','make',
  'good','bad','new','old','big','day','time','very','much',
  'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
  'January','February','March','April','June','July','August',
  'September','October','November','December'
])

export function extractPeople(text: string): string[] {
  const people = new Set<string>()
  
  // Pattern 1: Words after person-indicator phrases
  const contextPatterns = [
    /\b(?:met|saw|with|called|told|talked to|spoke to|visited|helped|asked|texted|messaged)\s+([A-Za-z]{2,})/gi,
    /\b(?:person|friend|colleague|brother|sister|mom|dad|teacher|professor)\s+([A-Za-z]{2,})/gi,
  ]
  
  contextPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1]
      const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      if (!COMMON_WORDS.has(normalized) && !COMMON_WORDS.has(name.toLowerCase())) {
        people.add(normalized)
      }
    }
  })
  
  // Pattern 2: Standard capitalized names (Title Case)
  const titleCasePattern = /\b([A-Z][a-z]{1,})\b/g
  let match
  while ((match = titleCasePattern.exec(text)) !== null) {
    const name = match[1]
    if (!COMMON_WORDS.has(name) && !COMMON_WORDS.has(name.toLowerCase())) {
      people.add(name)
    }
  }
  
  // Pattern 3: ALL CAPS words (like "HARSH") — treat as names if 2+ chars
  const allCapsPattern = /\b([A-Z]{2,})\b/g
  while ((match = allCapsPattern.exec(text)) !== null) {
    const raw = match[1]
    const normalized = raw.charAt(0) + raw.slice(1).toLowerCase()
    if (!COMMON_WORDS.has(normalized) && !COMMON_WORDS.has(raw.toLowerCase())) {
      people.add(normalized)
    }
  }
  
  return Array.from(people).slice(0, 5)
}
