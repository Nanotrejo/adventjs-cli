export { FunctionData, ChallengeData };

interface FunctionData {
  functionName: string;
  functionCode: string;
}

interface ChallengeData {
  description: string;
  functionData: FunctionData;
}
