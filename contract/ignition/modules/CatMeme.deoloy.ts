import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CatMemeModule = buildModule("CatMemeModule", (m) => {
  const lock = m.contract("CatMeme");

  return { lock };
});

export default CatMemeModule;
