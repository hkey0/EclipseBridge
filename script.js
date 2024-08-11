// import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.2.umd.min.js';

async function getEclipseBalance(address) {
  const response = await fetch("https://mainnetbeta-rpc.eclipse.xyz/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    }),
  });

  const {
    result: { value },
  } = await response.json();
  return value / 1_000_000_000;
}


document.addEventListener("DOMContentLoaded", function () {
  if (window.self === window.top) {
    document.body.style.transform = "scale(1.6)";
  }
  document.getElementById("balance").value =
    `Your will see your Eclipse balance here.`;
  var web3 = new Web3(Web3.givenProvider);
  window.valid_address = false;

  document
    .getElementById("eclipse-wallet")
    .addEventListener("input", async function () {
      let data = document.getElementById("eclipse-wallet").value;
      console.log(data);
      if (data.length >= 41) {
        let balance = await getEclipseBalance(data)
          .then((b) => {
            console.log("Balance is ", b);
            window.valid_address = true;
            document.getElementById("balance").value =
              `Your Eclipse balance is: ${b}`;
            document.getElementById("bridge-button").disabled = null;
          })
          .catch((err) => {
            window.valid_address = false;
            document.getElementById("bridge-button").disabled = true;
          });
      }
    });

  async function testi() {
    connectBtn = document.getElementById("connect-button");
    walletArea = document.getElementById("sender-eth-addr");

    // switch to mainnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(1) }],
    });

    await window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
    connectBtn.innerText = "Logout";

    walletArea.value = (await web3.eth.getAccounts())[0];
  }

  testi();

  async function deposit() {
    let chain = await window.ethereum.chainId;
    if (chain != 0x1) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(1) }],
      });
    }

    eclipseAddr = document.getElementById("eclipse-wallet").value;
    amountinWei = ethers.utils.parseEther(
      document.getElementById("ether-amount").value,
    );

    console.log("Eclipse addr: ", eclipseAddr, amountinWei);
    var contract = new web3.eth.Contract(
      [
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "hexSolanaAddress",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "amountWei",
              type: "uint256",
            },
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      "0x83cb71d80078bf670b3efec6ad9e5e6407cd0fd1",
    );

    let ecipseAddrParam = ethers.utils.hexlify(
      ethers.utils.base58.decode(eclipseAddr),
    );
    contract.methods
      .deposit(ecipseAddrParam, amountinWei)
      .send({
        from: (await web3.eth.getAccounts())[0],
        value: amountinWei,
      })
      .once("transactionHash", (hash) => {
        window.open("https://etherscan.io/tx/" + hash);
        console.log("hash", hash);
      })
      .then(function (result) {
        console.log(result);
      });
  }

  document
    .getElementById("bridge-button")
    .addEventListener("click", async function () {
      deposit();
    });

  window.ethereum.on("accountsChanged", async () => {
    this.location.reload();
  });
});
