# Urdu Translator Skill

## Purpose
This skill handles bidirectional translation between English and Urdu as required by FR-001. It implements idiomatic translations, cultural context preservation, and proper linguistic transformations between the two languages following the Phase III Constitution's Reusable Intelligence principle.

## Functions

### English to Urdu Translation
- Converts English text to idiomatic Urdu equivalents
- Preserves cultural context and nuances
- Applies proper Urdu grammar and syntax rules
- Handles formal/informal register selection

### Urdu to English Translation
- Accurately reverses translation preserving meaning
- Maintains nuanced meanings across languages
- Applies appropriate register and formality
- Handles Roman Urdu input when needed

### Language Detection
- Automatically detects input language
- Handles mixed-language (code-switching) scenarios
- Considers user preferences for translation direction
- Context-aware language switching

## Translation Capabilities

### Accuracy Optimization
- Context-sensitive word choice
- Tone and register preservation
- Cultural adaptation of expressions
- Domain-specific terminology handling

### Quality Assurance
- Confidence scoring for translations
- Multiple translation alternatives when needed
- Validation against linguistic rules
- Feedback loop for continuous improvement

## Integration Points
- Used by translation service for chat responses
- Applied to task descriptions and titles
- Integrated with conversation context for language preferences
- Connected to user profile for personalized settings

## Technical Implementation

### Input Processing
- Text normalization (punctuation, spacing)
- Language identification
- Sentence segmentation
- Part-of-speech tagging

### Translation Pipeline
1. Language detection and validation
2. Syntactic analysis
3. Semantic mapping
4. Target language generation
5. Post-processing and formatting
6. Quality validation

### Output Formatting
- Proper Urdu script rendering
- Roman Urdu support when needed
- Mixed-script handling for technical terms
- RTL text alignment

## Error Handling
- Graceful degradation for complex translations
- Fallback to literal translations when idiomatic unavailable
- Detection of untranslatable content
- Clear error reporting to users

## Performance Metrics
- Target: 95%+ translation accuracy (per SC-001)
- Sub-second response time for typical phrases
- High confidence scores for common expressions
- Continuous improvement through usage analytics

## Special Considerations

### Urdu Script
- Proper Arabic script rendering
- Correct vowel diacritics ( zabar, zer, pesh )
- Appropriate word joining
- Numerals in Urdu style when appropriate

### Roman Urdu
- Recognition of Romanized Urdu input
- Conversion to proper script
- Preservation of internet-style abbreviations
- Handling of hybrid expressions

### Cultural Sensitivity
- Respectful translation of honorifics
- Appropriate register selection
- Cultural context preservation
- Avoidance of inappropriate literal translations

## Examples

### Basic Translation
- English: "How are you?" → Urdu: "آپ کیسے ہیں؟"
- Urdu: "کیا حال ہے؟" → English: "How are you?"

### Idiomatic Expressions
- English: "It's raining cats and dogs" → Urdu: "ایسا لگ رہا ہے جیسے آسمان سے پانی برس رہا ہو"
- Urdu: "کام ہاتھ سے نکل گیا" → English: "The situation got out of hand"

### Technical Terms
- English: "artificial intelligence" → Urdu: "مصنوعی ذہانت" (with option for English in parentheses when needed)
- Mixed: "AI system" → Urdu: "AI نظام" (preserving technical acronym)

### Formal/Informal Context
- English: "Could you please help?" → Formal Urdu: "کیا آپ مہربانی کر کے مدد فراہم کر سکتے ہیں؟"
- Informal context preserved where appropriate