const START_BATTLE = "START_BATTLE";
const BATTLE_COMMAND = "BATTLE_COMMAND";
const BATTLE_EVENT = "BATTLE_EVENT";
const REGISTER_DAMAGE_HIT = " REGISTER_DAMAGE_HIT";
const REGISTERED_DAMAGE_HITS_RESOLVE = " REGISTERED_DAMAGE_HITS_RESOLVE";
const END_BATTLE = "END_BATTLE";

const HIT_STORY_POINT = "HIT_STORY_POINT";
const STORY_EVENT = "STORY_EVENT";

export const startBattle = (scenario, attacker, targets) => ({
    type: START_BATTLE,
    scenario,
    attacker,
    targets,
});

export const battleCommand = (command, attacker, targets) => ({
    type: BATTLE_COMMAND,
    command,
    attacker,
    targets,
});

export const battleEvent = (event) => ({
    type: BATTLE_COMMAND,
    event
});

export const registerDamageHit = (attacker, target, damageDetails) => ({
    type: REGISTER_DAMAGE_HIT,
    attacker,
    target,
    damageDetails
});

export const registerDamageHit = () => ({
    type: REGISTERED_DAMAGE_HITS_RESOLVE,
});

//motives: won, lost, interrupted
export const endBattle = (motive) => ({
    type: END_BATTLE,
});

