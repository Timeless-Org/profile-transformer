import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CatMemeModule = buildModule("ShoulderCatMemeModule", (m) => {
  const lock = m.contract("ShoulderCatMeme");

  return { lock };
});

export default CatMemeModule;
