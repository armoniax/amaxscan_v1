import BigNumber from 'bignumber.js';
import moment from 'moment';

export const $BigNumber = (val:string | number = 1) => {
    return new BigNumber(val);
};

export const $shiftedBy = (data: number, acc:number) => {
    if(!data) return 0
    acc = Number(acc)
    return $BigNumber(data).shiftedBy(acc);
};

export const $toFixed = (data:any, acc:number): any => {
    if((!data && data != 0) || String(data).indexOf('--') != -1) return ''
    return $BigNumber(data).toFixed(acc, 1);
};
export const $toFixedFormat = (data:any, acc:number) => {
    if((!data && data != 0) || String(data).indexOf('--') != -1) return '0'
    return Number($BigNumber(data).toFixed(acc, 1));
};

// input val filter   e: React.FormEvent<HTMLInputElement>
export const $filterNumber = (e: any, decimal?: number) => {
    function clearNoNum(val:any) {
        // 先把非数字的都替换掉，除了数字和.
        val = val.replace(/[^\d.]/g, '');

        // 保证只有出现一个.而没有多个.
        val = val.replace(/\.{2,}/g, '.');

        // 必须保证第一个为数字而不是.
        val = val.replace(/^\./g, '');

        // 保证.只出现一次，而不能出现两次以上
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        return val
    }
    // return clearNoNum(value);
    e.target.value = clearNoNum(e.target.value);
    // setval && setval(clearNoNum(e.currentTarget.value))
}

export const $filterNumberDecimal = (value: string, decimal?: number) => {
    function clearNoNum(val:any) {
        // 先把非数字的都替换掉，除了数字和.
        val = val.replace(/[^\d.]/g, '');

        // 保证只有出现一个.而没有多个.
        val = val.replace(/\.{2,}/g, '.');

        // 必须保证第一个为数字而不是.
        val = val.replace(/^\./g, '');

        // 保证.只出现一次，而不能出现两次以上
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        const _last = val.split('.')
        if(decimal && _last[1]){
            return `${_last[0]}.${_last[1].substring(0,decimal)}`
        }else{
            return val
        }
        
    }
    return clearNoNum(value);
}

export const $numFormat = (val:string | number, flag:boolean = true) => {
    if( !val || !flag) return val;
    let reg = /(\d)(?=(?:\d{3})+$)/g;
    const strAry = val.toString().split('.')
    return `${strAry[0].replace(reg, '$1,')}${strAry.length > 1 ? "."+strAry[1] : ''}`
}

export const $dateFormat = (date:string | undefined, format:string = 'MM-dd hh:mm') => {
    if(!date) return '';
    return (new Date(date) as any).format(format)
}

export const $gt = (val:string | number, next:string | number) => {
    return new BigNumber(val).gt(next)
}

export const $lt = (val:string | number, next:string | number) => {
    return new BigNumber(val).lt(next)
}

export const $plus = (aryNumber: Array<string | number>, decimal: number = 2): number => {
    const sum:any = aryNumber.reduce((acc, cur) => {
        return (<any>new BigNumber(isNaN(<any>acc) ? 0 : acc)).plus(isNaN(<any>cur) ? 0 : cur);
    })
    return Number(sum.toFixed(decimal, 1))
}

export const $minus = (m1:string | number, m2:string | number, decimal: number = 2): number => {
    const diff:any = new BigNumber(m1).minus(m2)
    return Number(diff.toFixed(decimal, 1))
}

export const $inputNumber = (): string => {
    return window.innerWidth < 960 ? 'number' : 'text';
}

export const $moreLessThan =(value:string | number, acc = 4) => {
    const val = $BigNumber(value);
    return !val.isZero() && val.isLessThan(0.0001)
        ? '< 0.0001'
        : val.isNaN()
            ? value
            : Number(val.toFormat(acc));
}


export const $hash = (txHash:any, length: number = 4, lastLength?: number) => {
    if (!txHash) {
        return '--';
    }
    if(!lastLength) lastLength = length
    return (
        txHash.substring(0, length) +
        '...' +
        txHash.substring(txHash.length - lastLength, txHash.length)
    );
}



export const $utctimeToLocaltime = (time:string) =>{
    let utcTime;
    if(time.indexOf('T')) utcTime = time+'Z'
    else utcTime = time.replace(' ', 'T')+'Z';

    // let newDate:any = new Date(utcTime);
    // return newDate.format('yyyy-MM-dd hh:mm:ss')
    return moment(utcTime).format('yyyy-MM-DD hh:mm:ss')
    

}