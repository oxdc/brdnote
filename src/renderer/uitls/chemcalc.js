/*eslint-disable */
//交换
function swap(a,x_equ,x_coeff,y_equ,y_coeff) {
    var t;
    t=a[x_equ][x_coeff];
    a[x_equ][x_coeff]=a[y_equ][y_coeff];
    a[y_equ][y_coeff]=t;
}

//最大公约数
function gcd(a,b){
    var t;
    while(b!=0) {
        t=b;
        b=a%b;
        a=t;
    }
    return a;
}

//最小公倍数
function lcm(a,b){
    return a/gcd(a,b)*b;
}
	
//输出矩阵
function printmatrix(equ,coeff){
	var i,j;
	for(i=0;i<equ;i++) {
		for(j=0;j<coeff;j++) {
			// document.write(a[i][j]+"&nbsp&nbsp");
		}
		// document.write("</br>");
	}
}
	
// 高斯消元法解方程组(Gauss-Jordan elimination)
function Gauss(a,equ,coeff,x,x_de){
    var i,j,k;
    var max_r;// 当前这列绝对值最大的行
    var col;//当前处理的列
    var ta,tb;
    var LCM;
    var temp,temp_de;

    col=0; // 当前处理的列
    for(k = 0; k < equ && col < coeff; k++,col++) {
        // 枚举当前处理的行
        // 找到该col列元素绝对值最大的那行与第k行交换.(为了在除法时减小误差)
        max_r=k;
        for(i=k+1; i<equ; i++) {
            if(Math.abs(a[i][col])>Math.abs(a[max_r][col])) {
                max_r=i;
            }
        }

        if(max_r!=k) {
            for(j=k; j<coeff+1; j++) {
                swap(a,k,j,max_r,j); // 与第k行交换
            }
    }

    if(a[k][col]==0) {
        // 说明该col列第k行以下全是0了，则处理当前行的下一列
        k--;
        continue;
    }

    for(i=k+1; i<equ; i++) {
        // 枚举要删去的行
        if(a[i][col]!=0) {
            LCM = lcm(Math.abs(a[i][col]),Math.abs(a[k][col]));
            ta = LCM/Math.abs(a[i][col]);
            tb = LCM/Math.abs(a[k][col]);
            if(a[i][col]*a[k][col]<0) tb=-tb;    //异号的情况是相加
            for(j=col; j<coeff+1; j++) {
                a[i][j] = a[i][j]*ta-a[k][j]*tb;
            }
        }
    }
}

    //输出化简的增广矩阵
    // document.write("化简的增广矩阵"+"</br>");
    // printmatrix(a,equ,coeff+1);

    // 1. 无解的情况: 化简的增广阵中存在(0, 0, ..., a)这样的行(a != 0)
    for (i = k; i < equ; i++) {
        if (a[i][col] != 0) {
            return -1;    
        }
    }

    // 2. 无穷解的情况: 在var * (var + 1)的增广阵中出现(0, 0, ..., 0)这样的行，即说明没有形成严格的上三角阵
    // 且出现的行数即为自由变元的个数
    if (k < coeff) {
        return coeff - k; // 自由变元有var - k个
    }

    // 3. 唯一解的情况: 在var * (var + 1)的增广阵中形成严格的上三角阵
    // 计算出Xn-1, Xn-2 ... X0
    temp_de = 1;
    for (i = coeff - 1; i >= 0; i--) {
        temp = a[i][coeff] * temp_de;
        for (j = i + 1; j < coeff; j++) {
            if (a[i][j] != 0) {
                temp -= temp_de * a[i][j] * x[j] / x_de[j];    //因为x[i]存的是temp/a[i][i]的值，即是a[i][i]=1时x[i]对应的值
            }
        }
        x[i] = temp; 
        x_de[i] = temp_de * a[i][i];
        temp = gcd(x[i],x_de[i]);
        x[i] /= temp;
        x_de[i] /= temp;
        temp_de = lcm(temp_de,x_de[i]);
    }
    for (i = 0; i < coeff; i++) {
        x[i] = x[i] * temp_de / x_de[i];
    }

    return 0;
}	

function _calc(a, x){
    var i, j;
    var equ,coeff;
    var x_de=[];//解的分母
    equ=a.length;
    coeff=a[0].length;

    //矩阵增广
    for (i = 0; i < equ; i++) {
        a[i][coeff] = 0; 
    }

    //试解矩阵增广
    var a_try = a;
    var free_num_try = Gauss(a_try,equ,coeff,x,x_de);

    //正式求解
    a.push([]);
    var backup_a = a;//备份a
    var answersituation = -1;//其他情况皆无解
    var addposi;//指定系数位置
    addposi = 0;

    //1、有唯一解，方程式正确
    if (free_num_try == 1) {
        //添加行
        while (addposi >= 0 && addposi < coeff) {
            for (j = 0; j < coeff; j++) {
                a[equ][j] = 0;
            }
            a[equ][addposi] = 1;
            a[equ][coeff] = 1;
            equ++;

            //求解矩阵，返回0，有解；返回>0，无穷解；返回-1，无解。
            var free_num = Gauss(a,equ,coeff,x,x_de);
            if (free_num == 0) {
                addposi = -2;
                answersituation = 0;
            }
            addposi++;
            a = backup_a;
            equ--;
        }
    }
    //2、方程式可能由多个方程式组成
    if (free_num_try > 1) answersituation = free_num_try;
    //3、传入矩阵错误
    if (free_num_try == 0) answersituation = -2;

    //返回0，方程式正确配平。
    //返回>0，方程式由“返回值”个子方程式组成，现给出其中一个子方程式的配平结果。
    //返回-1，该化学方程式无法配平，请仔细检查反应物和生成物。
    //返回-2，矩阵建立出错。
    return answersituation;
}

// 调用接口
function calc(a) {
    var x = new Array(a[0].length);
    var _Calc = _calc(a, x);
    switch (_Calc) {
        case 0:
            return new Map([["status", true], ["return", x], ["msg", null]]);
        case -1:
            return new Map([["status", false], ["msg", "该化学方程式无法配平，请仔细检查反应物和生成物。"], ["pattern", null]]);
        case -2:
            return new Map([["status", false], ["msg", "矩阵建立出错。"], ["pattern", null]]);
        default:
            return new Map([["status", false], ["return", x], ["msg", "方程式由"+ _Calc.toString() +"个子方程式组成，现给出其中一个子方程式的配平结果。"], ["pattern", null]]);
    }
}

/* 提取分子配平系数、元素、元素个数
// Molecular
//   - times
//   - elems["", int]
*/
class Molecular {
    constructor(string, isReactant) {
        // 分子系数
        var times_ = string.match(/^-?\d*/g);
        this.times = (times_[0]==""?1:parseInt(times_[0]));
        this.isReactant = isReactant;
        // 元素信息
        var elems_ = string.match(/([A-Z][a-z]*)([1-9][0-9]*)*/g);
        this.elems = [];
        for (var i = 0; i < elems_.length; i++) {
            this.elems.push(new Array(
                elems_[i].match(/[A-Z][a-z]*/g)[0], 
                (elems_[i].match(/[1-9][0-9]*/g)==null ? 
                    1 :
                    parseInt(elems_[i].match(/[1-9][0-9]*/g)[0])
                )
            ));
        }
        // 电荷信息
        var pcharge = string.match(/\^([1-9][0-9]*)(\+)/g);
        var icharge = string.match(/\^([1-9][0-9]*)(\-)/g);
        if (pcharge != null) {
            this.elems.push(new Array("^", parseInt((pcharge[0].match(/[1-9][0-9]*/g) == null?
                1:
                pcharge[0].match(/[1-9][0-9]*/g)[0])
            )));
        }
        if (icharge != null) {
            this.elems.push(new Array("^", -parseInt((icharge[0].match(/[1-9][0-9]*/g) == null?
                1:
                icharge[0].match(/[1-9][0-9]*/g)[0])
            )));
        }
    }
}

// 构造方程的数学特征，包括元素表、系数矩阵
class Charact {
    constructor(moleculars) {
        this.moleculars = moleculars;
        this.elementList = new Array();
        this.coefficientArray = new Array();
        for (var i = 0; i < moleculars.length; i++) {
            for (var j = 0; j < moleculars[i].elems.length; j++) {
                var elem = moleculars[i].elems[j];
                var elemIndex = this.elementList.findIndex((n) => n == elem[0]);
                if (elemIndex != -1) {
                    this.coefficientArray[elemIndex][i] = 
                        elem[1] * (moleculars[i].isReactant ? 1 : -1);
                }
                else {
                    this.elementList.push(elem[0]);
                    this.coefficientArray.push((new Array(moleculars.length)).fill(0));
                    j--;
                }
            }
        }
    }
    getArray() {
        return this.coefficientArray;
    }
    getCoefficients() {
        var coefficients = new Array();
        for (const molecular of this.moleculars) {
            coefficients.push(molecular.times);
        }
        return coefficients;
    }
}

// 入口
export default function chemCalc(input) {
    // 预处理：删除空格
    var chemString = preProcess(input);

    // 检查
    var Check = check(chemString);
    if (!Check.get("status")) { 
        var indexes = mistake(input, Check.get("pattern"));
        return {
            status: false, 
            msg: Check.get("msg"),
            indexes: indexes
        };
    }
    else {
        return {
            status: true,
            msg: null,
            indexes: null
        };
    }
}

// 化学式检查
function check(chemString) {
    // 方程等号检查、拆分为片段
    var CheckEqualMark = checkEqualMark(chemString);
    if (!CheckEqualMark.get("status")) { return CheckEqualMark; }
    var fractions = CheckEqualMark.get("return");
    
    // 检查反应物气体沉淀符号；删除气体沉淀符号
    var CheckPresGas = checkPresGas(fractions);
    if (!CheckPresGas.get("status")) { return CheckPresGas; }

    // 检查空反应物、生成物；拆分为分子
    var molecularsF = new Array();
    for (var i = 0; i < fractions.length; i++) {
        var CheckFraction = checkFraction(fractions[i]);
        if (!CheckFraction.get("status")) return CheckFraction;
        molecularsF.push(CheckFraction.get("return"));
    }

    // 检查分子、构造分子
    var CheckMolecular = checkMolecular(molecularsF);
    if (!CheckMolecular.get("status")) { return CheckMolecular; }
    var moleculars = CheckMolecular.get("return");

    // 构造矩阵
    var charact = new Charact(moleculars);

    // 调试输出
    // console.log(moleculars);
    // console.log(charact.getArray());

    // 检查系数
    var CheckCoefficient = checkCoefficient(charact);
    if (!CheckCoefficient.get("status")) { return CheckCoefficient; }

    return new Map([["status", true]]);
}

// 预处理：删除空格
function preProcess(chemString) {
    chemString = chemString.replace(/\s*/gi, "");
    return chemString;
}

// 方程等号检查、拆分为片段
function checkEqualMark(chemString) {
    var equalMark = chemString.match(/(->|=|<-|<->|<-->|<=>|<<=>|<=>>)((\[.*\])*)/gi);
    if (equalMark == null){
        return new Map([["status", false], 
            ["msg", "No equal marks found."], 
            ["pattern", /.+/g]]
        );
    }
    else if (equalMark.length > 1) {
        return new Map([["status", false], 
            ["msg", "More than one equal marks found."], 
            ["pattern", /(->|=|<-|<->|<-->|<=>|<<=>|<=>>)/g]]
        );
    }
    else {
        var fractions = chemString.split(equalMark[0]);
        return new Map([["status", true], ["return", fractions]]);
    }
}

// 检查反应物气体沉淀符号；删除气体沉淀符号
function checkPresGas(fractions) {
    if (fractions[0].match(/v|\(v\)|\^(\s*)\+|\^(\s*)$|\(\^\)/gi)) {
        return new Map([["status", false], 
            ["msg", "Precipitate or gas found in reactant."], 
            ["pattern", /v|\(v\)|\^(\s*)(?![1-9])|\(\^\)/g]]
        );
    }
    fractions[1] = fractions[1].replace(/v|\(v\)|\^(\s*)$|\(\^\)/gi, "");
    fractions[1] = fractions[1].replace(/\^(\s*)\+/gi, "+");
    return new Map([["status", true], ["return", ""]]);
}

// 检查空反应物、生成物；拆分为分子
function checkFraction(fraction) {
    if (!fraction.match(/[a-z|A-Z]/)) {
        return new Map([["status", false], ["msg", "No reactant or resultant found."], ["pattern", /.+/g]]);
    }
    var molecularsF = fraction.split(/\+(?!$|\+)/gi);
    if (molecularsF.length == 0) {
        return new Map([["status", false], ["msg", "No reactant or resultant found."], ["pattern", /.+/g]]);
    }
    return new Map([["status", true], ["return", molecularsF]]);
}

// 检查分子、构造分子
function checkMolecular(molecularsF) {
    try{
        var moleculars = new Array();
        for (var i = 0; i < molecularsF[0].length; i++) {
            moleculars.push(new Molecular(molecularsF[0][i], true));
        }
        for (var i = 0; i < molecularsF[1].length; i++) {
            moleculars.push(new Molecular(molecularsF[1][i], false));
        }
        return new Map([["status", true], ["return", moleculars]]);    
    } catch (err) {
        return new Map([["status", false], ["msg", "Wrong molecular found."], ["pattern", null]]);
    }
}

// 检查配平系数
function checkCoefficient(charact) {
    var Calc;
    try {
        Calc = calc(charact.getArray());
    } catch (error) {
        return new Map([["status", false], ["msg", "Error in coefficients calculation."], ["pattern", null]]);
    }
    if (!Calc.get("status")) { return Calc; }
    var coefficients = Calc.get("return");

    var originCoefficients = charact.getCoefficients();
    if (coefficients.toString() != originCoefficients.toString()) {
        // 调试输出
        // console.log([coefficients, originCoefficients]);
        return new Map([["status", false], ["msg", "Equation has wrong coefficients."], ["pattern", null]]);
    }
    return new Map([["status", true]]);
}

// 标红
function mistake(string, pattern) {
    if (pattern == null) { return null; }
    var result;
    var indexs = new Array();
    while ((result = pattern.exec(string)) != null) {
        indexs.push([result.index, result.index + result[0].length])
    }
    return indexs;
}