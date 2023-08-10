import { 
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  createTransactionEvent,
  ethers
} from "forta-agent"
import agent, { MONITORED_ADDRESS } from "./agent"

describe("wallet monitoring agent", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(()=>{
    handleTransaction = agent.handleTransaction;
  })

  describe("handle transaction",()=>{
    it("returns empty array if the moniroted wallet is not part of the transaction", async () =>{
    const transactionEvent = createTransactionEvent({
      transaction: {
        from: "0x6316312f6061780663c67ca03d7919b924d013be",
        to: "0x6316312f6061780663c67ca03d7919b924d013be"
      } as any,
      logs: [],
      contractAddress: null,
      block: [] as any,
    })
      const findings = await handleTransaction(transactionEvent)
      expect(findings).toStrictEqual([])
    })

    it("returns empty array when the monitored wallet send ETH is not above .1 ETH", async ()=>{
      const sentEthThreshold = "50000000000000000" //0.1 ETH

      const transactionEvent = createTransactionEvent({
        transaction: {
          from: "0x6316312f6061780663c67ca03d7919b924d013be",
          to: "0x6316312f6061780663c67ca03d7919b924d013be",
          value: sentEthThreshold
        } as any,
        logs: [],
        contractAddress: null,
        block: [] as any,
      })

      const findings = await handleTransaction(transactionEvent)
      expect(findings).toStrictEqual([])
    })

    it("returns findings when the monitored wallet sends .1 ETH or above", async ()=>{
      const sentValue = "50000000000000000000" //0.1 ETH
      
      const toAddress = "0x6316312f6061780663c67ca03d7919b924d013be"
      const fromAddress = "0xb77d084F2075273e7fA1dcd49EBe0B68ac9E0b0e".toLocaleLowerCase()

      const transactionEvent = createTransactionEvent({
        transaction: {
          from: fromAddress,
          to: toAddress,
          value: sentValue
        } as any,
        logs: [],
        contractAddress: null,
        block: [] as any,
      })

      const findings = await handleTransaction(transactionEvent)
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: `Eth Threshold Reached for ${MONITORED_ADDRESS}`,
          description: `ETH above .1 sent from ${MONITORED_ADDRESS} to ${toAddress} ${ethers.utils.formatEther(sentValue)} ETH sent`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
        })
      ])
    })
  })
  
})
