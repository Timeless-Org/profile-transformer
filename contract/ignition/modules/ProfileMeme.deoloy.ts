import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProfileMemeModule = buildModule("ProfileMemeModule", (m) => {
  const lock = m.contract("ProfileMeme");

  return { lock };
});

export default ProfileMemeModule;
