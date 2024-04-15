import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProfileMemeModule = buildModule("ProfileMemeModule", (m) => {
  const contract = m.contract("ProfileMeme", [
    "https://res.cloudinary.com/dtwhotpyc/",
  ]);

  return { contract };
});

export default ProfileMemeModule;
