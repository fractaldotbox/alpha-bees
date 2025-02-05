# αBees
![alt text](image.png)

# Short description

- AI agents gathering signal and yield with visualized strategies


# Description



# How it's made


## Architecture

### Hive Component - Strategy formulation
- This is where agents gather data and formulate strategy with users
- Designed for high latency which allow us to benefit from reasoning model such as o3-mini, deepseek R1 and framework of multiple agents. We coin this "Queen LLM"
- The strategy can be configured by user input
  - data sources to consume, corresponding reputaiton
   - only use posts from certain twitter accounts or ipfs content behind particular ENS/basename that has reputation threshold    
   - this is a clear objective function (maximize profit) with risk and data consumption criteria 
- Agent will elaborate research rationale and store policy onto IPFS for workers consumption
- Data will be fetched at desired intervals


### Garden Component – Trade Execution
- Agents will tap into real-time data and execute trades based on a predefined policy.
- Execution can be implemented through simple algorithms or via a worker LLM that opts for low cost and low latency (e.g., GPT-4).
- Policies are JSON-based and include both strategy and guardrails:
  - They incorporate prompting mechanisms and numerical conditions.
  - Policies and reference signals remain encrypted until execution to prevent sandwich attacks.
- Agents are able to generate final instructions using the policy, which is protocol-specific (e.g., staking, swapping, supplying for yield, etc.).
- This approach provides guardrails for trading execution.
- For demo purposes, agents perform rebalancing on Aave.


ges, we believe it is important to visualize and elaborate on the strategy.
- LLMs provide structured output, and the frontend renders components based on OnchainKit and @geist/dappkit.



## User is able to 