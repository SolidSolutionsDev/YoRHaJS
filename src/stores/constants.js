const moduleTypes = {
  kernel:"kernel",
  menu:"menu",
  battle:"battle",
  field:"field",
};
const menuCommands = {
    Attack: ["mainAttack"],
    Absorb: ["mainAbsorb"],
    Defense: ["mainDefense"],
};
const attackTypes = {
    colorAttack: 0,
    colorDefense: 1,
    colorAbsorb: 2,
};
const targetTypes = {
    enemies: 0,
    party: 1,
    self: 2
};
const attackData = {
    mainAttack: {
        label: "Color Attack",
        castingCost: 0,
        type: attackTypes.colorAttack,
        animation: "mainAttackAnimation",
        targets: [targetTypes.enemies],
        all: false,
    },
};

export const kernelConstants = {
    menuCommands,
    attackData,
    attackTypes,
    targetTypes,
    moduleTypes
};