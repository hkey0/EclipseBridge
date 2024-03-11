// import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.2.umd.min.js';

document.addEventListener('DOMContentLoaded', function () {

    var web3 = new Web3(Web3.givenProvider);


    async function testi() {
        connectBtn = document.getElementById("connect-button");
        walletArea = document.getElementById("sender-eth-addr")

        // switch to sepolia
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.utils.toHex(11155111) }],
            });

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        connectBtn.innerText = 'Logout';

        walletArea.value = (await web3.eth.getAccounts())[0]
    }

    testi();
    async function deposit() {
        
        let chain = await window.ethereum.chainId
        if (chain != 0xaa36a7) {
         await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.utils.toHex(11155111) }],
            });
        }
        
        eclipseAddr = document.getElementById("eclipse-wallet").value;
        amountinWei = document.getElementById('ether-amount').value * (10**18)


        console.log("Eclipse addr: ", eclipseAddr, amountinWei)


        var contract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "hexSolanaAddress",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountWei",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "feeWei",
                        "type": "uint256"
                    }
                ],
                "name": "deposit",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ], "0x7C9e161ebe55000a3220F972058Fb83273653a6e")


        let ecipseAddrParam = ethers.utils.hexlify(ethers.utils.base58.decode(eclipseAddr))

        contract.methods.deposit(ecipseAddrParam, String(amountinWei), 200 * (10**9)).send({ 
                from: (await web3.eth.getAccounts())[0], 
                value: amountinWei + 200 * (10**9)
            }).once("transactionHash", (hash) => {
                window.open("https://sepolia.etherscan.io/tx/" + hash)
                console.log("hash", hash)
            }).then(function (result) { console.log(result) })
    }


    document.getElementById('bridge-button').addEventListener('click', async function () {
        deposit();
    });

    window.ethereum.on('accountsChanged', async () => {
        this.location.reload()
    });

})
