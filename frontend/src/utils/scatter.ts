// @ts-nocheck

import { environment } from '@/environments/environment';
import { Ax } from '@/apis';
// import { LoginEOSService } from 'eos-ulm';
// import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export class ScatterService {
    initCounterErr = 0;
    contract = 'amax';
    spinnerRAM = false;
    mainDataRAM = {} as any;
    orderHistoryRAM = null;
    dataSourceRAM = null;
    unstaked = 0;
    staked = 0;
    balance = 0;
    ramPrice = '';
    donation = 0;
    contractKeys = {} as any;
    contractStruct = [];
    buyRAM = {
        eos: 0,
        kb: 0,
    };
    sellRAM = {
        eos: 0,
        kb: 0,
    };
    decimals = 4;
    public loginEOSService: LoginEOSService;

    constructor() {}

    getRam() {
        Ax.get(`/v1/get_table_rows/amax/amax/rammarket/10`)
            .then((res: any) => {
                console.log(123, res);
                this.countRamPrice(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    countRamPrice(res: any) {
        if (!res || !res.rows || !res.rows[0] || !res.rows[0].quote || !res.rows[0].base) {
            return console.error('data error', res);
        }
        let data = res.rows[0];
        let quoteBalance = Number(data.quote.balance.split(' ')[0]);
        let baseBalance = Number(data.base.balance.split(' ')[0]);
        this.ramPrice = ((quoteBalance / baseBalance) * 1024).toFixed(5);
    }

    getAccount() {
        this.spinnerRAM = true;
        Ax.get(`/v1/get_account/${this.loginEOSService.accountName}`).then(
            (res: any) => {
                this.mainDataRAM = res;
                this.getBalance();
                this.spinnerRAM = false;
            },
            error => {
                console.error(error);
                this.spinnerRAM = false;
            }
        );
    }

    getBalance() {
        Ax.get(`/v1/get_currency_balance/amax.token/${this.loginEOSService.accountName}/AMAX`)
            .then((res: any) => {
                this.unstaked = !res[0] ? 0 : Number(res[0].split(' ')[0]);
                if (this.mainDataRAM.voter_info && this.mainDataRAM.voter_info.staked) {
                    this.staked = this.mainDataRAM.voter_info.staked / 10000;
                }
                this.balance = this.unstaked + this.staked;
            })
            .catch(err => {
                console.log(err);
            });
    }
    getContract(name: string) {
        this.spinnerRAM = true;
        Ax.get(`/v1/get_code/${name}`)
            .then((res: any) => {
                //console.log(this.b64DecodeUnicode(res.abi));
                if (res && res.abi && res.abi.structs) {
                    this.contractStruct = res.abi.structs;
                    this.contractStruct.forEach((elem: any) => {
                        this.contractKeys[elem.name] = elem.fields;
                    });
                }
                this.spinnerRAM = false;
            })
            .catch(err => {
                console.log(err);
                this.spinnerRAM = false;
            });
    }

    funcBuyRAM(quantity: any) {
        if (!this.loginEOSService.accountName) {
            return console.error('Identity error!!!');
        }
        if (isNaN(Number(quantity))) {
            return console.error('Amount must be a number!');
        }
        if (environment.frontConfig.coin === 'WAX') {
            this.decimals = 8;
        }
        let amount = parseFloat(`${quantity}`).toFixed(this.decimals);
        let requiredFields = {
            accounts: [environment.network],
        };
        this.loginEOSService.eos
            .contract(this.contract, {
                requiredFields,
            })
            .then((contract: any) => {
                contract
                    .buyram(
                        {
                            payer: this.loginEOSService.accountName,
                            receiver: this.loginEOSService.accountName,
                            quant: `${amount} ${environment.frontConfig.coin}`,
                        },
                        this.loginEOSService.options
                    )
                    .then((trx: any) => {
                        console.log(trx);
                        this.saveOrder({ amount: this.buyRAM.kb * 1024, account: this.loginEOSService.accountName, type: 'buy', tx_id: trx.transaction_id, price: this.ramPrice });
                        this.getAccount();
                        this.buyRAM = {
                            eos: 0,
                            kb: 0,
                        };
                        this.loginEOSService.showMessage('Transaction Success');
                        this.loginEOSService.showMessage('Support our project, make a donation :)');
                    })
                    .catch((err: any) => {
                        this.loginEOSService.contractError(err);
                    });
            })
            .catch((err: any) => {
                this.loginEOSService.contractError(err);
            });
    }

    funcSellRAM(quantity: any) {
        if (!this.loginEOSService.accountName) {
            return console.error('Identity error!!!');
        }
        let amount = Number(quantity);
        if (isNaN(amount)) {
            return console.error('Amount must be a number!');
        }
        amount = parseInt(`${amount * 1024}`);
        let requiredFields = {
            accounts: [environment.network],
        };
        this.loginEOSService.eos
            .contract(this.contract, {
                requiredFields,
            })
            .then((contract: any) => {
                contract
                    .sellram(
                        {
                            account: this.loginEOSService.accountName,
                            bytes: amount,
                        },
                        this.loginEOSService.options
                    )
                    .then((trx: any) => {
                        console.log(trx);
                        this.saveOrder({ amount: amount, account: this.loginEOSService.accountName, type: 'sell', tx_id: trx.transaction_id, price: this.ramPrice });
                        this.getAccount();
                        this.sellRAM = {
                            eos: 0,
                            kb: 0,
                        };
                        this.loginEOSService.showMessage('Transaction Success');
                        this.loginEOSService.showMessage('Support our project, make a donation :)');
                    })
                    .catch((err: any) => {
                        this.loginEOSService.contractError(err);
                    });
            });
    }

    funcDonation(quantity: any) {
        if (!this.loginEOSService.accountName) {
            return console.error('Identity error!!!');
        }
        if (environment.frontConfig.coin === 'WAX') {
            this.decimals = 8;
        }
        let amount = Number(`${this.donation}`).toFixed(this.decimals);
        this.loginEOSService.eos
            .transfer(this.loginEOSService.accountName, 'eoswebnetbp1', `${amount} ${environment.frontConfig.coin}`, 'Donation', this.loginEOSService.options)
            .then((result: any) => {
                console.log(result);
                this.getAccount();
                this.loginEOSService.showMessage('Transaction Success');
                this.loginEOSService.showMessage('Thanks for donation :)');
                this.donation = 0;
            })
            .catch((err: any) => {
                this.loginEOSService.contractError(err);
            });
    }

    saveOrder(data: any) {
        Ax.post('/v1/ram_order', data).then(
            (res: any) => {
                this.getAccount();
                this.getOrderHistory();
            },
            (err: any) => {
                console.error(err);
            }
        );
    }

    getOrderHistory() {
        Ax.get(`/v1/ram_orders/${this.loginEOSService.accountName}`).then(
            (res: any) => {
                this.orderHistoryRAM = res;
                let ELEMENT_DATA: Element[] = res;
                this.dataSourceRAM = new MatTableDataSource<Element>(ELEMENT_DATA);
            },
            (err: any) => {
                console.error(err);
            }
        );
    }

    generateTransaction(vote: any) {
        if (!vote.voter.length) {
            return this.loginEOSService.contractError({ message: 'Please type Voter' });
        }
        this.loginEOSService.eos
            .contract(this.contract, {
                accounts: [environment.network],
            })
            .then((contract: any) => {
                contract
                    .voteproducer(
                        {
                            voter: vote.voter,
                            proxy: vote.proxy,
                            producers: vote.producers,
                        },
                        this.loginEOSService.options
                    )
                    .then((trx: any) => {
                        this.loginEOSService.showMessage('Transaction Success');
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    })
                    .catch(err => {
                        this.loginEOSService.contractError(err);
                    });
            })
            .catch(err => {
                this.loginEOSService.contractError(err);
            });
    }

    generateTrxTransfer(transfer) {
        if (!transfer.to.length || !transfer.amount.length) {
            return this.loginEOSService.contractError({ message: 'Please type account To and Amount' });
        }
        if (environment.frontConfig.coin === 'WAX') {
            this.decimals = 8;
        }
        let amount = Number(`${transfer.amount}`).toFixed(this.decimals) + ` ${transfer.symbol}`;
        this.loginEOSService.eos
            .transfer(this.loginEOSService.accountName, transfer.to, amount, transfer.memo, this.loginEOSService.options)
            .then(result => {
                this.loginEOSService.showMessage('Transaction Success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            })
            .catch(err => {
                this.loginEOSService.contractError(err);
            });
    }

    generateContractTransaction(fields, method, contractFieldsRender) {
        if (environment.frontConfig.coin === 'WAX') {
            this.decimals = 8;
        }
        let types = {};
        contractFieldsRender.forEach(elem => {
            types[elem.name] = elem.type;
        });
        Object.keys(fields).forEach(key => {
            if ((types[key] && types[key].indexOf('uint') >= 0) || types[key].indexOf('bool') >= 0 || types[key].indexOf('int') >= 0) {
                fields[key] = parseInt(fields[key]);
            }
            if (types[key] && types[key].indexOf('float') >= 0) {
                fields[key] = parseFloat(fields[key]);
            }
            if (types[key] && types[key].indexOf('asset') >= 0) {
                let elem = fields[key].split(' ');
                fields[key] = `${Number(elem[0]).toFixed(this.decimals)} ${elem[1]}`;
            }
            if (types[key] && types[key].indexOf('[]') >= 0) {
                fields[key] = fields[key].split(',').map(elem => {
                    return elem.replace(' ', '');
                });
            }
            if (types[key] && types[key].indexOf('bytes') >= 0) {
                fields[key] = this.convertToBytes(types[key]);
            }
            if (types[key] && types[key].indexOf('time_point_sec') >= 0) {
                fields[key] = Number(fields[key]);
            }
        });
        let requiredFields = {
            accounts: [environment.network],
        };
        this.loginEOSService.eos
            .contract(this.contract, {
                requiredFields,
            })
            .then(contract => {
                if (!contract[method]) {
                    return this.loginEOSService.contractError({ message: 'Incorrect Contract Method' });
                }
                contract[method](fields, this.loginEOSService.options)
                    .then(trx => {
                        this.loginEOSService.showMessage('Transactions success');
                    })
                    .catch(err => {
                        this.loginEOSService.contractError(err);
                    });
            })
            .catch(err => {
                this.loginEOSService.contractError(err);
            });
    }

    convertToBytes(string) {
        let bytes = [];
        for (let i = 0; i < string.length; ++i) {
            bytes.push(string[i].charCodeAt());
        }
        return bytes;
    }

    // ==== service end
}
