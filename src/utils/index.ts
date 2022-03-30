import { environment } from '@/environments/environment';

const frontConfig = environment.frontConfig;

export const sortArray = (data: any[], ungerKey = 'EOS1111111111111111111111111111111114T1Anm'): any[] => {
    if (!data) {
        return [];
    }
    let result: any[] = [];
    data.sort((a, b) => {
        return b.total_votes - a.total_votes;
    }).forEach((elem, index) => {
        if (elem.producer_key === ungerKey) {
            return;
        }
        let eos_votes = Math.floor(calculateEosFromVotes(elem.total_votes));
        elem.all_votes = elem.total_votes;
        elem.total_votes = Number(eos_votes).toLocaleString();

        result.push(elem);
    });
    return result;
};

export const calculateEosFromVotes = (votes: number) => {
    let date = +new Date() / 1000 - 946684800; // 946... start timestamp
    if (frontConfig.coin === 'WAX') {
        let weight = parseInt(`${date / (86400 * 7)}`, 10) / 13;
        return votes / 2 ** weight / 100000000;
    }
    let weight = parseInt(`${date / (86400 * 7)}`, 10) / 52; // 86400 = seconds per day 24*3600
    return votes / 2 ** weight / 10000;
};
