  import {
    Finding,
    FindingSeverity,
    FindingType,
    HandleTransaction,
    TransactionEvent,
    ethers
  } from 'forta-agent'
  import BigNumber from 'bignumber.js'

  export const MONITORED_ADDRESS = ("0xb77d084F2075273e7fA1dcd49EBe0B68ac9E0b0e").toLocaleLowerCase();

  export const sentEthThreshold = "100000000000000000" //0.1 ETH

  const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  const fromAddress = txEvent.transaction.from
  const to = txEvent.transaction.to
  const ethSent = txEvent.transaction.value

  const ethSentBigNumber = new BigNumber(ethSent)

  // if to address doesn't exist
  if(to === null){
    return findings;
  }

  console.log(fromAddress, "from")
  console.log(MONITORED_ADDRESS, "monitored")


  // if from address doesn't exist
  if(!fromAddress){
    return findings;
  }

  if(fromAddress != MONITORED_ADDRESS){
    console.log("from and monitor address are not the same")
    return findings;
  }


  if(ethSentBigNumber.isGreaterThanOrEqualTo(sentEthThreshold )) {
      findings.push(
        Finding.fromObject({
          name: `Eth Threshold Reached for ${MONITORED_ADDRESS}`,
          description: `ETH above .1 sent from ${MONITORED_ADDRESS} to ${to} ${ethers.utils.formatEther(txEvent.transaction.value)} ETH sent`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
        })
      );
  }
  return findings;
  };

  export default {
    handleTransaction
  };
