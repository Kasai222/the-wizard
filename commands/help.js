exports.run = (client, message, args) => {
    message.channel.send({embed: {
    color: 3447003,
    title: `**Arguments for !test:**`,
    description: `
**!addname alias id** -- maps a nickname to a servant id (!addname garcher 11 -- adds the nickname garcher for servant id 11(emiya))

**!test servant(numeric id or nickname)** tests np damage for servant by id or nickname
**arguments for test:**
**fou/f** -- sets fou value, default 1000
**ce/c** -- sets atk from ce, default 0
**np1-5** -- sets np level, default 5
**<:baq:530648912000712704> cardmod/m** -- damage up for cardtype %(ex 50% manaburst = cardmod50)
**<:charisma:530646502163349504> atkmod/atk/attack/a** -- atk up %(ex 30% atk from waver skill = atk30)
**<:def:530648131361177600>defmod/def/defense/d** -- defense mod for target(def-30% for 30% defense down)
**<:npdmg:530647308703105025>npmod/n** -- np damage up(npmod80 for mlb black grail)
**<:special:530646892648988682><:crit:530646642567675914>powermod/power/p** -- attack vs xxx or from event ce's, for **NP and cards**
**<:overcharge:557318381456588821>supereffectivemod/se/super/s** -- extra bonus damage on **only np** vs trait(gil, carmilla, rama) 
**<:divinity:557318163168231435>flatdamage/ad/fd/dmg** -- raw damage added at the end, usually fd500 from waver's skill
**level/lvl/lv/l** -- level of attacking servant, default is max without grails
**<:NPInterlude:557297262376779806><:nolewd:557676710821101568>strengthen/str/lewd/interlude** -- str1 for np interlude str0 for no interlude, defaults typically match na availability
**npvalue/npv/npoverride** -- manually set np damage %, used to account for weird oc like arash mostly
**cardmultiplieroverride/cmv** -- override for buster 1.5x, arts 1x, quick 0.8x, combine with npv to fix space rin, 'cmv0.8'
**class or attribute for opponent** -- ex 'saber', 'sky', or 'alterego', will default to neutral damage
**specialDefenseMod/sdm** -- gawain mod, ex 'sdf40'
**verbose/v** -- more detailed output

**!cards** for a few more arguments you can use to test regular (non-extra for now) cards
**!refund** hopefully functional np refund calculator commands

**both of these list arguments that are added onto !test**`,
      
    }
    });
};