```markdown
# Tibetan Utils JavaScript Library

## Overview
`tibetanUtils.js` is a JavaScript utility library for Tibetan character processing, offering features including Tibetan syllable segmentation, validity verification, numeral conversion, and date formatting. Developed by NiangJiCaiRang, it provides detailed parsing and processing capabilities for Tibetan characters.

## Features

### 1. Tibetan Syllable Segmentation (`boWordSpell`)
- **Description**: Decomposes Tibetan words into components (prefix, superscript, vowel, base character, subscript, suffix, secondary suffix) and provides phonetic rules.
- **Usage**:
  ```javascript
  import { boWordSpell } from './tibetanUtils';
  const result = boWordSpell('གི');
  console.log(result);
  ```

### 2. Validity Check (`isLegal`)
- **Description**: Validates if a string contains legal Tibetan character combinations.
- **Parameters**:
  - `word`: String to validate.
- **Return Value**: Object containing validation result and error type.
- **Usage**:
  ```javascript
  import { isLegal } from './tibetanUtils';
  const result = isLegal('གི');
  console.log(result);
  ```

### 3. Numeral Conversion (`numberToBo`)
- **Description**: Converts Arabic numerals to Tibetan numerals.
- **Parameters**:
  - `number`: Number to convert.
- **Usage**:
  ```javascript
  import { numberToBo } from './tibetanUtils';
  const result = numberToBo(1234);
  console.log(result); // Output: '༡༢༣༤'
  ```

### 4. Date Formatting (`boDataFormat`)
- **Description**: Formats dates into Tibetan-style representations.
- **Parameters**:
  - `mode`: Display mode (`date`, `mouthF`, `mouth`, `time`, `timeF`, `timeD`).
  - `type`: Output type (`bo` for Tibetan or `han` for Chinese numerals).
  - `pattern`: Custom format pattern.
  - `date`: Date object to format.
- **Usage**:
  ```javascript
  import { boDataFormat } from './tibetanUtils';
  const date = new Date();
  const result = boDataFormat('date', 'bo', null, date);
  console.log(result);
  ```

## Usage Examples
```javascript
import { boWordSpell, isLegal, numberToBo, boDataFormat } from './tibetanUtils';

// Syllable segmentation
const wordResult = boWordSpell('གི');
console.log(wordResult);

// Validity check
const legalResult = isLegal('གི');
console.log(legalResult);

// Numeral conversion
const numResult = numberToBo(1234);
console.log(numResult);

// Date formatting
const dateResult = boDataFormat('date', 'bo', null, new Date());
console.log(dateResult);
```

## Notes
- Ensure input Tibetan characters are within the Unicode range `\u0F00-\uFDB`.
- For date formatting, provide a valid Date object or use the current date by default.

## Dependencies
- No external dependencies. Pure JavaScript implementation.

## License
MIT License. See LICENSE file for details.
```