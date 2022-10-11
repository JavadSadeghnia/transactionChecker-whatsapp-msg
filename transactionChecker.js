const Web3 = require('web3');
const wbm = require('wbm');

class TransactionChecker {
    web3;
    account;

    constructor(projectId, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://Goerli.infura.io/v3/4adb25ba68ee4df7a3129096d5cff115'));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);

                let x = tx.to?.toLowerCase()|| ''
                if (this.account == x) {
                    console.log('Transaction found to your wallet on block: ' + number);
                    console.log('from',{address: tx.from},'to',{address: tx.to, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                    
                    wbm.start().then(async () => {
                        const phones = ['+989354527957'];
                        const message = 'Transaction found to your wallet.';
                        await wbm.send(phones, message);
                        await wbm.end();
                    }).catch(err => console.log(err));
                }

                if (this.account == tx.from.toLowerCase()) {
                    console.log('Transaction found from your wallet on block: ' + number);
                    console.log('from',{address: tx.from},'to',{address: tx.to, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});

                    wbm.start().then(async () => {
                        const phones = ['+989354527957'];
                        const message = 'Transaction found from your wallet.';
                        await wbm.send(phones, message);
                        await wbm.end();
                    }).catch(err => console.log(err));
                }


            }
        }
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0x8cb72A8D2fb86bEB75ECED30C957F7aA8F839AA4');
setInterval(() => {
    txChecker.checkBlock();
}, 14 * 1000);