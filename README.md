# Tibetan Utils JavaScript Library

## 概述
`tibetanUtils.js` 是一个用于藏文字符处理的JavaScript工具库，主要功能包括藏文拼读、合法性校验、数字转换以及日期格式化。该库由NiangJiCaiRang开发，旨在提供对藏文字符的详细解析和处理能力。

## 功能模块

### 1. 藏文拼读 (`boWordSpell`)
- **描述**: 将藏文单词分解为前加字、上加字、元音字、基础字、下加字、后加字、后后加字等成分，并给出相应的拼读方式。
- **使用方法**:
  ```javascript
  import { boWordSpell } from './tibetanUtils';
  const result = boWordSpell('གི');
  console.log(result);
  ```

### 2. 合法性校验 (`isLegal`)
- **描述**: 校验输入字符串是否为合法的藏文字符组合。
- **参数**:
  - `word`: 需要校验的字符串。
- **返回值**: 返回一个对象，包含合法性结果和错误类型。
- **使用方法**:
  ```javascript
  import { isLegal } from './tibetanUtils';
  const result = isLegal('གི');
  console.log(result);
  ```

### 3. 数字转换 (`numberToBo`)
- **描述**: 将阿拉伯数字转换为藏文数字。
- **参数**:
  - `number`: 需要转换的数字。
- **使用方法**:
  ```javascript
  import { numberToBo } from './tibetanUtils';
  const result = numberToBo(1234);
  console.log(result); // 输出: '༡༢༣༤'
  ```

### 4. 日期格式化 (`boDataFormat`)
- **描述**: 将日期格式化为藏文风格的显示格式。
- **参数**:
  - `mode`: 显示模式（如`date`, `mouthF`, `mouth`, `time`, `timeF`, `timeD`）。
  - `type`: 输出类型（`bo`或`han`）。
  - `pattern`: 自定义格式化模式。
  - `date`: 需要格式化的日期对象。
- **使用方法**:
  ```javascript
  import { boDataFormat } from './tibetanUtils';
  const date = new Date();
  const result = boDataFormat('date', 'bo', null, date);
  console.log(result);
  ```

## 使用示例
```javascript
import { boWordSpell, isLegal, numberToBo, boDataFormat } from './tibetanUtils';

// 藏文拼读
const wordResult = boWordSpell('གི');
console.log(wordResult);

// 合法性校验
const legalResult = isLegal('གི');
console.log(legalResult);

// 数字转换
const numResult = numberToBo(1234);
console.log(numResult);

// 日期格式化
const dateResult = boDataFormat('date', 'bo', null, new Date());
console.log(dateResult);
```

## 注意事项
- 确保输入的藏文字符在Unicode范围内。
- 对于日期格式化，确保传入有效的日期对象或默认使用当前日期。

## 依赖
- 无外部依赖，纯JavaScript实现。

## 许可证
本项目遵循MIT许可证。请参考LICENSE文件获取更多信息。