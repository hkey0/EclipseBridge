document.addEventListener('DOMContentLoaded', function () {
    var web3 = new Web3(Web3.givenProvider);

    async function testi() {
        connectBtn = document.getElementById("connect-button");
        walletArea = document.getElementById("sender-eth-addr")

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


        let ecipseAddrParam = ethers.utils.hexlify(
            ethers.utils.base58.decode(eclipseAddr) 
        )


        contract.methods.deposit(ecipseAddrParam, String(amountinWei), 150 * (10**9)).send({ 
                from: (await web3.eth.getAccounts())[0], 
                value: amountinWei + 150 * (10**9)
            }).then(function (result) { console.log(result) })
    }


    document.getElementById('bridge-button').addEventListener('click', async function () {
        deposit();
    });

})
