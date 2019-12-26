exports.run = (client, message, args) => {
    message.channel.send({embed: {
    color: 3447003,
    title: `Refund sim:`,
    description: `
**<:npgen:530647914163470347> npgain/npgen/ng** - ng50 for 50% golden rule etc
**enemyhp/hp** - target hp, entering target hp will trigger np gen calc, remember enemy class / cardmod can affect this, uses min roll damage to calculate overkill
**enemyservermod/esm/sm** - defaults based on enemy class to
    rider - 1.1,
    caster - 1.2,
    assassin - 0.9,
    berserker - 0.8,
    mooncancer - 1.2

    anything else - 1

    this input currently overrides the class mod, so you'll have to reaccount for it youself, ex: caster 1.2x * undead 1.2x = esm1.44
 	    	not sure if there's ever a case where it's not just 1.2x the class multiplier, though

**af** - arts first card bonus
`,
      
    }
    });
};