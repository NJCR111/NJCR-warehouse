/**
 * @author: NiangJiCaiRang
 * @date: 2024/3/4 19:18
 * @description: 藏文拼读js工具函数表
 */

const frontChar = ['ག', 'ད', 'བ', 'མ', 'འ'];
const headChar = ['ར', 'ལ', 'ས'];
const footChar = ['ྱ', 'ྲ', 'ླ', 'ྺ'];
const vowel = ['ི', 'ུ', 'ེ', 'ོ']; //元音
//此模块的功能是准确分辨出藏文字符中的前加字,上加字,元音字,基础字,下加字,后加字,后后加字等成分,并给出相应的拼读方式
//对词进行分类处理
//1,第一种,里面包含元音字;把元音字找出来,可以直接确定后加字部分;
//2, 在编码中,中间三个部分的编码可以用正常形态和下加字形态区分;
//转换中的数据结构为对象 wordObject :{word,front,head,foot,mid,reBack,back,vowel}
/**
 * 
 * @param {string} word 待拼写的字 word which need to spell
 * @returns {object} wordObj = {word,front,head,foot,mid,reBack,back,vowel}
 */
function parseBoWord(word) {
    const charList = word.split('');
    const wordObject = { word: '', front: '', head: '', mid: '', foot: '', vowel: '', back: '', reBack: '' };
    wordObject.word = word;
    const { res: isLegalWord, type } = isLegal(word);
    //当文本不合法时;
    if (!isLegalWord) return wordObject;
    const vowelIndex = charList.findIndex((i) => vowel.includes(i));
    //以元音为基准的逻辑
    if (vowelIndex != -1) {
        wordObject.vowel = charList[vowelIndex];
        if (charList[vowelIndex + 1]) wordObject.back = charList[vowelIndex + 1];
        if (charList[vowelIndex + 2]) wordObject.reBack = charList[vowelIndex + 2];
        //找到中间部分的第一个正常形态字符
        let midFsIndex;
        for (let i = vowelIndex - 1; i >= 0; i--) {
            const isMidFs = /^[\u0F40-\u0F6C]*$/.test(charList[i]);
            if (isMidFs) {
                midFsIndex = i;
                break
            };
        }
        //找到元音前第一个正常字符,及中间的唯一正常字符
        if (midFsIndex != undefined) {
            //确定前加字
            //需要双重鉴权(前加字和中间的字)
            if (midFsIndex > 0) {
                const front = charList[midFsIndex - 1];
                if (frontChar.includes(front)) {
                    wordObject.front = front;
                } else {
                    wordObject.mid = front;
                    return wordObject
                }
            }
            //确定是上加字还是中间字
            const midFs = charList[midFsIndex];
            //先确定下加字索引
            //没有下加字的情况
            //上加字条件
            if (vowelIndex - midFsIndex > 1 && headChar.includes(midFs)) {
                wordObject.head = midFs;
            } else {
                wordObject.mid = midFs;
            }
            for (let i = midFsIndex + 1; i < vowelIndex; i++) {

                if (footChar.includes(charList[i])) {
                    wordObject.foot = charList[i]
                } else {
                    wordObject.mid = charList[i]
                };
            }


        }
        return wordObject
    }
    //无元音有下加字的情况
    const footIndex = charList.findIndex((i) => footChar.includes(i))
    if (footIndex != -1) {
        wordObject.foot = charList[footIndex];
        if (charList[footIndex + 1]) wordObject.back = charList[footIndex + 1];
        if (charList[footIndex + 2]) wordObject.reBack = charList[footIndex + 2];
        let midFsIndex;
        for (let i = footIndex - 1; i >= 0; i--) {
            const isMidFs = /^[\u0F40-\u0F6C]*$/.test(charList[i]);
            if (isMidFs) {
                midFsIndex = i;
                break
            };
        }
        //找到元音前第一个正常字符,及中间的唯一正常字符
        if (midFsIndex != undefined) {
            //确定前加字
            //需要双重鉴权(前加字和中间的字)
            if (midFsIndex > 0) {
                const front = charList[midFsIndex - 1];
                if (frontChar.includes(front)) {
                    wordObject.front = front;
                } else {
                    wordObject.mid = front;
                    return wordObject
                }
            }
            //确定是上加字还是中间字
            const midFs = charList[midFsIndex];
            if (footIndex - midFsIndex > 1 && headChar.includes(midFs)) {
                wordObject.head = midFs
            } else {
                //这里确定为中间字
                wordObject.mid = midFs;
            };
            //上加字条件
            for (let i = midFsIndex + 1; i < footIndex; i++) {
                wordObject.mid = charList[i];
            }

            // console.log(word, wordObject)

        }
        return wordObject
    }
    //元音和下加字都没有的情况
    //含有非常规字符的情况

    const firstNSimpleIndex = charList.findIndex(i => /^[\u0F71-\u0FBC]$/.test(i));
    if (firstNSimpleIndex != -1) {
        const midFs = charList[firstNSimpleIndex - 1];
        if (firstNSimpleIndex && headChar.includes(midFs)) {
            wordObject.head = midFs;
            wordObject.mid = charList[firstNSimpleIndex];
        } else {
            wordObject.mid = midFs;
            wordObject.foot = charList[firstNSimpleIndex];
        }
        if (firstNSimpleIndex - 2 >= 0 && frontChar.includes(charList[firstNSimpleIndex - 2])) wordObject.front = charList[firstNSimpleIndex - 2];
        if (charList[firstNSimpleIndex + 1]) wordObject.back = charList[firstNSimpleIndex + 1];
        if (charList[firstNSimpleIndex + 2] && ['ད', 'ས'].includes(charList[firstNSimpleIndex + 2])) wordObject.reBack = charList[firstNSimpleIndex + 2];

        return wordObject
    }
    //全是正常字符的情况

    //根据正常字符数量来计算
    const simpleNum = charList.reduce((num, char) => {
        const isSimple = /^[\u0F40-\u0F6C]$/.test(char);
        if (isSimple) num++;
        return num
    }, 0);

    function* findNextSimple() {
        for (let index = 0; index < charList.length; index++) {
            const isSimple = /^[\u0F40-\u0F6C]*$/.test(charList[index]);
            if (isSimple) yield charList[index] || '';
        }
        return ''
    }
    const simpleGenerator = findNextSimple();
    switch (simpleNum) {
        case 4:
            //合法藏文字最多只有四个正常字符
            ['front', 'mid', 'back', 'reBack'].forEach(key => {
                wordObject[key] = simpleGenerator.next().value
            })
            break;
        case 3:
            //
            const firstChar = charList[0];
            if (frontChar.includes(firstChar)) {
                ['front', 'mid', 'back'].forEach(key => {
                    wordObject[key] = simpleGenerator.next().value
                })
            } else {
                ['mid', 'back', 'reBack'].forEach(key => {
                    wordObject[key] = simpleGenerator.next().value
                })
            }
            break;
        case 2:
            ['mid', 'back'].forEach(key => {
                wordObject[key] = simpleGenerator.next().value
            })
            break;
        case 1:
            wordObject.mid = simpleGenerator.next().value;
            break;
        default:
            break;
    }
    return wordObject
}


function boWordSpell(word = '') {
    const wordOj = parseBoWord(word);

    const wordObj = ['front', 'head', 'mid', 'foot', 'vowel', 'back', 'reBack'].reduce((obj, key) => {
        let unicode = wordOj[key].charCodeAt(0);
        //![4018, 4017, 4019, 4013].includes(unicode) 下加字unicode码范围
        if (unicode >= 3984 && unicode <= 4024) unicode -= 80;
        obj[key] = String.fromCharCode(unicode);
        return obj;
    }, {});
    // console.log('wordObj', wordObj)
    const keyArr = ['front', 'head', 'mid', 'foot', 'vowel', 'back', 'reBack'];
    const computedStr = keyArr.reduce((str, key) => {
        const thisStr = wordObj[key] || '';
        const unicode = thisStr.charCodeAt(0);
        if (unicode < 3840 || unicode > 4095) return str;
        // console.log('thisStr', thisStr);
        switch (key) {
            case 'front':
                return str + thisStr + '་';
            case 'head':
                return str + thisStr + '་';
            case 'mid':
                // console.log('head', wordObj.head, Boolean(thisStr), Boolean(wordObj.head))
                if (thisStr) {
                    const uni = (wordObj.head || '').charCodeAt(0);
                    if (uni < 3840 || uni > 4095) {
                        return str + thisStr + '་'
                    } else {
                        return str + thisStr + '་བཏགས་' + keyArr.slice(0, 3).reduce((str1, key) => str1 + wordOj[key], '') + '་';
                    }
                }
                break;
            case 'foot':
                if (thisStr) return str + thisStr + '་བཏགས་' + keyArr.slice(0, 4).reduce((str1, key) => str1 + wordOj[key], '') + '་';
                break;
            case 'vowel':
                const vowelObj = { 'ི': 'གི་གུ', 'ུ': 'ཞབས་ཀྱུ', 'ེ': 'འགྲེང་བུ', 'ོ': 'ན་རོ' };
                if (thisStr && thisStr in vowelObj) return str + vowelObj[thisStr] + '་' + keyArr.slice(0, 5).reduce((str1, key) => str1 + wordOj[key], '') + '་';
                break;
            case 'back':
                if (thisStr) {
                    const uni = (wordObj.reBack || '').charCodeAt(0);
                    return !(uni < 3840 || uni > 4095) ? (str + thisStr + '་') : (str + thisStr + '་བཞག་' + keyArr.slice(0, 6).reduce((str1, key) => str1 + wordOj[key], ''));
                }
                break;
            case 'reBack':
                if (thisStr) return str + thisStr + '་བཞག་' + keyArr.slice(0, 7).reduce((str1, key) => str1 + wordOj[key], '')
            default:
                break;
        }
        // return str
    }, '');
    return computedStr;
}

/**
 * 
 * @param {string} word 需要校验合法性的字符串
 * @returns {object} {res,type}
 */
function isLegal(word = '') {
    const isBo = /^[\u0F00-\u0FDB]*$/g.test(word);
    if (!isBo) return { res: false, type: 'unicode exceeds scope of tibetan!' }
    const vowelNumExceed = 'vowel number exceeds!'
    const footNumExceed = 'foot number exceeds!'
    const simpleNumExceed = 'simple number exceeds!'
    const charList = word.split('');
    const simpleNum = charList.reduce((num, char) => /^[\uOF40-\u0F6C]$/.test(char) ? num + 1 : num, 0);
    if (simpleNum > 4 || simpleNum < 1) return { res: false, type: simpleNumExceed };
    const vowelNum = charList.reduce((num, char) => vowel.includes(char) ? num++ : num, 0);
    if (vowelNum > 1) return { res: false, type: vowelNumExceed }
    const footNum = charList.reduce((num, char) => footChar.includes(char) ? num++ : num, 0);
    if (footNum > 1) return { res: false, type: footNumExceed }

    return { res: true, type: '' }
}

/**
 * @param {String} number 需要转化成藏文数字的数字
 */
function numberToBo(number) {
    let num1 = number + ''
    let num = num1.split('').map((el) => {
        let numArr = ['༠', '༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩']
        return numArr[el]
    }).join('')
    return num
}
/**
 *
 * js实现时间显示格式转换
 * 年份必须用yyyy或者yy不限大小写
 * 月份 MM
 * 日期 DD
 * 小时 HH
 * 分钟 mm
 * 秒   ss
 * @param {Date}date
 * @param {String}pattern
 * @param {String}type bo/han
 * @param {String}mode date/mouthF/mouth/time/timeF/timeD
 * @returns {String}
 */
function boDataFormat(mode = 'date', type = 'bo', pattern, date) {
    if (!(date && date.constructor === Date)) date = new Date();
    const patternObj = {
        date: 'yyyyལོའི་ཟླMMཔའི་ཚེསDDཉིན།',
        mouthF: 'yyyyལོའི་ཟླMMཔ།',
        mouth: 'ཟླMMཔ།',
        time: 'དུས་ཚོདHHསྐར་མmm།',
        timeF: 'yyyyལོའི་ཟླMMཔའི་ཚེསDDཉིན་དུས་ཚོདHHསྐར་མmm།',
        timeD: 'ཚེསDDཉིན་དུས་ཚོདHHསྐར་མmm།',
    }
    if (!pattern) pattern = patternObj[mode] || patternObj.date;
    let YYYY = date.getFullYear();
    //月份 0-11
    let MM = date.getMonth() + 1;
    let DD = date.getDate();
    let HH = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    //兼容大小写
    function transferSingleNum(num) {
        if (type === 'bo') return num < 10 ? numberToBo('0' + num) : numberToBo(num);
        if (type === 'han') return num < 10 ? '0' + num : num;
    }
    pattern = pattern.replace('YYYY', 'yyyy').replace('YY', 'yy');
    // 兼容年份yy和yyyy
    if (pattern.includes('yyyy')) {
        pattern = pattern.replace('yyyy', transferSingleNum(YYYY))
    } else {
        pattern = pattern.replace("yy", transferSingleNum(YYYY % 100))
    }
    return pattern
        .replace("MM", transferSingleNum(MM))
        .replace("DD", transferSingleNum(DD))
        .replace('HH', transferSingleNum(HH))
        .replace('mm', transferSingleNum(mm))
        .replace('ss', transferSingleNum(ss));
}

//暴露
export {
    boWordSpell,
    boDataFormat,
    numberToBo,
    parseBoWord
}