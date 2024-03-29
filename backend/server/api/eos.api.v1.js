/*
   Created by eoswebnetbp1
*/

const async = require('async');
const path = require('path');
const customFunctions = require('./eos.api.v1.custom');

module.exports 	= (router, config, request, log, mongoMain, MARIA) => {

	const STATS_AGGR 	= require('../models/api.stats.model')(mongoMain);
	const STATS_ACCOUNT = require('../models/api.accounts.model')(mongoMain);
	const RAM 			= require('../models/ram.price.model')(mongoMain);
	const RAM_ORDERS 	= require('../models/ram.orders.model')(mongoMain);
	const TRX_ACTIONS 	= require('../models/trx.actions.history.model')(mongoMain);
	const PRODUCERS 	= require('../models/producers.model')(mongoMain);

    //============ HISTORY API

	/**
	 * POST - /api/v1/search
	 * @body {string} text - search input text.
	 */

	router.post('/api/v1/search', (req, res) => {
		let text = req.body.text;

		if (!text) {
			return res.status(501).send('Wrong search input!');
		}

		async.parallel({
			block: (cb) =>{
				if (!isNaN(text)) {	//text is a block number
					log.info("search block: " + text);
        			global.eos.getBlock({ block_num_or_id: text })
						.then(result => {
							cb(null, result);
						})
						.catch(err => {
							log.error(err);
							cb(null, null);
						});
				} else {
					cb(null, null);
				}
			},
			transaction: (cb) =>{
				if (text.length == 64) {	//TxID length
					log.info("search TxID: " + text);
					global.eos.getTransaction({ id: text })
						.then(result => {
							cb(null, result);
						})
						.catch(err => {
							cb(null, null);
						});
				} else { 
					cb(null, null);
				}
			},
			account: (cb) =>{
				if (text.length <= 12) {	//Account name length
					log.info("search account_name: " + text);
					global.eos.getAccount({ account_name: text })
						.then(result => {
							cb(null, result);
						})
						.catch(err => {
							cb(null, null);
						});
				} else {
					cb(null, null);
				}
			},
			pubkey: (cb) => {
				if (text.length == 52) {	//PubKey length
					log.info("search public_key: " + text);
					
					let data = { keys: [text] };
					fetch(`${config.customChain}/v1/chain/get_accounts_by_authorizers`, {
						method: 'POST',
						body: JSON.stringify(data)
					}).then(response => response.json())
					// request.post({url:`${config.customChain}/v1/chain/get_accounts_by_authorizers`, json: data })
					.then(result => {
						console.log('success-----', result)
						cb(null, result);
					}).catch(err => {
						console.log('err------', err)
						cb(null, null);
					});

				} else {
					cb(null, null);
				}
			}
		}, (err, result) => {
			if (err){
				// log.error(err);
				return res.status(501).end();
			}
			res.json(result);
		});
	});

	router.get('/api/v1/get_producers_bp_json', (req, res) => {
		PRODUCERS.find({}, (err, result) => {
			if (err){
				log.error(err);
				return res.status(501).end();
			}
			res.json(result);
		});
	});

	router.post('/api/v1/get_account_tokens', (req, res) => {
		 let account = req.body.account;
	   	 request.get(config.tokensAPI + account).pipe(res);
	});

	/*
	* router - ram_order
	* params - offset
	*/
	router.post('/api/v1/ram_order', (req, res) => {
		 let type 		= req.body.type;
		 let tx_id 		= req.body.tx_id;
		 let account 	= req.body.account;
		 let amount 	= req.body.amount;
		 let price 		= req.body.price;

		 let order = new RAM_ORDERS({
		 		type: type,
		 		tx_id: tx_id,
		 		account: account,
		 		amount: amount,
		 		price: price
		 });

		 order.save(err => {
		 	if (err){
		 		log.error(err);
		 		return res.status(500).end();
		 	}
		 	res.json({ message: 'order successfully saved' });
		 });
	});

	/*
	* router - get_analytics
	* params - offset
	*/
	router.post('/api/v1/get_trx_actions', (req, res) => {
		 TRX_ACTIONS.aggregate()
		 			.match({ date: { $gte : new Date(req.body.date) } })
		 			.sort({ date: 1 })
		 			.group({
		 				_id: {
            					year: { $year: "$date" },
            					dayOfMonth: { $dayOfMonth: "$date" },
            					month: { $month: "$date" },
        				},
        				transactions: { "$push": "$transactions" },
        				actions: { "$push": "$actions" }
		 			})
		 			.exec((err, result) => {
		 				if (err){
		 					log.error(err);
		 					return res.status(500).end();
		 				}
		 				res.json(result);
		 			});
	});
	/*
	* router - ram_orders
	* params - offset
	*/
	router.get('/api/v1/ram_orders/:account', (req, res) => {
		RAM_ORDERS.find({ account: req.params.account })
		  .sort({ date: -1 })
		  .exec((err, result) => {
		 	if (err){
		 		log.error(err);
		 		return res.status(500).end();
		 	}
		 	res.json(result);
		 });
	});

	/*
	* router - get_accounts_analytics
	* params - offset
	*/
	router.get('/api/v1/get_accounts_analytics/:offset', (req, res) => {
		log.info("get_accounts_analytics invoked");

		 STATS_ACCOUNT.find()
	   	 		.sort({ unstaked: -1 })
	   	 		.limit(Number(req.params.offset))
	   	 		.exec((err, result) => {
	   	 		if (err){
	   	 			// log.error(err);
	   	 			return res.status(500).end();
	   	 		}

	   	 		res.json(result);
	   	 });
	});

	/*
	* router - get_chart_ram
	* params - offset
	*/
	router.post('/api/v1/get_chart_ram', async (req, res) => {
	   	let result;
	   	let interval 	= 3; // mins.
	   	let dateFrom 	= (req.body.from === 0) ? 0 : +new Date(req.body.from);
	   	let week 		= +new Date() - 8 * 7 * 24 * 3600000;
	   	let month 		= +new Date() - 32 * 7 * 24 * 3600000;
	   	let match 		= (dateFrom === 0) ? {} : { date : { $gte: new Date(dateFrom) } };

	   	if (dateFrom > month && dateFrom < week) {
	   		interval = 60; // mins
	   	} else if (dateFrom === 0){
			interval = 180; // mins
	   	}

	   	let query = [
	   		{ $match: match },
  			{ $group: {
  			  _id: {
  			    $toDate: {
  			      $subtract: [
  			        { $toLong: "$date" },
  			        { $mod: [ { "$toLong": "$date" }, 1000 * 60 * interval ] }
  			      ]
  			    }
  			  },
  			  first: { $first: { quote: "$quote", base: "$base" } }
  			}},
  			{ $sort: { _id: 1 } }
	   	];

	   	try {
	   		result = await RAM.aggregate(query);
	   	} catch (err){
			log.error(err);
	   	 	return res.status(500).end();
	   	}
	   	res.json(result);
	});

	/*
	* router - get_block
	* params - block_num_or_id
	*/
	router.get('/api/v1/get_block/:block_num_or_id', (req, res) => {
		if (!isNaN(req.params.block_num_or_id)) {
	   	 	global.eos.getBlock({ block_num_or_id: req.params.block_num_or_id })
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
		}
	});

    /*
	* router - get_last_blocks
	* params - offset (number of last blocks you want to get)
	*/
	router.get('/api/v1/get_last_blocks/:offset', (req, res) => {
		let elements = [];
		let offset = req.params.offset;
		for(let i = 0; i <= offset; i++){
			elements.push(i);
		}
		customFunctions.getLastBlocks(eos, elements, (err, result) => {
				if (err){
					log.error(err);
					return res.status(501).end();
				}
				res.json(result);
		});
	});

    /*
	* router - get_aggregation_stat
	*/
	router.get('/api/v1/get_aggregation_stat', (req, res) => {
		STATS_AGGR.findOne({}, (err, result) => {
			if (err){
				log.error(err);
				return res.status(501).end();
			}
			res.json(result);
		});
	});

    /*
	* router - get blocks producers
	*/
	router.get('/api/v1/get_producers/:offset', (req, res) => {
	   	 global.eos.getProducers({
      			json: true,
      			lower_bound: "string",
      			limit: req.params.offset
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get code
	* params - account name
	*/
	router.get('/api/v1/get_code/:account', (req, res) => {
	   	 	let data =  {
				account_name: req.params.account
			};
	   	 	request.post({url: `${config.customChain}/v1/chain/get_abi`, json: data }).pipe(res);
	});

    /*
	* router - get code
	* params - account name
	*/
	router.get('/api/v1/get_raw_code_and_abi/:account', (req, res) => {
			let data =  {
				account_name: req.params.account
			};
	   	 	request.post({url: `${config.customChain}/v1/chain/get_raw_code_and_abi`, json: data }).pipe(res);
	});

    /*
	* router - get currency balance
	*/
	router.get('/api/v1/get_currency_balance/:code/:account/:symbol', (req, res) => {
	   	 global.eos.getCurrencyBalance({
      			code: req.params.code,
      			account: req.params.account,
      			symbol: req.params.symbol
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get_table_rows
	*/
	router.get('/api/v1/get_table_rows/:code/:scope/:table/:limit', (req, res) => {
	   	 global.eos.getTableRows({
			      json: true,
			      code: req.params.code,
			      scope: req.params.scope,
			      table: req.params.table,
			      table_key: "string",
			      lower_bound: "0",
			      upper_bound: "-1",
			      limit: req.params.limit
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get_table_rows producers
	*/
	router.get('/api/custom/get_table_rows/:code/:scope/:table/:limit', (req, res) => {
		let formData = { json: true,
			      code: req.params.code,
			      scope: req.params.scope,
			      table: req.params.table,
			      limit: req.params.limit
		};
	   	request.post({url:`${config.customChain}/v1/chain/get_table_rows`, json: formData}).pipe(res);
	});

	router.post('/api/producer', (req, res) => {
		if (req.body.url && req.body.url.indexOf('eosweb.net') >= 0 ){
			return res.sendFile(path.join(__dirname, '../../bp.json'));
		}
	   	request.get(`${req.body.url}`).pipe(res);
	});

	/*
	* router - get_actions by account name
	* params - account_name, position, offset
	*/
	// router.get('/api/v1/get_actions/:account_name/:position/:offset', (req, res) => {
	//    	let formData = { 
	// 			json: true,
	// 		    account_name: req.params.account_name,
	//    	 		pos: req.params.position,
	//    	 		offset: (config.historyNewAPI) ? Math.abs(req.params.offset) : req.params.offset,
	//    	 		counter: 1
	// 	};
	//    	request.post({url:`${config.historyChain}/v1/history/get_actions`, json: formData}).pipe(res);
	// });

	/*
	* router - get_actions by account name
	* params - account_name, position, offset
	*/
	router.get('/api/v1/get_actions/:account/:pos/:offset', (req, res) => {
		let data = { 
			account_name: req.params.account, 
			pos: req.params.pos,
			offset: req.params.offset,
		};
	   	request.post({url:`${config.historyChain}/v1/history/get_actions`, json: data }).pipe(res);
	});

	/*
	* router - get_actions by action name
	* params - account_name, position, offset
	*/
	router.get('/api/v1/get_actions_name/:account_name/:action_name', (req, res) => {
		let queryString = '?';
		let	accountName = req.params.account_name;
		let	actionName 	= req.params.action_name;
	   	let skip = (req.query.skip) ? queryString += `skip=${req.query.skip}` : queryString;
	   	let	limit = (req.query.limit) ? queryString += `&limit=${req.query.limit}` : queryString;
	   	let	sort = (req.query.sort) ? queryString += `&sort=${req.query.sort}` : queryString;
	   	
	   	request.get(`${config.historyChain}/v1/history/get_actions/${accountName}/${actionName}${queryString}`).pipe(res);
	});

	/*
	* router - get_voters by action name
	* params - account_name, position, offset
	*/
	router.get('/api/v1/get_voters/:account_name', (req, res) => {
		let queryString = '?';
		let	accountName = req.params.account_name;
	   	let skip = (req.query.skip) ? queryString += `skip=${req.query.skip}` : queryString;
	   	let	limit = (req.query.limit) ? queryString += `&limit=${req.query.limit}` : queryString;
	   	let	sort = (req.query.sort) ? queryString += `&sort=${req.query.sort}` : queryString;
	   	request.get(`${config.historyChain}/v1/history/get_voters/${accountName}${queryString}`).pipe(res);
	});

	/*
	* router - get_transactions
	* params - null
	*/
	router.get('/api/v1/get_transactions', (req, res) => {
		global.eos.getTransactions({})
			.then(result => {
				res.json(result);
			})
			.catch(err => {
				log.error(err);
				res.status(501).end();
			});
	});
	/*
	* router - get_transaction
	* params - transaction_id_type
	*/
	router.get('/api/v1/get_transaction/:trx_id', (req, res) => {
		let data = { id: req.params.trx_id };
	   	request.post({url:`${config.historyChain}/v1/history/get_transaction`, json: data }).pipe(res);
	});

    /*
	* router - get_accounts_by_authorizers
	* params - name
	*/
	router.get('/api/v1/get_accounts_by_authorizers/:pubkey', (req, res) => {
	   	let data = { keys: [req.params.pubkey] };
	   	request.post({url:`${config.customChain}/v1/chain/get_accounts_by_authorizers`, json: data }).pipe(res);
	});

	/*
	* router - get_account_controlled
	* params - name
	*/
	router.get('/api/v1/get_controlled_accounts/:acccount', (req, res) => {
	   	let data = { controlling_account: req.params.acccount };
	   	request.post({url:`${config.historyChain}/v1/history/get_controlled_accounts`, json: data }).pipe(res);
	});


	/*
	* router - get_info
	*/
	router.get('/api/v1/get_info', (req, res) => {
      	// console.log(req);
		global.eos.getInfo({})
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			log.error(err);
			res.status(501).end();
		});
	});
	//============ END of HISTORY API


	//============ CHAIN API
	/*
	* router - get_currency_stats
	* params - code: 'name', symbol: 'string'
	*/
	router.get('/api/v1/get_currency_stats/:code/:symbol', (req, res) => {
	   	global.eos.getCurrencyStats({
			code: req.params.code,
			symbol: req.params.symbol
		})
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			log.error(err);
			res.status(501).end();
		});
	});
	//============ END of CHAIN API

	//============ Account API
	/*
	* router - get_account
	* params - name
	*/
	router.get('/api/v1/get_account/:name', (req, res) => {
		if (req.params.name && 
			req.params.name.length <= 12 &&
			req.params.name != 'undefined') {
	   	 	global.eos.getAccount({
	   	 		account_name: req.params.name
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		// log.error(err);
	   	 		res.status(501).end();
	   	 	});
		}
	});

	//============ END of Account API

	//============ Prod API
	/*
	* router - get_currency_stats
	* params - name
	*/
	router.get('/api/v1/get_currency_stats/:code/:symbol', (req, res) => {
	   	 global.eos.getAccount({
	   	 		code: req.params.code,
	   	 		//symbol: req.params.symbol
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		// log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});
	/*
	*	get account if in blacklist
	*/
	router.post('/api/v1/get_blacklist/:account', (req, res) => {
		var account = req.params.account
		let data = { 
			"code": "amax.token",
			"scope": "amax.token",
			"table": "blacklist",
			"lower_bound": account,
			"upper_bound": account,
			"limit": 1,
			"json": true
		 };
	   	request.post({url:`${config.customChain}/v1/chain/get_table_rows`, json: data }).pipe(res);
	});
	//============ END of Account API

// ============== end of exports
};
